import { Component } from '@angular/core';
import { Platform, ModalController, ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../data.service';
import { SettingsPage } from '../settings/settings.page';
import { SearchPage } from '../search/search.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

    constructor(
        public data : DataService,
        private platform: Platform,
        private modalController: ModalController,
        private localStorageService: LocalStorageService,
        private actionSheetController: ActionSheetController,
        private translate: TranslateService,
        private alertController: AlertController,
        public loadingController: LoadingController,
    ) 
    {}

    async refresh(){
        await this.data.forceRefreshStatus();
    }

    async settings(){
        const modal = await this.modalController.create({
            component: SettingsPage,
            componentProps: {},
            cssClass: "modal-fullscreen",
        });
          
        await modal.present();
    }

    async search(){
        const modal = await this.modalController.create({
            component: SearchPage,
            componentProps: {},
            cssClass: "modal-fullscreen",
        });
          
        await modal.present();
    }

    async like(){
      
    }

    showText = false;
    async toggleText(){
        this.showText = !this.showText;
    }
}
