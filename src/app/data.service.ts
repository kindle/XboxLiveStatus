import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';
import { LoadingController, PopoverController, AlertController } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class DataService {

    private initCache(key, ref, value){
        let cachedItem = this.localStorageService.retrieve(key);
        if(cachedItem!=null){
            if(key=="LiveStatus_Settings_ShowNotify")
                this.showNotify = cachedItem;
            if(key=="LiveStatus_Settings_Locale")
                this.locale = cachedItem;
            if(key=="LiveStatus_SubArray")
                this.subArray = cachedItem;
            if(key=="LiveStatus_NoticeArray")
                this.noticeArray = cachedItem;
        }
        else{
            if(key=="LiveStatus_Settings_ShowNotify")
                this.showNotify = value;
            if(key=="LiveStatus_Settings_Locale")
                this.locale = value;
            if(key=="LiveStatus_SubArray")
                this.subArray = value;
            if(key=="LiveStatus_NoticeArray")
                this.noticeArray = value;
        }
    }

    showNotify; //boolean
    locale; //en-US
    changeNotify(){
        this.localStorageService.store("LiveStatus_Settings_ShowNotify", this.showNotify);
    }

    subArray;
    noticeArray;

    showTabText = false;
    hideTabText(){
        this.showTabText = false;
    }

    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService,
        private loadingController: LoadingController,
        private notification: LocalNotifications,
        private popoverController: PopoverController,
        private alertController: AlertController,
    ) {}

    overall = {
        Id:1,
        State: 'None',  
        LastUpdated: null
    };

    coreServices = [];
    gameServices: [];
    appServices: [];

    updateStatus(data){
        this.overall = data["Status"]["Overall"];

        this.checkSubUpdate(data);
        
        this.coreServices = data["CoreServices"]
        this.gameServices = data["Games"]
        this.appServices = data["Apps"]

        this.localStorageService.store("LiveStatus_Overall", this.overall);
        this.localStorageService.store("LiveStatus_CoreServices", this.coreServices);
        this.localStorageService.store("LiveStatus_Games", this.gameServices);
        this.localStorageService.store("LiveStatus_Apps", this.appServices);
    }
    
    async getDefaultStatus(){
        const loading = await this.loadingController.create({
            cssClass: 'custom-loading',
            spinner:'dots',
            duration: 2000,
        });
        await loading.present();

        this.initCache("LiveStatus_Settings_ShowNotify", this.showNotify, true);
        this.initCache("LiveStatus_Settings_Locale", this.locale, true);
        this.initCache("LiveStatus_SubArray", this.subArray, []);
        this.initCache("LiveStatus_NoticeArray", this.noticeArray, []);
        

        let cachedOverall = this.localStorageService.retrieve("LiveStatus_Overall");
        let cachedCore = this.localStorageService.retrieve("LiveStatus_CoreServices");
        let cachedGames = this.localStorageService.retrieve("LiveStatus_Games");
        let cachedApps = this.localStorageService.retrieve("LiveStatus_Apps");
        if(cachedOverall!=null)
        { 
            this.overall = cachedOverall;
            this.coreServices = cachedCore;
            this.gameServices = cachedGames;
            this.appServices = cachedApps;
            loading.dismiss();
        }
        else
        {
            this.getData().subscribe(data => 
            {
                this.updateStatus(data);
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

        this.getData().subscribe(data => 
        {
            this.updateStatus(data);
            loading.dismiss();
        });
    }

    async silenceRefreshStatus(){
        this.getData().subscribe(data => 
        {
            this.updateStatus(data);
        });
    }

    async subscribe(scenario, incident)
    { 
        let subId = `LiveStatus_${scenario['Id']}_${incident['Id']}`;
      
        this.subArray.push({
            Id:subId, 
            Name: scenario["Name"],
            Time: this.utcToLocal(incident["Begin"]),
            Message: incident["Stage"]["Message"],
            Devices: scenario["Devices"].map(d=>d["Name"]).join(",")
        });

        this.localStorageService.store("LiveStatus_SubArray", this.subArray);
    }

    isSubscribed(scenario, incident)
    { 
        let subId = `LiveStatus_${scenario['Id']}_${incident['Id']}`;
        return this.subArray.map(s=>s.Id).indexOf(subId)>-1;
    }

    checkSubUpdate(data){
        let monitorIdArray = this.subArray.map(s=>s.Id);
        let newIdSet = new Set();
        data["CoreServices"].flatMap(s=>s.Scenarios).forEach((scenario)=>{
            scenario.Incidents.forEach((incident)=>{
                newIdSet.add(`LiveStatus_${scenario['Id']}_${incident['Id']}`)
            })
        });
        
        data["Games"].flatMap(s=>s.Scenarios).forEach((scenario)=>{
            scenario.Incidents.forEach((incident)=>{
                newIdSet.add(`LiveStatus_${scenario['Id']}_${incident['Id']}`)
            })
        });
        data["Apps"].flatMap(s=>s.Scenarios).forEach((scenario)=>{
            scenario.Incidents.forEach((incident)=>{
                newIdSet.add(`LiveStatus_${scenario['Id']}_${incident['Id']}`)
            })
        });
        console.log(newIdSet)

        monitorIdArray.forEach((monitorId)=>{
           if(!newIdSet.has(monitorId)){
              //up and running again, notify
              this.subArray.forEach((sub)=>{
                  if(sub.Id==monitorId)
                  {
                      this.noticeArray.unshift(sub);
                      this.localStorageService.store("LiveStatus_NoticeArray", this.noticeArray);

                      if(this.showNotify){
                          this.notification.schedule({
                            id: sub.Id,
                            title: sub.Name,
                            text: "Up and Running",
                            data: { secret: 'secret' },
                            foreground: true,
                            icon: "/assets/icon/active_icon3.png"
                          });
                      }
                  }
              })
           }
        });
    }

    //this.translate.instant("Confirm.Title")
    async confirmDelete(notice){
        const alert = await this.alertController.create({
            header: "Delete",
            message: notice.Name,
            buttons: [
            {
                text: "Canel",
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {
                  
                }
            }, {
                text: "Yes",
                handler: () => {
                    this.noticeArray.forEach((item, index)=>{
                        if(item.Id==notice.Id)
                            this.noticeArray.splice(index, 1);
                    })
                }
            }]
        });

        await alert.present();
    
    }

    getCurrentLocale(){
        let locale = this.localStorageService.retrieve("LiveStatus_Settings_Locale");
        return locale;
    }

    getData(): Observable<any> {
        const serviceUrl = 'http://notice.xbox.com/ServiceStatusv5/'+this.getCurrentLocale(); 

        return this.http.get<any>(serviceUrl)
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

    private log(message: string) {
        console.log(message);
    }
}
