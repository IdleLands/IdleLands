import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EnhancementMaterialsPage } from './enhancement-materials.page';

const routes: Routes = [
  {
    path: '',
    component: EnhancementMaterialsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EnhancementMaterialsPage]
})
export class EnhancementMaterialsPageModule { }
