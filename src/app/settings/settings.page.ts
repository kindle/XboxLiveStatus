import { Component, OnInit, Input, NgZone } from '@angular/core';
import {ModalController, Platform, NavController, AlertController} from '@ionic/angular';

import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { LocalePage } from '../locale/locale.page';
import { DataService } from '../data.service';
import { SettingAboutPage } from '../setting-about/setting-about.page';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.page.html',
    styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
    @Input() orgLocale: string;

    constructor(
        private platform: Platform,
        private localStorageService: LocalStorageService,
        public modalController: ModalController,
        public navController: NavController,
        private router: Router,
        public data: DataService,
        private alertController: AlertController,
        private zone: NgZone,
        private translate: TranslateService,
        ) {
            this.zone.run(()=>{
                let newLocale = this.data.getCurrentLocale();
                this.translate.use(newLocale);
            });
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
            componentProps: { orgLocale: currentLocale },
            cssClass: 'modal-fullscreen'
        });
        
        await changeLocaleModal.present();
        const { data } = await changeLocaleModal.onDidDismiss();
        if(data){
            this.zone.run(()=>{
                let newLocale = this.data.getCurrentLocale();
                //this.translate.setDefaultLang(newLocale);
                
                this.data.loadTranslate(newLocale);
                
                this.data.Locales.forEach((value, index, arr)=>{
                    if(newLocale===value.Name)
                        this.currentLocaleInfo = value.Description;
                });
            })
        }
    }


    changeNotify(){
        this.localStorageService.store("LiveStatus_Settings_ShowNotify", this.data.settings.showNotify);
    }

    async changeFontSize(){
        this.data.updateUIFontSize(this.data.settings.fontSize);
        this.localStorageService.store("LiveStatus_Settings_FontSize", this.data.settings.fontSize);
    }
  
    async clearCache(){
        const alert = await this.alertController.create({
            header: this.translate.instant("Common.ConfirmClear"),
            message: this.translate.instant("Common.ConfirmClearMessage"),
            buttons: [
            {
                text: this.translate.instant("Common.Cancel"),
                role: 'cancel',
                cssClass: 'secondary',
                handler: (blah) => {
                  
                }
            }, {
                text: this.translate.instant("Common.Yes"),
                handler: () => {
                    this.data.clearCache();
                }
            }]
        });

        await alert.present();
    }

    async about(){
        const modal = await this.modalController.create({
            component: SettingAboutPage,
            componentProps: {},
            cssClass: "modal-fullscreen",
        });
        
        await modal.present();
    }

    async close(){
        this.modalController.dismiss();
    }
}
