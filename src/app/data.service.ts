import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Status } from "./status";
import { LocalStorageService } from 'ngx-webstorage';


@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient,
    private localStorageService: LocalStorageService) { }

  private log(message: string) {
    console.log(message);
  }

  getData(locale: String): Observable<any> {

    const serviceUrl = 'http://notice.xbox.com/xocdata/xml/'+locale+'/servicestatusv3.xml?id=1'; 
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin*':'*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS, POST, PUT',
        'Access-Control-Allow-Headers':'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
      }),
      body: ''
    };

    return this.http.post<any>(serviceUrl, httpOptions)
      .pipe(
        tap(heroes => this.log('fetched live status xml')),
        catchError(this.handleError('getLiveStatusData', []))
      );
  }

  getOverallData(): Observable<any> {

    let locale = this.localStorageService.retrieve("LiveStatus_Locale");
    const serviceUrl = 'http://notice.xbox.com/ServiceStatusv5/'+locale+'?id=1'; 
    const httpOptions = {
        headers: new HttpHeaders({ 
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin*':'*',
            'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS, POST, PUT',
            'Access-Control-Allow-Headers':'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
        }),
        body: ''
    };

    return this.http.post<any>(serviceUrl, httpOptions)
    .pipe(
        tap(data => this.log('fetched overall status xml')),
        catchError(this.handleError('getLiveStatusData', []))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); 
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}
