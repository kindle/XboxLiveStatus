import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
    //<ion-label>{{ 'Comment.Delete' | translate }}</ion-label>
    template: `
      <div>
          <ion-item button (click)="close(1)">
              <ion-label>Delete</ion-label>
          </ion-item>
      </div>
    `
})
export class NoticePopPage {
    constructor(
        public popoverCtrl: PopoverController
    ) {}

    async close(value){
        this.popoverCtrl.dismiss(value);
    }
}
