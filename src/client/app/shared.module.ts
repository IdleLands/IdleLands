import { NgModule, APP_INITIALIZER } from '@angular/core';
import { IonicStorageModule } from '@ionic/storage';

import { SocketClusterService } from './socket-cluster.service';
import { GameService } from './game.service';
import { LoggedInGuard } from './logged-in.guard';
import { GendervatarComponent } from './gendervatar/gendervatar.component';

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
    LoggedInGuard
  ],
  imports: [IonicStorageModule.forRoot()],
  exports: [GendervatarComponent]
})
export class SharedModule { }
