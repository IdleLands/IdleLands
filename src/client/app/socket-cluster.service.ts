
import { Injectable } from '@angular/core';
import * as SocketCluster from 'socketcluster-client';
import * as Fingerprint from 'fingerprintjs2';

import { environment } from './../environments/environment';
import { Subject, Observable, BehaviorSubject } from 'rxjs';

export enum Status {
  Connected,
  Disconnected
}

@Injectable({
  providedIn: 'root'
})
export class SocketClusterService {

  private hasInit: boolean;

  private socket: SocketCluster;

  private error: Subject<Error> = new Subject<Error>();
  private status: Subject<Status> = new Subject<Status>();
  private userId: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private errorObs: Observable<Error>;
  private statusObs: Observable<Status>;

  public get error$() {
    return this.errorObs;
  }

  public get status$() {
    return this.statusObs;
  }

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

    // TODO channel for map pos, chat
  }
}
