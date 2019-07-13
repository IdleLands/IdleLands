import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { NgCircleProgressModule } from 'ng-circle-progress';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared.module';

import { PetsPage } from './tab-pets/tab-pets.page';
import { TabCharPage } from './tab-char/tab-char.page';
import { TabGearPage } from './tab-gear/tab-gear.page';
import { TabAccomplishmentsPage } from './tab-accomplishments/tab-accomplishments.page';
import { TabPremiumPage } from './tab-premium/tab-premium.page';

@NgModule({
  declarations: [AppComponent, PetsPage, TabCharPage, TabGearPage, TabAccomplishmentsPage, TabPremiumPage],
  entryComponents: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,
    SharedModule,
    NgCircleProgressModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
