import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, Platform, AlertController } from '@ionic/angular';
import { DataService } from '../data.service';
import { LocalStorageService } from 'ngx-webstorage';
//import { AngularFireDatabase } from '@angular/fire/database';

@Component({
    selector: 'app-service-box',
    templateUrl: './service-box.component.html',
    styleUrls: ['./service-box.component.scss']
})
export class ServiceBoxComponent implements OnInit {

    @Input() title;
    @Input() services:[];
    
    @Output() reloadComments = new EventEmitter();
    @Output() localComments = new EventEmitter<any>();


    constructor(
        public data: DataService,
        private localStorageService: LocalStorageService,
        private alertController: AlertController,
    ) { 
        
    }

    async ngOnInit() {
    }

    async message(scenario, incident){
        let message = "ID: "+scenario["Id"]+" "+ incident["Id"] + "<br><br>";
        if(incident["Stage"]["Message"]!==""){ 
            message += incident["Stage"]["Message"] + "<br><br>";
        }
        message += scenario["Devices"].map(d=>d["Name"]).join(",") + "<br><br>";
        message += this.data.utcToLocal(incident["Begin"], 'YYYY-MM-DD HH:mm:ss')

        const alert = await this.alertController.create({
            //header: this.translate.instant("Menu.PressPay"),
            header: scenario["Name"],
            message: message,
        });

        await alert.present();
    }
}
