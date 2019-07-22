import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdventuresPage } from './adventures.page';
import { SharedModule } from '../shared.module';
import { ChoosePetsModal } from './choosepets.modal';

const routes: Routes = [
  {
    path: '',
    component: AdventuresPage
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
  declarations: [AdventuresPage, ChoosePetsModal],
  entryComponents: [ChoosePetsModal]
})
export class AdventuresPageModule {}
