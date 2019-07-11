import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

import { IonicStorageModule } from '@ionic/storage';
import { IonicModule } from '@ionic/angular';

import { FilterPipeModule } from 'ngx-filter-pipe';

import { SocketClusterService } from './socket-cluster.service';
import { GameService } from './game.service';
import { LoggedInGuard } from './logged-in.guard';
import { GendervatarComponent } from './_shared/gendervatar/gendervatar.component';
import { AuthService } from './auth.service';

import { environment } from '../environments/environment';
import { ItemComponent } from './_shared/item/item.component';
import { EquipSomethingElseModal } from './_shared/equipment/equipsomethingelse.modal';
import { EquipmentItemPopover } from './_shared/equipment/equipmentitem.popover';

@NgModule({
  declarations: [
    GendervatarComponent,
    ItemComponent,
    EquipSomethingElseModal,
    EquipmentItemPopover
  ],
  entryComponents: [
    EquipSomethingElseModal,
    EquipmentItemPopover
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: (sc: SocketClusterService) => () => {
        sc.init();
        return sc;
      },
      deps: [SocketClusterService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (gs: GameService) => async () => {
        await gs.init();
        return gs;
      },
      deps: [GameService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (as: AuthService) => async () => {
        return as;
      },
      deps: [AuthService],
      multi: true
    },
    LoggedInGuard
  ],
  imports: [
    CommonModule,
    FilterPipeModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule
  ],
  exports: [
    GendervatarComponent,
    ItemComponent,
    EquipSomethingElseModal,
    EquipmentItemPopover
  ]
})
export class SharedModule { }
