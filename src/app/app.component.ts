import { Component, NgZone } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { TranslateService } from '@ngx-translate/core';
import { DataService } from './data.service';

import { Globalization } from '@ionic-native/globalization';
import { Network } from '@ionic-native/network/ngx';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private translate: TranslateService,
        private data: DataService,
        private network: Network,
        private zone: NgZone,
    ) {
        this.initializeApp();
    }

    initLocale(){
        let currentLocale = this.data.getCurrentLocale();
        let defaultLocale ="en-US"
        
        if(currentLocale==null){
            if(this.platform.is('ios')||this.platform.is('android'))
            { 
                Globalization.getPreferredLanguage()
                .then(res => {
                    this.data.setCurrentLocale(res.value);
                    //this.translate.setDefaultLang(res.value);
                    this.data.loadTranslate(res.value);
                })
                .catch(e => {
                    this.data.setCurrentLocale(defaultLocale);
                    //this.translate.setDefaultLang(defaultLocale);
                    this.data.loadTranslate(defaultLocale);
                });
            }
            else{    
                //this.zone.run(()=>{
                    //this.translate.setDefaultLang(currentLocale);
                    //this.translate.use(currentLocale);
                  //  this.data.loadTranslate(defaultLocale);
                //});        
                this.data.loadTranslate(defaultLocale);
                this.data.setCurrentLocale(defaultLocale);
                //this.translate.setDefaultLang(defaultLocale);
                //this.translate.use(defaultLocale);
            }
        }
        else{
            //this.zone.run(()=>{
            //    this.translate.setDefaultLang(currentLocale);
            //    this.translate.use(currentLocale);
            //});
            //this.translate.setDefaultLang(currentLocale);
            //this.translate.use(currentLocale);

            this.data.loadTranslate(currentLocale);
            this.data.setCurrentLocale(currentLocale);
        }
        
    }

    initializeApp() {
        this.data.plm = 'init app';
        this.platform.ready().then(() => {
            this.data.plm += 'plat form ready';
            this.statusBar.overlaysWebView(false);
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
        
        this.initLocale();
        this.network.onDisconnect().subscribe(() => {
            this.data.settings.networkConnected = false;
        });
        
        this.network.onConnect().subscribe(() => {
            this.data.settings.networkConnected = true;
        });

        let currentFontSize = this.data.getCurrentFontSize();
        if(!currentFontSize)
            currentFontSize = 4;
        this.data.updateUIFontSize(currentFontSize);
        this.data.settings.fontSize = currentFontSize;
        this.data.settings.showNotify = this.data.getCurrentShowNotify();
    }
}
