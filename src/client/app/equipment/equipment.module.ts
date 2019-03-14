import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { FilterPipeModule } from 'ngx-filter-pipe';

import { IonicModule } from '@ionic/angular';

import { EquipmentPage } from './equipment.page';
import { SharedModule } from '../shared.module';
import { EquipmentItemPopover } from './item.popover';
import { EquipSomethingElseModal } from './equipsomethingelse.modal';

const routes: Routes = [
  {
    path: '',
    component: EquipmentPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FilterPipeModule,
    IonicModule,
    RouterModule.forChild(routes),

    SharedModule
  ],
  entryComponents: [EquipmentItemPopover, EquipSomethingElseModal],
  declarations: [EquipmentItemPopover, EquipSomethingElseModal, EquipmentPage]
})
export class EquipmentPageModule {}
