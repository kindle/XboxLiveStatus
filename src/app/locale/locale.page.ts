import { Component, OnInit, Input } from '@angular/core';
import {ModalController} from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { Locale } from '../locale';

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
        private localStorageService: LocalStorageService,
        private modalController: ModalController,
        private translate: TranslateService,
        public data: DataService,
        ) {
    }

    ngOnInit() {
    }
    
    async changeLocale(selector: string) {
        this.localStorageService.store("LiveStatus_Settings_Locale", selector);
        this.translate.use(selector);
        await this.modalController.dismiss(selector!==this.orgLocale);
    }

    close(){
        this.modalController.dismiss();
    }
}
