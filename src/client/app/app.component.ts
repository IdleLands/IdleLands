import { Component, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { Platform, ModalController, AlertController, IonMenu } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

import { interval } from 'rxjs';
import { filter } from 'rxjs/operators';

import { sample } from 'lodash';

import { GameService } from './game.service';
import { SocketClusterService } from './socket-cluster.service';
import { IPlayer, ServerEventName, IPet } from '../../shared/interfaces';
import { UiService } from './ui.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  @ViewChild('playerMenu')
  public playerMenu: IonMenu;

  public a2hsPrompt: any;
  public canUpdate: boolean;

  public hiddenSplitPane: boolean;
  public hiddenPlayerMenu: boolean;

  private clouds = 0;

  public appPages = [

    { name: 'Moderation', icon: 'moderation', url: '/moderator', hideIf: (player) => !player.modTier },

    { name: 'Accomplishments', icon: 'achievements', url: '/accomplishments' },

    {
      name: 'Chat', icon: 'chat', url: '/chat', badgeColor: 'primary', badge: () => {
        return this.gameService.unreadMessages;
      }
    },

    {
      name: 'Gear', icon: 'gear', url: '/gear', badgeColor: 'secondary', badge: (player) => {
        return this.uiService.isPlayerInventoryFull(player) || this.uiService.getPlayerScrolls(player);
      }
    },

    { name: 'Guilds', icon: 'guild', url: '/guilds', hideIf: (player) => player.guildName || player.hardcore },

    { name: 'Guild', icon: 'guild', url: '/guild', hideIf: (player) => !player.guildName || player.hardcore },

    { name: 'Map', icon: 'map', url: '/map' },

    {
      name: 'Pets', icon: 'allpets', url: '/pets', badgeColor: 'success', badge: (player) => {
        return this.uiService.isPetsAdventureCompleted(player);
      }
    },

    {
      name: 'Premium', icon: 'premium', url: '/premium', badge: (player) => {
        return this.uiService.canDoFreeRolls(player);
      }
    },

    {
      name: 'Quests', icon: 'questglobal', url: '/quests', badgeColor: 'success', badge: (player) => {
        return this.uiService.isAnyQuestComplete(player);
      }
    },

    {
      name: 'Settings', icon: 'settings', url: '/settings', badgeColor: 'danger', badge: (player) => {
        return this.uiService.isSettingsUnSynced(player);
      }
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private updates: SwUpdate,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private storage: Storage,
    private socketService: SocketClusterService,
    public gameService: GameService,
    public uiService: UiService
  ) {
    this.initializeApp();
    this.watchRouteChanges();
    this.watchAppChanges();
    this.watchSpecialEvents();
  }

  public playerCircleText(player: IPlayer) {
    if (player.level.__current === player.level.maximum) return '!';
    if (player.ascensionLevel > 0) return player.ascensionLevel;
    return 'XP';
  }

  public a2hs() {
    this.a2hsPrompt.prompt();
    this.a2hsPrompt = null;
  }

  public async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Log out?',
      message: 'Are you sure you want to log out?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Yes, log out!', handler: async () => {
            await this.router.navigate(['/home']);
            this.gameService.logout();
          }
        }
      ]
    });

    alert.present();
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    window.onpopstate = async () => {
      try {
        const element = await this.modalCtrl.getTop();
        if (element) { element.dismiss(); }
      } catch (e) { }
    };

    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.a2hsPrompt = e;
    });

    setTimeout(() => {
      this.gameService.playerMenu = this.playerMenu;
    }, 0);
  }

  private watchAppChanges() {
    if (!this.updates.isEnabled) { return; }

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
      .subscribe(async (x: NavigationEnd) => {
        const isShare = x.urlAfterRedirects.includes('/s/c/');

        const isHome = x.urlAfterRedirects.includes('/home');
        this.hiddenSplitPane = isHome || isShare;

        const isChat = x.urlAfterRedirects.includes('/chat');
        this.hiddenPlayerMenu = !isChat;

        if (!isHome && !this.gameService.hasPlayer && !isShare) {
          await this.router.navigate(['/home']);
          this.hiddenSplitPane = true;
        }

        if (!isHome && !x.urlAfterRedirects.includes('/combat') && !isShare) {
          this.storage.set('lastUrl', x.urlAfterRedirects);
        }
      });
  }

  public async doAppUpdate() {
    await this.updates.activateUpdate();
    document.location.reload();
  }

  public theCloud() {
    this.clouds++;

    const clicks = {
      0: 'IdleLands',
      5: 'Why are you doing this?',
      10: 'There are better things to do...',
      20: 'Go back to idling!',
      50: 'Stop that.',
      60: 'Really, stop that.',
      70: 'Please?',
      75: 'Please??',
      80: 'Please???',
      85: 'Please????',
      90: 'Please?????',
      95: 'Please??????',
      100: 'Please???????',
      105: 'Fine.',
      120: 'I have accepted this.',
      150: 'Okay, maybe not really.',
      170: 'You\'re being pretty annoying.',
      200: 'LEAVE ME ALONE',
      201: 'OR ELSE',
      202: 'I WILL DISCONNECT YOU',
      205: '... That didn\'t stop you?',
      210: 'I was being mean :(',
      211: 'Please come back :(',
      212: 'I didn\'t mean it :(',
      215: 'Sigh...',
      220: 'Okay, we\'re done here.',
      225: 'No, really, we\'re done.',
      250: 'I SAID WE\'RE DONE!',
      275: 'NO SOUP FOR YOU!',
      300: 'GOOD DAY SIR (or madam)!',
      350: 'W',
      351: 'H',
      352: 'Y',
      355: '...',
      356: '....',
      357: '.....',
      358: '......',
      359: '.......',
      360: '........',
      361: '.........................................',
      362: 'Goodbye.',
      363: '...',
      366: 'Okay, this is getting really old.',
      388: 'You WILL be disconnected!',
      390: 'Try me.',
      391: 'You really will.',
      398: 'Don\t tempt me!',
      399: 'Okay, here goes...'
    };

    const msg = clicks[this.clouds];

    if (msg) {
      const allColors = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'danger', 'dark', 'medium', 'light'];
      let type = 'primary';

      if (this.clouds >= 50) type = 'secondary';
      if (this.clouds >= 60) type = 'tertiary';

      if (this.clouds >= 70) type = 'success';

      if (this.clouds >= 105) type = 'warning';

      if (this.clouds >= 200) type = sample(['dark', 'medium', 'light']);

      if (this.clouds >= 355) type = sample(allColors);
      if (this.clouds >= 366) type = 'danger';

      this.socketService.toastNotify({ message: msg, type });
    }

    if (this.clouds > 400) window.location.reload();
  }

  public hardcoreDescription() {
    const alert = await this.alertCtrl.create({
      header: 'Hardcore',
      message: `Welcome to Hardcore!
      <br>
      <br>
      Hardcore is a feature only for the most dedicated players of Idle Lands.  Be warned that in Hardcore, death is permanent.
      <br>
      Well, sort of.
      <br>
      Death will kill your character and your progress, but it's not the end of the line forever.
      <br>
      You may revive a dead Hardcore character at any time to begin your process anew.
      <br>
      You will lose everything except your Hardcore statistics, and a select few achievements, and start completely fresh from the beginning.
      <br>
      Hardcore also changes the game slightly.
      <br>
      Parties, PVP combat, Guilds, Salvaging, Festivals, Premium purchases, Witch events, and Quests are permantly disabled.
      <br>
      Barbarian's Duel, Bard's Orchestra, and Cleric's Cure have been adjusted.  Enhancing pets is now free.
      <br>
      You'll also earn some shiny new achievements for your primary character, so make sure to keep on idling.
      <br>
      Best of luck!`,
      buttons: [
        { text: 'Okay', role: 'cancel' }
      ]
    });
  }

  private watchSpecialEvents() {

    // "recent combat" toast popup
    this.socketService.register(ServerEventName.AdventureLogAdd, ({ type, combatString }) => {
      if (type !== 'combat' || !combatString) return;

      this.socketService.toastNotify({
        header: 'Recent Combat!',
        message: 'You have a new combat! Would you like to view it?',
        duration: 5000,
        buttons: [
          {
            text: 'Yes',
            handler: () => {
              this.router.navigate(['/combat', combatString]);
            }
          },
          { text: 'No' }
        ]
      });
    });
  }
}
