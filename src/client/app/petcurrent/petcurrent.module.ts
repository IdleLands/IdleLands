import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PetcurrentPage } from './petcurrent.page';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {
    path: '',
    component: PetcurrentPage
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
  declarations: [PetcurrentPage]
})
export class PetcurrentPageModule {}
