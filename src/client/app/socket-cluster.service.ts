
import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import * as SocketCluster from 'socketcluster-client';
import { Signal } from 'signals';
import * as scCodecMinBin from 'sc-codec-min-bin';

import { environment } from './../environments/environment';
import { ServerEventName, GameEvent, Channel } from '../../shared/interfaces';
import { ToastController, AlertController } from '@ionic/angular';
import { ToastOptions } from '@ionic/core';

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

  private allSignals = { };

  private channels: { [key in Channel]?: any } = { };

  public get error$() {
    return this.error;
  }

  public get status$() {
    return this.status;
  }

  public get gameEvent$() {
    return this.gameEvent;
  }

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) { }

  public init() {
    if(this.hasInit) throw new Error('SocketClusterService has already been initialized.');
    this.hasInit = true;

    this.initSocket();
  }

  private initSocket() {
    const opts: any = { hostname: environment.server.hostname, port: environment.server.port, secure: environment.server.secure };
    // opts.codecEngine = scCodecMinBin;
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

    this.register(ServerEventName.CharacterFirstTime, async () => {
      const modal = await this.alertCtrl.create({
        header: 'Welcome to IdleLands!',
        message: `Welcome! It seems like it's your first time here.
        <br><br>
        · Check out the adventure log to see a bit more about what your adventurer is up to!
        <br>
        · Also, check out the choices area to see what you can decide for your adventurer!
        <br>
        · Finally, be sure to head to Settings and sync your account with an email. Otherwise, you might lose your character!
        <br><br>
        If you have any questions, ask around in chat.`,
        buttons: ['OK! Lets do this!']
      });

      await modal.present();
    });
  }

  public async toastNotify(info) {
    if(!document.hasFocus()) return;

    const toastOpts: ToastOptions = {
      header: info.header,
      position: info.position || 'top',
      showCloseButton: !info.buttons,
      message: info.message,
      duration: info.duration || 3000,
      color: info.type,
      buttons: info.buttons
    };

    const toast = await this.toastCtrl.create(toastOpts);
    toast.present();
  }

  public emit(evt: ServerEventName, data: any = { }) {
    this.socket.emit(evt, data);
  }

  public register(signal: ServerEventName, callback: Function) {
    if(!this.allSignals[signal]) this.allSignals[signal] = new Signal();
    this.allSignals[signal].add(callback);
  }

  public unregister(signal: ServerEventName, callback: Function) {
    this.allSignals[signal].remove(callback);
  }

  public watch(channel: Channel, callback: Function) {
    this.channels[channel] = this.channels[channel] || this.socket.subscribe(channel);
    this.channels[channel].watch(callback);
  }
}
