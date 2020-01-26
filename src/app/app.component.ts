import { Component, NgZone } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import {TranslateService} from '@ngx-translate/core';

import { LocalStorageService } from 'ngx-webstorage';
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
        private localStorageService: LocalStorageService,
        private data: DataService,
        private network: Network,
        private zone: NgZone,
    ) {
        this.initializeApp();
        this.initLocale();

        this.network.onDisconnect().subscribe(() => {
            this.data.settings.networkConnected = false;
        });
        
        this.network.onConnect().subscribe(() => {
            this.data.settings.networkConnected = false;
        });

        let currentFontSize = this.data.getCurrentFontSize();
        if(!currentFontSize)
            currentFontSize = 4;
        document.documentElement.style.setProperty(`--ion-font-size`, this.data.fontSizeMap.get(currentFontSize));
        this.data.settings.fontSize = currentFontSize;
        this.data.settings.showNotify = this.data.getCurrentShowNotify();
        

    }

    initLocale(){
        let currentLocale = this.data.getCurrentLocale();
        let defaultLocale ="en-US"
        if(currentLocale==null){
            if(this.platform.is('cordova'))
            { 
                Globalization.getPreferredLanguage()
                .then(res => {
                    this.data.setCurrentLocale(res.value);
                    this.translate.setDefaultLang(res.value);
                })
                .catch(e => {
                    this.data.setCurrentLocale(defaultLocale);
                    this.translate.setDefaultLang(defaultLocale);
                });
            }
            else{
                this.data.setCurrentLocale(defaultLocale);
                this.translate.setDefaultLang(defaultLocale);
                this.translate.use(defaultLocale);
            }
            this.data.settings.locale = this.data.getCurrentLocale();

        }
        else{
            this.zone.run(()=>{
                this.translate.setDefaultLang(currentLocale);
                this.translate.use(currentLocale);
            })
        }
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
}
