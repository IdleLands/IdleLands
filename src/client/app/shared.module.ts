import { NgModule, APP_INITIALIZER } from '@angular/core';
import { SocketClusterService } from './socket-cluster.service';
import { GameService } from './game.service';

@NgModule({
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
    GameService
  ],
  imports: [],
  exports: []
})
export class SharedModule { }
