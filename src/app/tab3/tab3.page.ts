import { Component } from '@angular/core';
import { Platform } from '@ionic/angular'; 
import { ModalController } from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { DataService } from '../data.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {


  constructor(
    public data: DataService,
    private platform: Platform,
    private localStorageService: LocalStorageService,
    public modalController: ModalController,
    public navController: NavController,
    private router: Router
  ){
  }


}
