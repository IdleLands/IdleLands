import { NgModule, APP_INITIALIZER } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';
import { AngularFireModule } from '@angular/fire';

import { SocketClusterService } from './socket-cluster.service';
import { GameService } from './game.service';
import { LoggedInGuard } from './logged-in.guard';
import { GendervatarComponent } from './gendervatar/gendervatar.component';
import { AuthService } from './auth.service';

import { environment } from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  declarations: [
    GendervatarComponent
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
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule
  ],
  exports: [GendervatarComponent]
})
export class SharedModule { }
