import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';
import { LoadingController, PopoverController, AlertController, Platform } from '@ionic/angular';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
import * as moment from 'moment';
import { Locale } from './models/locale';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    settings = {
        networkConnected: true,
        showNotify: true,
        locale: 'en-US',
        fontSize: 4,
    }

    private initCache(key, ref, value){
        let cachedItem = this.localStorageService.retrieve(key);
        if(cachedItem!=null){
            if(key=="LiveStatus_Settings_ShowNotify")
                this.settings.showNotify = cachedItem;
            if(key=="LiveStatus_Settings_Locale")
                this.settings.locale = cachedItem;
            if(key=="LiveStatus_SubArray")
                this.subArray = cachedItem;
            if(key=="LiveStatus_NoticeArray")
                this.noticeArray = cachedItem;
        }
        else{
            if(key=="LiveStatus_Settings_ShowNotify")
                this.settings.showNotify = value;
            if(key=="LiveStatus_Settings_Locale")
                this.settings.locale = value;
            if(key=="LiveStatus_SubArray")
                this.subArray = value;
            if(key=="LiveStatus_NoticeArray")
                this.noticeArray = value;
        }
    }

    subArray;
    noticeArray;
    /*
    noticeArray = [{
        Id:1, 
        Name: 'Destiny 2',
        Time: this.utcToLocal('2020-01-28 17:00:24'),
        Message: 'test',
        Devices: 'test'
    },
    {
        Id:2, 
        Name: `Tom Clancy's Ghost Recon@Breadpoint`,
        Time: this.utcToLocal('2020-01-28 17:00:24'),
        Message: 'test',
        Devices: 'test'
    },
    {
        Id:3, 
        Name: 'World of Tanks: Mercenaries',
        Time: this.utcToLocal('2020-01-28 17:00:24'),
        Message: 'test',
        Devices: 'test'
    }];
    */

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
        private appVersion: AppVersion,
        private appRate: AppRate,
        private platform: Platform,
        private translate: TranslateService,
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
        if(this.settings.networkConnected)
        {
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
    }
    
    async getDefaultStatus(){
        const loading = await this.loadingController.create({
            cssClass: 'custom-loading',
            spinner:'dots',
            duration: 2000,
        });
        await loading.present();

        this.initCache("LiveStatus_Settings_ShowNotify", this.settings.showNotify, true);
        this.initCache("LiveStatus_Settings_Locale", this.settings.locale, 'en-US');
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
        this.subArray = this.subArray.filter(s=>s.Notified!=true);
        let newIdSet = new Set();
        /* flatMap not supported in IE
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
        });*/
        data["CoreServices"].reduce((acc, val) => acc.concat(val.Scenarios), []).forEach((scenario)=>{
            scenario.Incidents.forEach((incident)=>{
                newIdSet.add(`LiveStatus_${scenario['Id']}_${incident['Id']}`)
            })
        });
        
        data["Games"].reduce((acc, val) => acc.concat(val.Scenarios), []).forEach((scenario)=>{
            scenario.Incidents.forEach((incident)=>{
                newIdSet.add(`LiveStatus_${scenario['Id']}_${incident['Id']}`)
            })
        });
        data["Apps"].reduce((acc, val) => acc.concat(val.Scenarios), []).forEach((scenario)=>{
            scenario.Incidents.forEach((incident)=>{
                newIdSet.add(`LiveStatus_${scenario['Id']}_${incident['Id']}`)
            })
        });
       

        this.subArray.forEach((subArrayItem)=>{
            if(!newIdSet.has(subArrayItem.Id)){
                //up and running again, notify
                this.noticeArray.unshift(subArrayItem);
                this.localStorageService.store("LiveStatus_NoticeArray", this.noticeArray);

                if(this.settings.showNotify){
                    this.notification.schedule({
                        id: subArrayItem.Id,
                        title: subArrayItem.Name,
                        text: "Up and Running",
                        data: { secret: 'secret' },
                        foreground: true,
                        icon: "assets/icon/active_icon3.png"
                    });
                }

                subArrayItem.Notified = true;
                this.localStorageService.store("LiveStatus_SubArray", this.subArray);
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
                    this.localStorageService.store("LiveStatus_NoticeArray", this.noticeArray);
                }
            }]
        });

        await alert.present();
    
    }

    getCurrentLocale(){
        return this.localStorageService.retrieve("LiveStatus_Settings_Locale");
    }
    
    setCurrentLocale(locale){
        this.settings.locale = locale;
        this.localStorageService.store("LiveStatus_Settings_Locale", locale);
    }

    getCurrentShowNotify(){
        return this.localStorageService.retrieve("LiveStatus_Settings_ShowNotify");
    }

    getCurrentFontSize(){
        return this.localStorageService.retrieve("LiveStatus_Settings_FontSize");
    }

    updateUIFontSize(fontSize){
        document.documentElement.style.setProperty(`--ion-font-size`, this.fontSizeMap.get(fontSize)+"px");
        document.documentElement.style.setProperty(`--ion-font-size-h1`, this.fontSizeMap.get(fontSize)+10+"px");
        document.documentElement.style.setProperty(`--ion-font-size-h4`, this.fontSizeMap.get(fontSize)+4+"px");
        document.documentElement.style.setProperty(`--ion-font-size-h5`, this.fontSizeMap.get(fontSize)+2+"px");
    }

    getData(): Observable<any> {
        const serviceUrl = 'http://notice.xbox.com/ServiceStatusv5/'+this.getCurrentLocale(); 
        
        return this.http.get<any>(serviceUrl)
        .pipe(
            tap(data => this.log('fetched overall status xml')),
            catchError(this.handleError('getLiveStatusData', []))
        );

    }

    getVersionNumber(): Promise<string> {
        return new Promise((resolve) => {
            this.appVersion.getVersionNumber().then((value: string) => {
                resolve(value);
            }).catch(err => {
                alert(err);
            });
        });
    }

    public Locales = [
        new Locale("en-US", "English (en-US)"),
        new Locale("de-DE", "Deutsch (de-DE)"),
        new Locale("fr-FR", "Français (fr-FR)"),
        new Locale("ar-AE", " عربي ، (ar-AE)"),
        new Locale("el-GR", "Ελληνικά (el-GR)"),
        new Locale("es-ES", "Español (es-ES)"),
        new Locale("it-IT", "Italiano (it-IT)"),
        new Locale("ja-JP", "日本語 (ja-JP)"),
        new Locale("ko-KR", "한국어 (ko-KR)"),
        new Locale("nl-NL", "Nederlands (nl-NL)"),
        new Locale("pt-PT", "Português (pt-PT)"),
        new Locale("ru-RU", "Pусский язык (ru-RU)"),
        new Locale("th-TH", "ภาษาไทย (th-TH)"),
        new Locale("zh-CN", "简体中文 (zh-CN)"),
        new Locale("zh-TW", "繁體中文 (zh-TW)"),
    ];

    fontSizeMap = new Map()
    .set(1,12)
    .set(2,13)
    .set(3,14)
    .set(4,15)
    .set(5,16)
    .set(6,17)
    .set(7,18)
    .set(8,19)
    .set(9,20)
    .set(10,21);
    
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

    clearCache(){
        this.localStorageService.clear("LiveStatus_Overall");
        this.localStorageService.clear("LiveStatus_CoreServices");
        this.localStorageService.clear("LiveStatus_Games");
        this.localStorageService.clear("LiveStatus_Apps");
        this.coreServices = [];
        this.gameServices = [];
        this.appServices = [];

        this.localStorageService.clear("LiveStatus_SubArray");
        this.localStorageService.clear("LiveStatus_NoticeArray");
        this.subArray = [];
        this.noticeArray = [];
    }

    reloadLocaleSettings(){
        let currentLocale = this.getCurrentLocale();
        this.translate.setDefaultLang(currentLocale);
        this.translate.use(currentLocale);
    }


    like(){
        this.platform.ready().then(() => {
            
            this.appRate.preferences = {
                useLanguage : 'en',
                displayAppName: 'Live Status',
                usesUntilPrompt: 2,
                promptAgainForEachNewVersion: false,
                storeAppURL: {
                    ios: '1481532281',
                    android: 'market://details?id=com.reddah.app',
                    windows: 'ms-windows-store://pdp/?ProductId=9nblggh0b2b9',
                    windows8: 'ms-windows-store:Review?name=9nblggh0b2b9'
                },
                customLocale: {
                    title: 'Do you enjoy %@?',
                    message: 'If you enjoy using %@, would you mind taking a moment to rate it? Thanks so much!',
                    cancelButtonLabel: 'No, Thanks',
                    //laterButtonLabel: 'Remind Me Later',
                    rateButtonLabel: 'Rate It Now'
                },
                callbacks: {
                onRateDialogShow: function(callback){
                    console.log('rate dialog shown!');
                    alert(1)
                },
                onButtonClicked: function(buttonIndex){
                    console.log('Selected index: -> ' + buttonIndex);
                    alert(2)
                }
                }
            };

            // Opens the rating immediately no matter what preferences you set
            this.appRate.promptForRating(true);
        });
    }
}
