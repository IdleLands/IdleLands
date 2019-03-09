import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage {

  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private gameService: GameService
  ) { }

  public async deleteCharacter() {
    const alert = await this.alertCtrl.create({
      header: 'Delete Character',
      subHeader: 'Warning 1/3',
      message: `Are you sure you want to delete your character?
      You will lose all progress you've ever made, and your life will be fundamentally different.
      I'm not sure how you'll cope, honestly.`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Yes, proceed!', handler: async () => {

          const alert2 = await this.alertCtrl.create({
            header: 'Delete Character',
            subHeader: 'Warning 2/3',
            message: `Alright. So, what this means is that no character data will be retained.
            Your character will not be retrievable - it will not even be zeroes and ones.
            It will be gone forever.
            I will not be able to retrieve it.`,
            buttons: [
              { text: 'Cancel', role: 'cancel' },
              { text: 'I still want to proceed!', handler: async () => {

                const alert3 = await this.alertCtrl.create({
                  header: 'Delete Character',
                  subHeader: 'Warning 3/3',
                  message: `Okay! I really just wanted a third prompt here.
                  The button is on the opposite side this time, in case you somehow accidentally got here.
                  Thanks for checking out the game, and I'm sorry to see you go!`,
                  buttons: [
                    { text: 'Goodbye forever!', handler: async () => {
                      this.gameService.delete();
                      this.router.navigate(['/home']);
                    } },
                    { text: 'Cancel', role: 'cancel' }
                  ]
                });

                alert3.present();
              } }
            ]
          });

          alert2.present();
        } }
      ]
    });

    alert.present();
  }

}
