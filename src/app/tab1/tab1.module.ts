import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { TranslateModule } from '@ngx-translate/core';

import { ServiceBoxComponent } from '../service-box/service-box.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }]),
    TranslateModule.forChild()
  ],
  declarations: [
    Tab1Page,
    ServiceBoxComponent
  ]
})
export class Tab1PageModule {}
