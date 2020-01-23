import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Status } from "./status";
import { LocalStorageService } from 'ngx-webstorage';
import {
  Headers,Jsonp,
} from '@angular/http';

import * as moment from 'moment';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
      private http: HttpClient,
      private jsonp: Jsonp,
      private localStorageService: LocalStorageService,
      private loadingController: LoadingController,
  ) { }

  private log(message: string) {
    console.log(message);
  }


  overall = {
      Id:1,
      State: 'None',  
      LastUpdated: null
  };
  coreServices = [];
  gameServices: [];
  appServices: [];

  
  async getDefaultStatus(){
      const loading = await this.loadingController.create({
          cssClass: 'custom-loading',
          spinner:'dots',
          duration: 2000,
      });
      await loading.present();

      let cache_Overall = this.localStorageService.retrieve("LiveStatus_Overall");
      let cache_Core = this.localStorageService.retrieve("LiveStatus_Core");
      let cache_Games = this.localStorageService.retrieve("LiveStatus_Games");
      let cache_Apps = this.localStorageService.retrieve("LiveStatus_Apps");
      if(cache_Overall!=null)
      { 
          this.overall = cache_Overall;
          this.coreServices = cache_Core;
          this.gameServices = cache_Games;
          this.appServices = cache_Apps;
          loading.dismiss();
      }
      else
      {
          this.getOverallData().subscribe(data => 
          {
              this.overall = data["Status"]["Overall"];
              this.coreServices = data["CoreServices"]
              this.gameServices = data["Games"]
              this.appServices = data["Apps"]

              this.localStorageService.store("LiveStatus_Overall", this.overall);
              this.localStorageService.store("LiveStatus_Core", this.coreServices);
              this.localStorageService.store("LiveStatus_Games", this.gameServices);
              this.localStorageService.store("LiveStatus_Apps", this.appServices);
              loading.dismiss();
          });
      }
    }

    async forceRefreshStatus(){
        const loading = await this.loadingController.create({
            cssClass: 'custom-loading',
            spinner:'dots',
            duration: 2000,
        });
        await loading.present();

        this.getOverallData().subscribe(data => 
        {
            this.overall = data["Status"]["Overall"];
            this.coreServices = data["CoreServices"]
            this.gameServices = data["Games"]
            this.appServices = data["Apps"]

            this.localStorageService.store("LiveStatus_Overall", this.overall);
            this.localStorageService.store("LiveStatus_Core", this.coreServices);
            this.localStorageService.store("LiveStatus_Games", this.gameServices);
            this.localStorageService.store("LiveStatus_Apps", this.appServices);
            loading.dismiss();
        });
      }

      async silenceRefreshStatus(){
          this.getOverallData().subscribe(data => 
          {
              this.overall = data["Status"]["Overall"];
              this.coreServices = data["CoreServices"]
              this.gameServices = data["Games"]
              this.appServices = data["Apps"]
  
              this.localStorageService.store("LiveStatus_Overall", this.overall);
              this.localStorageService.store("LiveStatus_Core", this.coreServices);
              this.localStorageService.store("LiveStatus_Games", this.gameServices);
              this.localStorageService.store("LiveStatus_Apps", this.appServices);
          });
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

  utcToLocal(str, format="YYYY-MM-DD HH:mm:ss"){
      let localTime = moment.utc(str).toDate();
      return moment(localTime).format(format).toString();
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error); 
      this.log(`${operation} failed: ${error.message}`);

      return of(result as T);
    };
  }
}
