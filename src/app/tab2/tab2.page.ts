import { Component, ViewChild, OnInit, NgZone } from '@angular/core';
import { IonSlides, Platform, ModalController, NavController, AlertController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { LocalePage } from '../locale/locale.page';
import { DataService } from '../data.service';
import { SettingAboutPage } from '../setting-about/setting-about.page';
import { TranslateService } from '@ngx-translate/core';

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
        private zone: NgZone,
        private translate: TranslateService,
    ){
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
            componentProps: { orgLocale: currentLocale }
        });
        
        await changeLocaleModal.present();
        const { data } = await changeLocaleModal.onDidDismiss();
        if(data){
            this.zone.run(()=>{
                let newLocale = this.data.getCurrentLocale();
                this.translate.setDefaultLang(newLocale);
                
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
}
