import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'character', loadChildren: './character/character.module#CharacterPageModule' },
  { path: 'choices', loadChildren: './choices/choices.module#ChoicesPageModule' },
  { path: 'adventure-log', loadChildren: './adventure-log/adventure-log.module#AdventureLogPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
