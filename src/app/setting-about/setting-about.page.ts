import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { Platform } from '@ionic/angular'; 
import { AlertController, ActionSheetController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../data.service';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
    selector: 'app-setting-about',
    templateUrl: './setting-about.page.html',
    styleUrls: ['./setting-about.page.scss'],
})
export class SettingAboutPage implements OnInit {

    userName;
    locale;
    version;

    constructor(
        public data: DataService,
        private platform: Platform,
        private modalController: ModalController,
        private localStorageService: LocalStorageService,
        private actionSheetController: ActionSheetController,
        private translate: TranslateService,
        private alertController: AlertController,
        private iab: InAppBrowser,
    ) { 
    }

    ngOnInit() {
        if(this.platform.is('cordova')){
            this.data.getVersionNumber().then(version => {
                this.version = version;
            });
        }

        //upgrade auto when come in
        //this.upgrade();
    }


    isMobile(): boolean {
        return this.platform.is('mobile');
    }

    isAndroid(): boolean {
        return this.isMobile() && this.platform.is('android');
    }

    isIos(): boolean {
        return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
    }
    
    async close() {
        await this.modalController.dismiss();
    }


    async buymebeer(){
        if(this.platform.is('android'))
        {

        }
        if(this.platform.is('ios')){

        }

        const actionSheet = await this.actionSheetController.create({
            //header: this.data.instant("Common.BuyBeer"),
            buttons: [
            /*{
              text: 'Alipay',
              role: 'destructive',
              cssClass: 'pay-alipay',
              handler: () => {
                this.alipayQrCode();
              }
            }, {
              text: 'Wechat',
              cssClass: 'pay-wechatpay',
              handler: () => {
                this.wechatpayQrCode();
              }
            }, */
            {
              text: 'Paypal',
              cssClass: 'pay-paypal',
              handler: () => {
                this.iab.create("https://paypal.me/reddah", '_system');
              }
            }
        ]
        });
        await actionSheet.present();
    }

    async alipayQrCode() {
        const alert = await this.alertController.create({
            header: this.data.instant("Menu.PressPay"),
            cssClass: 'pay-code',
            message: "<img src='assets/icon/AlipayCode.jpeg'>",
        });
    
        await alert.present();
    }

    async wechatpayQrCode() {
        const alert = await this.alertController.create({
            header: this.data.instant("Menu.PressPay"),
            cssClass: 'pay-code',
            message: "<img src='assets/icon/WechatZan.jpeg'>",
        });
    
        await alert.present();
    }

    test(){
        /*
        let testJson = [{"Id":"LiveStatus_491582364_1590","Name":"Need for Speed™ Heat","Time":"2020-02-06 05:41:13","Message":"Hello Xbox members, we are currently experiencing an issue. We apologize for the inconvenience. Please check back for updates.","Devices":"Xbox One"},{"Id":"LiveStatus_12206284_1613","Name":"eFootball PES 2020","Time":"2020-02-14 15:41:00","Message":"Hello Xbox members, we are currently experiencing an issue. We apologize for the inconvenience. Please check back for updates.","Devices":"Xbox One"}]
        this.data.subArray = testJson;
        */
    }

}
