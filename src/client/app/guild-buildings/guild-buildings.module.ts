import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GuildBuildingsPage } from './guild-buildings.page';

const routes: Routes = [
  {
    path: '',
    component: GuildBuildingsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GuildBuildingsPage]
})
export class GuildBuildingsPageModule { }
