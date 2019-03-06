import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PlayPage } from './play.page';
import { SharedModule } from '../shared.module';
import { LoggedInGuard } from '../logged-in.guard';

const routes: Routes = [
  {
    path: '',
    component: PlayPage,
    canActivate: [LoggedInGuard]
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
  declarations: [PlayPage]
})
export class PlayPageModule {}
