import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import {TranslateService} from '@ngx-translate/core';

import { LocalStorageService } from 'ngx-webstorage';
import { DataService } from './data.service';

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
        private network: Network
    ) {
        this.initializeApp();
        let locale = this.data.getCurrentLocale();
        this.translate.setDefaultLang(locale);
        this.data.settings.locale = locale;

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

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }
}
