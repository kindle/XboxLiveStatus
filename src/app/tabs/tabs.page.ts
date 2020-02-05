import { Component, NgZone } from '@angular/core';
import { Platform, ModalController, ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../data.service';
import { SettingsPage } from '../settings/settings.page';

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
        private modalController: ModalController,
        private zone: NgZone,
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

    async goSettings(){
        this.data.reloadLocaleSettings()
        const modal = await this.modalController.create({
            component: SettingsPage,
            componentProps: {},
            cssClass: 'modal-fullscreen'
        });
        
        await modal.present();
        const { data } = await modal.onDidDismiss();
        if(data||!data){
            this.data.forceRefreshStatus();
        }
    }


    async toggleText(){
        this.data.showTabText = !this.data.showTabText;
    }
}
