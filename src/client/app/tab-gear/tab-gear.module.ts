import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TabGearPage } from './tab-gear.page';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {
    path: '',
    component: TabGearPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),

    SharedModule
  ],
  declarations: []
})
export class TabGearPageModule {}
