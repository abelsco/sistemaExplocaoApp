import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SchedulePage } from './schedule';
import { SchedulePageRoutingModule } from './schedule-routing.module';
import { GaugeModule } from "angular-gauge";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SchedulePageRoutingModule,
    GaugeModule.forRoot()
  ],
  declarations: [
    SchedulePage,
  ],
  entryComponents: [
  ]
})
export class ScheduleModule { }
