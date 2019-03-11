import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StatisticsPage } from './statistics.page';
import { SharedModule } from '../shared.module';
import { StatisticsTreeComponent } from './statistics-tree.component';

const routes: Routes = [
  {
    path: '',
    component: StatisticsPage
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
  entryComponents: [StatisticsTreeComponent],
  declarations: [StatisticsPage, StatisticsTreeComponent]
})
export class StatisticsPageModule {}
