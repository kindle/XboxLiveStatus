import { Component, ViewChild, OnInit } from '@angular/core';
import { IonSlides, Platform, ModalController, NavController, AlertController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { LocalePage } from '../locale/locale.page';
import { DataService } from '../data.service';
import { SettingAboutPage } from '../setting-about/setting-about.page';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

    constructor(
        private platform: Platform,
        private localStorageService: LocalStorageService,
        public modalController: ModalController,
        public navController: NavController,
        private router: Router,
        public data: DataService,
        private alertController: AlertController,
    ){
    }

    currentLocaleInfo;
    ngOnInit() {
        const locale = this.data.getCurrentLocale();
        this.data.Locales.forEach((value, index, arr)=>{
            if(locale===value.Name)
                this.currentLocaleInfo = value.Description;
        });
    }

    async changeLocale(){
        let currentLocale = this.data.getCurrentLocale();
        const changeLocaleModal = await this.modalController.create({
            component: LocalePage,
            componentProps: { orgLocale: currentLocale }
        });
        
        await changeLocaleModal.present();
        const { data } = await changeLocaleModal.onDidDismiss();
        if(data){
            console.log(data)
            window.location.reload();
        }
    }


    changeNotify(){
        this.localStorageService.store("LiveStatus_Settings_ShowNotify", this.data.settings.showNotify);
    }

    async changeFontSize(){
        document.documentElement.style.setProperty(`--ion-font-size`, this.data.fontSizeMap.get(this.data.settings.fontSize));
        this.localStorageService.store("LiveStatus_Settings_FontSize", this.data.settings.fontSize);
    }
  
    async clearCache(){
        const alert = await this.alertController.create({
            header: "Clear",
            message: "Clear Cache",
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
                    
                }
            }]
        });

        await alert.present();

        /*
        this.cacheService.clearAll();
        //clear article block _options
        this.localStorageService.store("reddah_articles_"+this.userName, JSON.stringify([]));
        this.localStorageService.store("reddah_article_ids_"+this.userName, JSON.stringify([]));
        this.localStorageService.store("reddah_article_groups_"+this.userName, JSON.stringify([]));
        this.localStorageService.store("reddah_article_usernames_"+this.userName, JSON.stringify([]));
        this.cacheService.clearGroup("HomePage");
        //clear pub history
        this.localStorageService.clear("Reddah_Recent_3_"+this.userName);
        //clear mini history
        this.localStorageService.clear("Reddah_Recent_4_"+this.userName);
        //this.localStorageService.clear(); //this will force logout
        this.data.toast(this.translate.instant("Common.CacheClear"));*/
    }

    async about(){
      const modal = await this.modalController.create({
          component: SettingAboutPage,
          componentProps: {},
          cssClass: "modal-fullscreen",
      });
      
      await modal.present();
    }
}
