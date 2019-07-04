import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PetsPage } from './pets/pets.page';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'character', loadChildren: './character/character.module#CharacterPageModule' },
  { path: 'adventure-log', loadChildren: './adventure-log/adventure-log.module#AdventureLogPageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'inventory', loadChildren: './inventory/inventory.module#InventoryPageModule' },
  { path: 'statistics', loadChildren: './statistics/statistics.module#StatisticsPageModule' },
  { path: 'equipment', loadChildren: './equipment/equipment.module#EquipmentPageModule' },
  { path: 'choices', loadChildren: './choices/choices.module#ChoicesPageModule' },
  { path: 'personalities', loadChildren: './personalities/personalities.module#PersonalitiesPageModule' },
  { path: 'achievements', loadChildren: './achievements/achievements.module#AchievementsPageModule' },
  { path: 'map', loadChildren: './map/map.module#MapPageModule' },
  { path: 'collectibles', loadChildren: './collectibles/collectibles.module#CollectiblesPageModule' },
  { path: 'chat', loadChildren: './chat/chat.module#ChatPageModule' },
  { path: 'pets', component: PetsPage, children: [
    {
      path: 'all',
      children: [
        { path: '', loadChildren: './petslist/petslist.module#PetslistPageModule' }
      ]
    },
    {
      path: 'current',
      children: [
        { path: '', loadChildren: './petcurrent/petcurrent.module#PetcurrentPageModule' }
      ]
    },
    {
      path: '',
      redirectTo: '/pets/current',
      pathMatch: 'full'
    }
  ] },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
