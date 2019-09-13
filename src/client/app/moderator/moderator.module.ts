import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ModeratorPage } from './moderator.page';
import { SharedModule } from '../shared.module';
import { ToggleMuteModal } from './togglemute.modal';
import { ModTierModal } from './modtier.modal';
import { ModFestivalModal } from './modfestival.modal';
import { ModItemModal } from './moditem.modal';
import { ModGuildResourcesModal } from './modguildresources.modal';

const routes: Routes = [
  {
    path: '',
    component: ModeratorPage
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
  declarations: [ModeratorPage, ToggleMuteModal, ModTierModal, ModFestivalModal, ModItemModal, ModGuildResourcesModal],
  entryComponents: [ToggleMuteModal, ModTierModal, ModFestivalModal, ModItemModal, ModGuildResourcesModal]
})
export class ModeratorPageModule { }
