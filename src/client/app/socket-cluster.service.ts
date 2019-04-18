
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import * as SocketCluster from 'socketcluster-client';
import { Signal } from 'signals';
import * as scCodecMinBin from 'sc-codec-min-bin';

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

  private allSignals = {};

  public get error$() {
    return this.error;
  }

  public get status$() {
    return this.status;
  }

  public get gameEvent$() {
    return this.gameEvent;
  }

  constructor(private toastCtrl: ToastController) {}

  public init() {
    if(this.hasInit) throw new Error('SocketClusterService has already been initialized.');
    this.hasInit = true;

    this.initSocket();
  }

  private initSocket() {
    const opts: any = { hostname: environment.server.hostname, port: environment.server.port };
    opts.codecEngine = scCodecMinBin;
    this.socket = SocketCluster.connect(opts);

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

  public async toastNotify(info) {
    const toastOpts: any = {
      showCloseButton: true,
      message: info.message,
      duration: info.duration || 3000,
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
