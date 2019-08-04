import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FestivalsPage } from './festivals.page';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {
    path: '',
    component: FestivalsPage
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
  declarations: [FestivalsPage]
})
export class FestivalsPageModule {}
