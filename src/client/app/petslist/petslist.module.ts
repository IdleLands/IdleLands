import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PetslistPage } from './petslist.page';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {
    path: '',
    component: PetslistPage
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
  declarations: [PetslistPage]
})
export class PetslistPageModule {}
