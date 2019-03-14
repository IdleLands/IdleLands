import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EquipmentPage } from './equipment.page';
import { SharedModule } from '../shared.module';
import { EquipmentItemPopover } from './item.popover';

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
    IonicModule,
    RouterModule.forChild(routes),

    SharedModule
  ],
  entryComponents: [EquipmentItemPopover],
  declarations: [EquipmentItemPopover, EquipmentPage]
})
export class EquipmentPageModule {}
