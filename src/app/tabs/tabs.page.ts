import { Component } from '@angular/core';
import { Platform, ModalController, ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../data.service';

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    constructor(
        public data : DataService,
        private translate: TranslateService,
        public loadingController: LoadingController,
    ) {
        let locale = this.data.getCurrentLocale();
        this.translate.setDefaultLang(locale);
        this.translate.use(locale);

        setInterval(()=>{
            this.data.silenceRefreshStatus()
        }, 1000*60*5)
    }

    refresh(){
        this.data.reloadLocaleSettings();
        this.data.forceRefreshStatus();
    }


    async toggleText(){
        this.data.showTabText = !this.data.showTabText;
    }
}
