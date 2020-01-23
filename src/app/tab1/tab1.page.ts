import { Component, ViewChild } from '@angular/core';
import { LoadingController, NavController, IonSlides, AlertController } from '@ionic/angular';

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

    @ViewChild('mySlider') slider: IonSlides;
    slideOpts = {
        effect: 'slide',
        loop: false,
        parallax: true,
        scrollbar: true,
    };

    coreStatus: number;
    coreTimestamp: string;

  
  
    constructor(
        public data : DataService,
        public loadingController: LoadingController,
        public navController: NavController,
        public translateService: TranslateService,
        private localStorageService: LocalStorageService,
        private alertController: AlertController,
        private translate: TranslateService,
    ){
        let locale = this.localStorageService.retrieve("LiveStatus_Locale");
    }

  
    

    async ngOnInit(){
        await this.data.getDefaultStatus();
        setInterval(()=>{
            this.data.silenceRefreshStatus()
        }, 1000*60*5)
    }
    
    onSlideChanged() {
        this.slider.getActiveIndex().then((index: number) => {
            if(index==4)
            {
              this.slider.slideTo(1, 0);
            }
        });
    }


  

  async subscribe(scenarioId, incidentId)
  { 
      this.localStorageService.store("LiveStatus_"+scenarioId+"_"+incidentId, true);
  }

  check(scenarioId, incidentId)
  { 
      return this.localStorageService.retrieve("LiveStatus_"+scenarioId+"_"+incidentId)===true;
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
