import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {ModalController, Platform, NavController, IonSlides} from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';

import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LocalePage } from '../locale/locale.page';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
 

    constructor(
        private platform: Platform,
        private localStorageService: LocalStorageService,
        public modalController: ModalController,
        public navController: NavController,
        private router: Router
    ){
    }

    async ngOnInit(){
        
    }

    async close(){
      this.modalController.dismiss();
    }
    
    showNotify = false;
    changeShowNotify(){
        this.showNotify = !this.showNotify;
    }

    @ViewChild('mySlider2') slider: IonSlides;

    slideOpts = {
      effect: 'slide',
      loop: true,
      parallax: true,
    };

    onSlideChanged() {
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
