import { Component } from '@angular/core';
import { Platform } from '@ionic/angular'; 
import { AppVersion } from '@ionic-native/app-version/ngx';
import { AppUpdate } from '@ionic-native/app-update/ngx';
import { ModalController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { LocalePage } from '../locale/locale.page';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  version: String;

  constructor(
    private appVersion: AppVersion,
    private appUpdate: AppUpdate,
    private platform: Platform,
    private localStorageService: LocalStorageService,
    public modalController: ModalController,
    public navController: NavController,
    private router: Router
  ){
    this.getVersionNumber().then(version => {
      this.version = version;
    });
  }

  getVersionNumber(): Promise<string> {
      return new Promise((resolve) => {
          this.appVersion.getVersionNumber().then((value: string) => {
              resolve(value);
          }).catch(err => {
              console.log('getVersionNumber:' + err);
          });
      });
  }

  checkUpdate() {
    const updateUrl = 'https://reddah.com/apk/livestatus/update.xml';
    
    if (this.isMobile()) {
        this.getVersionNumber().then(version => {
            if (this.isAndroid()) {
                this.appUpdate.checkAppUpdate(updateUrl).then(data => {});
            } else {
                alert('ios update');
            } 
        });
    }
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


  async changeLocale(){
    let currentLocale = this.localStorageService.retrieve("LiveStatus_Locale");
    const changeLocaleModal = await this.modalController.create({
    component: LocalePage,
    componentProps: { orgLocale: currentLocale }
    });
    
    await changeLocaleModal.present();
    const { data } = await changeLocaleModal.onDidDismiss();
    if(data){
        console.log(data)
        //this.router.navigateByUrl('/tabs/(home:home)');
        window.location.reload();
    }

  }

}
