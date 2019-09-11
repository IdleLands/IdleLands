import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GuildOverviewPage } from './guild-overview.page';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {
    path: '',
    component: GuildOverviewPage
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
  declarations: [GuildOverviewPage]
})
export class GuildOverviewPageModule { }
