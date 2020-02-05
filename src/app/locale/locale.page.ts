import { Component, OnInit, Input, NgZone } from '@angular/core';
import {ModalController} from '@ionic/angular';

import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../data.service';

@Component({
    selector: 'app-locale',
    templateUrl: './locale.page.html',
    styleUrls: ['./locale.page.scss'],
})
export class LocalePage implements OnInit {
    @Input() orgLocale: string;

    constructor(
        private modalController: ModalController,
        private translate: TranslateService,
        public data: DataService,
        private zone: NgZone,
        ) {
    }

    ngOnInit() {
    }
    
    async changeLocale(selector: string) {
        this.data.setCurrentLocale(selector)
        this.data.loadTranslate(selector);
        
        //this.translate.use(selector);
        this.data.clearCache();

        await this.modalController.dismiss(selector!==this.orgLocale);
    }

    close(){
        this.modalController.dismiss();
    }
}
