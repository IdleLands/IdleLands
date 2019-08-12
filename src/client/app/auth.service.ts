import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$ = this.afAuth.user;
  public token$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  public get authMethods() {
    return this.allAuth;
  }

  private allAuth = [
    { provider: auth.EmailAuthProvider,     name: 'Email',          type: 'password',     icon: 'mail' },
    { provider: auth.FacebookAuthProvider,  name: 'Facebook',       type: 'facebook.com', icon: 'logo-facebook' },
    { provider: auth.TwitterAuthProvider,   name: 'Twitter',        type: 'twitter.com',  icon: 'logo-twitter' },
    { provider: auth.GoogleAuthProvider,    name: 'Google',         type: 'google.com',   icon: 'logo-google' }
  ];

  constructor(
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth
  ) {
    this.init();
  }

  private init() {
    this.user$.subscribe(async user => {
      if(!user) {
        this.token$.next('');
        return;
      }

      this.token$.next(await user.getIdToken());
    });
  }

  async login(provider): Promise<any> {
    return new Promise(async (resolve, reject) => {

      if(provider === auth.EmailAuthProvider) {
        const alert = await this.alertCtrl.create({
          header: 'Email/Password Sync',
          subHeader: 'Enter your email and desired password to sync with here.',
          inputs: [
            {
              name: 'emailAddress',
              type: 'email',
              placeholder: 'Email Address'
            },
            {
              name: 'password',
              type: 'password',
              placeholder: '********'
            }
          ],
          buttons: [
            { text: 'Cancel', handler: reject },
            {
              text: 'Sign In',
              handler: async (values) => {
                const { emailAddress, password } = values;

                let error;
                let res;

                try {
                  res = await this.afAuth.auth.createUserWithEmailAndPassword(emailAddress, password);
                } catch(e) {
                  error = e;
                }

                if(error && error.code === 'auth/email-already-in-use') {
                  try {
                    res = await this.afAuth.auth.signInWithEmailAndPassword(emailAddress, password);
                    error = null;
                  } catch(e) {
                    error = e;
                  }
                }

                if(error) {
                  const errAlert = await this.alertCtrl.create({
                    header: 'Error',
                    message: error.message,
                    buttons: ['OK']
                  });

                  await errAlert.present();
                }

                if(res) {
                  return resolve(res);
                }
              }
            }
          ]
        });

        alert.present();

      } else {
        try {
          const res = await this.afAuth.auth.signInWithPopup(new provider());
          resolve(res);
          return;
        } catch(e) {
          alert('Sorry! OAuth login/sync is not supported in IdleLands desktop at this time. Please use the PWA or Web version.');
        }
      }
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
