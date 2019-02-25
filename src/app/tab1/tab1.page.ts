import { Component } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';

import { DataService } from '../data.service';
import { CoreService, XboxService } from '../service';
import { TranslateService } from '@ngx-translate/core';

import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  slideOpts = {
    effect: 'slide',
    loop: true,
    parallax: true,
  };

  coreStatus: number;
  coreTimestamp: string;

  coreServices: CoreService[];
  xboxOneServices: XboxService[];
  xbox360Services: XboxService[];
  
  constructor(
    private data : DataService,
    public loadingController: LoadingController,
    public navController: NavController,
    public translateService: TranslateService,
    private localStorageService: LocalStorageService
    ){
      let locale = this.localStorageService.retrieve("LiveStatus_Locale");
  }


  async ngOnInit(){
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'circles',
    });
    await loading.present();
    let locale = this.localStorageService.retrieve("LiveStatus_Locale");
    this.data.getData(locale)
      .subscribe(data => 
        {
          //1.overall json->class
          this.coreStatus = data["LiveStatus"]["Status"];
          this.coreTimestamp = data["LiveStatus"]["TimeStamp"]["TimeStamp"];

          //2.core services
          this.coreServices = data["CoreServices"];

          //partner services
          for(let subCategory of data["PartnerServices"]){
              //alert(JSON.stringify(subCategory))
              //3.subcategory xbox one
              if(subCategory["Name"]=="Xbox One"){
                //this.xboxOneServices = subCategory["ServiceStatus"];
              }
              //4.subcategory xbox 360
              if(subCategory["Name"]=="Xbox 360"){
                //this.xbox360Services = subCategory["ServiceStatus"];
              }
          }
          
          loading.dismiss();
        }
      );
  }

  subText(str: string, n: number) {
    var r = /[^\u4e00-\u9fa5]/g;
    if (str.replace(r, "mm").length <= n) { return str; }
    var m = Math.floor(n/2);
    for (var i = m; i < str.length; i++) {
        if (str.substr(0, i).replace(r, "mm").length >= n) {
            return str.substr(0, i) + "...";
        }
    }
    return str;
  }

}
