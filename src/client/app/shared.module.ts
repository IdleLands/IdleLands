import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { CommonModule } from '@angular/common';

import { IonicStorageModule } from '@ionic/storage';
import { IonicModule } from '@ionic/angular';

import { SocketClusterService } from './socket-cluster.service';
import { GameService } from './game.service';
import { LoggedInGuard } from './logged-in.guard';
import { GendervatarComponent } from './_shared/gendervatar/gendervatar.component';
import { AuthService } from './auth.service';

import { environment } from '../environments/environment';
import { ItemComponent } from './_shared/item/item.component';

@NgModule({
  declarations: [
    GendervatarComponent,
    ItemComponent
  ],
  entryComponents: [
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
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule
  ],
  exports: [
    GendervatarComponent,
    ItemComponent
  ]
})
export class SharedModule { }
