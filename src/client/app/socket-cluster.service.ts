
import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import * as SocketCluster from 'socketcluster-client';
import * as Fingerprint from 'fingerprintjs2';
import { Signal } from 'signals';

import { environment } from './../environments/environment';
import { ServerEventName, GameEvent } from '../../shared/interfaces';
import { ToastController } from '@ionic/angular';

export enum Status {
  Connected = 1,
  Disconnected = 2
}

@Injectable({
  providedIn: 'root'
})
export class SocketClusterService {

  private hasInit: boolean;

  private socket: SocketCluster;

  private error: Subject<Error> = new Subject<Error>();
  private gameEvent: Subject<GameEvent> = new Subject<GameEvent>();

  private status: BehaviorSubject<Status> = new BehaviorSubject<Status>(Status.Disconnected);
  private userId: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private errorObs: Observable<Error>;
  private statusObs: Observable<Status>;
  private gameEventObs: Observable<GameEvent>;
  private userIdObs: Observable<string>;

  private allSignals = {};

  public get error$() {
    return this.errorObs;
  }

  public get status$() {
    return this.statusObs;
  }

  public get gameEvent$() {
    return this.gameEventObs;
  }

  public get userId$() {
    return this.userIdObs;
  }

  constructor(private toastCtrl: ToastController) {}

  public init() {
    if(this.hasInit) throw new Error('SocketClusterService has already been initialized.');
    this.hasInit = true;

    this.initObs();
    this.initUser();
    this.initSocket();
  }

  private initObs() {
    this.errorObs = this.error.asObservable();
    this.statusObs = this.status.asObservable();
    this.gameEventObs = this.gameEvent.asObservable();
    this.userIdObs = this.userId.asObservable();
  }

  private initUser() {
    setTimeout(async () => {
      const components = await Fingerprint.getPromise();
      const userId = Fingerprint.x64hash128(components.map(x => x.value).join(''), 31);
      this.userId.next(userId);
    }, 500);
  }

  private initSocket() {
    this.socket = SocketCluster.connect(environment.socketCluster);

    this.socket.on('error', (err) => {
      console.error(err);
      this.error.next(err);
    });

    this.socket.on('connect', () => {
      this.status.next(Status.Connected);
    });

    this.socket.on('disconnect', () => {
      this.status.next(Status.Disconnected);
    });

    this.socket.on('gameevent', (ev) => {
      this.gameEvent.next(ev);
      if(ev.name === 'gamemessage') this.toastNotify(ev.data);
      if(this.allSignals[ev.name]) this.allSignals[ev.name].dispatch(ev.data);
    });

    // TODO channel for map pos, chat
  }

  private async toastNotify(info) {
    const toastOpts: any = {
      showCloseButton: true,
      message: info.message,
      duration: 3000,
      color: info.type
    };

    const toast = await this.toastCtrl.create(toastOpts);
    toast.present();
  }

  public emit(evt: ServerEventName, data: any = {}) {
    this.socket.emit(evt, data);
  }

  public register(signal: ServerEventName, callback: Function) {
    if(!this.allSignals[signal]) this.allSignals[signal] = new Signal();
    this.allSignals[signal].add(callback);
  }

  public unregister(signal: ServerEventName, callback: Function) {
    this.allSignals[signal].remove(callback);
  }
}
