import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Platform, ModalController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { interval } from 'rxjs';
import { filter } from 'rxjs/operators';

import { GameService } from './game.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  public a2hsPrompt: any;
  public canUpdate: boolean;

  public hiddenSplitPane: boolean;

  public appPages = [
    { name: 'Adventure Log', icon: 'adventurelog' },
    { name: 'Personalities', icon: 'personalities' },
    { name: 'Map', icon: 'map' },
    { name: 'Inventory', icon: 'inventory' },
    { name: 'Settings', icon: 'settings' },
    { name: 'Logout', icon: 'logout' }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private updates: SwUpdate,
    private modalCtrl: ModalController,
    public gameService: GameService
  ) {
    this.initializeApp();
    this.watchRouteChanges();
    this.watchAppChanges();
  }

  public a2hs() {
    this.a2hsPrompt.prompt();
    this.a2hsPrompt = null;
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    window.onpopstate = async () => {
      try {
        const element = await this.modalCtrl.getTop();
        if(element) { element.dismiss(); }
      } catch (e) {}
    };

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.a2hsPrompt = e;
    });
  }

  private watchAppChanges() {
    if(!this.updates.isEnabled) { return; }

    interval(1000 * 60 * 15).subscribe(() => this.updates.checkForUpdate());
    this.updates.available.subscribe(() => {
      this.canUpdate = true;
    });

    this.updates.checkForUpdate();
  }

  private watchRouteChanges() {
    this.router.events
      .pipe(
        filter(x => x instanceof NavigationEnd)
      )
      .subscribe((x: NavigationEnd) => {
        this.hiddenSplitPane = x.url.includes('/home');
      });
  }

  public async doAppUpdate() {
    await this.updates.activateUpdate();
    document.location.reload();
  }
}
