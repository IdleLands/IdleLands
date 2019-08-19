import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { QuestsGlobalPage } from './quests-global.page';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {
    path: '',
    component: QuestsGlobalPage
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
  declarations: [QuestsGlobalPage]
})
export class QuestsGlobalPageModule {}
