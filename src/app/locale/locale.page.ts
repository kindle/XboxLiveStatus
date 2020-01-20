import { Component, OnInit, Input } from '@angular/core';
import {ModalController} from '@ionic/angular';
import { LocalStorageService } from 'ngx-webstorage';
import { Locale } from '../locale';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-locale',
  templateUrl: './locale.page.html',
  styleUrls: ['./locale.page.scss'],
})
export class LocalePage implements OnInit {
  @Input() orgLocale: string;
  locales: Locale[];

  constructor(
      private localStorageService: LocalStorageService,
      private modalController: ModalController,
      private translate: TranslateService) {
  }

  ngOnInit() {
      this.locales = [
          new Locale("zh-CN", "中华人民共和国 (China)"),
          new Locale("fr-FR", "France"),
          new Locale("ja-JP", "日本 (Japan)"),
          new Locale("ko-KR", "대한민국 (Korea)"),
          new Locale("en-US", "United States"),
      ];
  }
  
  async changeLocale(selector: string) {
      this.localStorageService.store("LiveStatus_Locale", selector);
      this.translate.use(selector);
      console.log(selector);
      await this.modalController.dismiss(selector!==this.orgLocale);
  }

}