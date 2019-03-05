import { Component, OnInit, OnDestroy } from '@angular/core';

import { species } from 'fantastical';
import { sample } from 'lodash';

import { SocketClusterService } from '../socket-cluster.service';
import { Subscription } from 'rxjs';
import { ServerEventName } from '../../../shared/interfaces';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  public charName: string;
  public loading = true;
  public needsSignUp: boolean;

  public get canSignUp(): boolean {
    return this.charName && this.charName.length < 20 && this.charName.length > 1;
  }

  private user$: Subscription;
  private needsNameCb: Function;

  constructor(
    private socketService: SocketClusterService
  ) {}

  ngOnInit() {
    this.needsNameCb = () => this.needsName();
    this.socketService.register(ServerEventName.AuthNeedsName, this.needsNameCb);

    this.user$ = this.socketService.userId$.subscribe(userId => {
      if(!userId) return;

      this.socketService.emit({ name: ServerEventName.AuthSignIn, data: { userId } });
    });
  }

  ngOnDestroy() {
    this.socketService.unregister(ServerEventName.AuthNeedsName, this.needsNameCb);

    this.user$.unsubscribe();
  }

  public randomName() {
    const func = sample(Object.keys(species));
    this.charName = species[func]();
  }

  public signUp() {

  }

  private needsName() {
    setTimeout(() => {
      this.needsSignUp = true;
    }, 1000);
  }

}
