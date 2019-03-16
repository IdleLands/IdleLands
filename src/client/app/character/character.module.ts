import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CountdownTimerModule } from 'ngx-countdown-timer';

import { CharacterPage } from './character.page';
import { SharedModule } from '../shared.module';

const routes: Routes = [
  {
    path: '',
    component: CharacterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CountdownTimerModule,

    SharedModule
  ],
  declarations: [CharacterPage]
})
export class CharacterPageModule {}
