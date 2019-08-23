import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PremiumGoldPage } from './premium-gold.page';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {
    path: '',
    component: PremiumGoldPage
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
  declarations: [PremiumGoldPage]
})
export class PremiumGoldPageModule { }
