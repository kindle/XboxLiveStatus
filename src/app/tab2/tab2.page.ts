import { Component, ViewChild } from '@angular/core';
import { IonSlides, Platform, ModalController, NavController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { LocalePage } from '../locale/locale.page';
import { DataService } from '../data.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

    constructor(
        private platform: Platform,
        private localStorageService: LocalStorageService,
        public modalController: ModalController,
        public navController: NavController,
        private router: Router,
        public data: DataService,
    ){
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
