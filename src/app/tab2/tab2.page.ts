import { Component, ViewChild } from '@angular/core';
import { IonSlides, Platform, ModalController, NavController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { LocalePage } from '../locale/locale.page';

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
        private router: Router
    ){
    }
    
}
