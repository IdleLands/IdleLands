import { Component, OnInit, OnDestroy } from '@angular/core';

import { species } from 'fantastical';
import { sample } from 'lodash';
import { Subscription, combineLatest } from 'rxjs';

import { SocketClusterService, Status } from '../socket-cluster.service';
import { ServerEventName } from '../../../shared/interfaces';
import { IPlayer } from '../../../shared/interfaces/IPlayer';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  public charName: string;
  public loading = true;
  public needsSignUp: boolean;
  public hasError: boolean;
  public player: IPlayer;
  public isNewPlayer: boolean;
  private userId: string;

  public get canSignUp(): boolean {
    return this.charName && this.charName.length < 20 && this.charName.length > 1;
  }

  private user$: Subscription;
  private error$: Subscription;
  private needsNameCb: Function;
  private syncPlayerCb: Function;

  constructor(
    private socketService: SocketClusterService
  ) {}

  ngOnInit() {
    this.needsNameCb = () => this.needsName();
    this.socketService.register(ServerEventName.AuthNeedsName, this.needsNameCb);

    this.syncPlayerCb = (p) => this.syncPlayer(p);
    this.socketService.register(ServerEventName.CharacterSync, this.syncPlayerCb);

    this.user$ = combineLatest(
      this.socketService.userId$,
      this.socketService.status$
    ).subscribe(([userId, status]) => {
      this.userId = userId;

      if(status === Status.Disconnected) {
        this.hasError = true;
        return;
      }

      if(userId && status === Status.Connected) {
        this.hasError = false;
        this.loading = true;
        this.player = null;
        this.needsSignUp = false;
        this.socketService.emit(ServerEventName.AuthSignIn, { userId });
      }
    });

    this.error$ = this.socketService.error$.subscribe(error => {
      if(error.message === 'Socket hung up') this.hasError = true;
    });
  }

  ngOnDestroy() {
    this.socketService.unregister(ServerEventName.AuthNeedsName, this.needsNameCb);
    this.socketService.unregister(ServerEventName.CharacterSync, this.syncPlayerCb);

    this.user$.unsubscribe();
    this.error$.unsubscribe();
  }

  public refresh() {
    window.location.reload();
  }

  public randomName() {
    const func = sample(Object.keys(species));
    this.charName = species[func]();
  }

  public signUp() {
    if(!this.canSignUp) return;
    this.socketService.emit(ServerEventName.AuthRegister, { name: this.charName, userId: this.userId });
  }

  private needsName() {
    setTimeout(() => {
      this.needsSignUp = true;
      this.loading = false;
    }, 1000);
  }

  private syncPlayer(player: IPlayer) {
    this.loading = false;
    this.player = player;

    this.isNewPlayer = (Date.now() - this.player.createdAt) / (1000 * 3600 * 24) < 1;
  }

  public play() {
    this.socketService.emit(ServerEventName.PlayGame, { userId: this.userId });
    // TODO: go to play
  }

  // TODO: add "or sign in with X or Y" to sync your character to this location

}
