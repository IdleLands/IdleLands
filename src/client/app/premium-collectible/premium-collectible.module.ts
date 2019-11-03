import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PremiumCollectiblePage } from './premium-collectible.page';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {
    path: '',
    component: PremiumCollectiblePage
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
  declarations: [PremiumCollectiblePage]
})
export class PremiumCollectiblePageModule { }
