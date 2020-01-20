import { Component, ViewChild } from '@angular/core';
import { LoadingController, NavController, IonSlides } from '@ionic/angular';

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
    //autoplay:false,
    parallax: true,
    //pager: true,
  };

  coreStatus: number;
  coreTimestamp: string;

  coreServices1: CoreService[];
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

  @ViewChild('mySlider') slider: IonSlides;
  
  onSlideChanged() {
      this.slider.getActiveIndex().then((index: number) => {
          if(index==4)
          {
            this.slider.slideTo(1, 0);
          }
      });
  }


  async ngOnInit(){
    /*
    const loading = await this.loadingController.create({
      message: 'Please wait...',
      spinner: 'circles',
    });
    await loading.present();*/

    await this.getOverallStatus();

    /*
    this.data.getData(locale)
      .subscribe(data => 
        {
          console.log(data)
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
      );*/
  }

  coreStateId = 0;
  coreState = '';
  coreStateLastUpdated;
  coreServices = [];

  async getOverallStatus(){
    this.data.getOverallData()
    .subscribe(data => 
      {
        console.log(data)
        this.coreState = data["Status"]["Overall"]["State"];
        this.coreStateId = data["Status"]["Overall"]["Id"];
        this.coreStateLastUpdated = data["Status"]["Overall"]["LastUpdated"]
        console.log(this.coreState =='Impacted')
        this.coreServices = data["CoreServices"]




        /*
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
        */
        
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
