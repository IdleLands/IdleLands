import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PetsPage } from './tab-pets/tab-pets.page';
import { TabCharPage } from './tab-char/tab-char.page';
import { TabGearPage } from './tab-gear/tab-gear.page';
import { TabAccomplishmentsPage } from './tab-accomplishments/tab-accomplishments.page';
import { TabPremiumPage } from './tab-premium/tab-premium.page';
import { TabQuestsPage } from './tab-quests/tab-quests.page';
import { TabGuildsPage } from './tab-guilds/tab-guilds.page';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsPageModule' },
  { path: 'map', loadChildren: './map/map.module#MapPageModule' },
  { path: 'chat', loadChildren: './chat/chat.module#ChatPageModule' },

  { path: 'accomplishments', component: TabAccomplishmentsPage, children: [
    {
      path: 'achievements',
      children: [
        { path: '', loadChildren: './achievements/achievements.module#AchievementsPageModule' }
      ]
    },
    {
      path: 'collectibles',
      children: [
        { path: '', loadChildren: './collectibles/collectibles.module#CollectiblesPageModule' }
      ]
    },
    {
      path: 'statistics',
      children: [
        { path: '', loadChildren: './statistics/statistics.module#StatisticsPageModule' }
      ]
    },
    {
      path: '',
      redirectTo: '/accomplishments/achievements',
      pathMatch: 'full'
    }
  ] },

  { path: 'premium', component: TabPremiumPage, children: [
    {
      path: 'astral-gate',
      children: [
        { path: '', loadChildren: './astral-gate/astral-gate.module#AstralGatePageModule' }
      ]
    },
    {
      path: 'ilp',
      children: [
        { path: '', loadChildren: './premium/premium.module#PremiumPageModule' }
      ]
    },

    { path: 'gold',
      children: [
        { path: '', loadChildren: './premium-gold/premium-gold.module#PremiumGoldPageModule' }
      ]
    },
    {
      path: 'festivals',
      children: [
        { path: '', loadChildren: './festivals/festivals.module#FestivalsPageModule' }
      ]
    },
    {
      path: '',
      redirectTo: '/premium/ilp',
      pathMatch: 'full'
    }
  ] },

  { path: 'gear', component: TabGearPage, children: [
    {
      path: 'equipment',
      children: [
        { path: '', loadChildren: './equipment/equipment.module#EquipmentPageModule' }
      ]
    },
    {
      path: 'inventory',
      children: [
        { path: '', loadChildren: './inventory/inventory.module#InventoryPageModule' }
      ]
    },
    {
      path: 'materials',
      children: [
        { path: '', loadChildren: './enhancement-materials/enhancement-materials.module#EnhancementMaterialsPageModule' }
      ]
    },
    {
      path: '',
      redirectTo: '/gear/equipment',
      pathMatch: 'full'
    }
  ] },

  { path: 'character', component: TabCharPage, children: [
    {
      path: 'me',
      children: [
        { path: '', loadChildren: './character/character.module#CharacterPageModule' }
      ]
    },
    {
      path: 'adventure-log',
      children: [
        { path: '', loadChildren: './adventure-log/adventure-log.module#AdventureLogPageModule' }
      ]
    },
    {
      path: 'choices',
      children: [
        { path: '', loadChildren: './choices/choices.module#ChoicesPageModule' }
      ]
    },
    {
      path: 'personalities',
      children: [
        { path: '', loadChildren: './personalities/personalities.module#PersonalitiesPageModule' }
      ]
    },
    {
      path: '',
      redirectTo: '/character/me',
      pathMatch: 'full'
    }
  ] },

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
      path: 'gear',
      children: [
        { path: '', loadChildren: './petcurrentequipment/petcurrentequipment.module#PetcurrentequipmentPageModule' }
      ]
    },
    {
      path: 'adventures',
      children: [
        { path: '', loadChildren: './adventures/adventures.module#AdventuresPageModule' }
      ]
    },
    {
      path: '',
      redirectTo: '/pets/current',
      pathMatch: 'full'
    }
  ] },

  { path: 'quests', component: TabQuestsPage, children: [
    {
      path: 'personal',
      children: [
        { path: '', loadChildren: './quests-personal/quests-personal.module#QuestsPersonalPageModule' }
      ]
    },
    {
      path: 'global',
      children: [
        { path: '', loadChildren: './quests-global/quests-global.module#QuestsGlobalPageModule' }
      ]
    },
    {
      path: '',
      redirectTo: '/quests/personal',
      pathMatch: 'full'
    }
  ] },

  { path: 'combat/:combatData', loadChildren: './combat/combat.module#CombatPageModule' },

  { path: 's/c/:combatData', loadChildren: './combat/combat.module#CombatPageModule' },

  { path: 'moderator', loadChildren: './moderator/moderator.module#ModeratorPageModule' },

  { path: 'guild', component: TabGuildsPage, children: [
    {
      path: 'overview',
      children: [
        { path: '', loadChildren: './guild-overview/guild-overview.module#GuildOverviewPageModule' }
      ]
    },
    {
      path: 'buildings',
      children: [
        { path: '', loadChildren: './guild-buildings/guild-buildings.module#GuildBuildingsPageModule' }
      ]
    },

    { path: 'members',
      children: [
        { path: '', loadChildren: './guild-manage/guild-manage.module#GuildManagePageModule' }
      ]
    },
    {
      path: '',
      redirectTo: '/guild/overview',
      pathMatch: 'full'
    }
  ] },

  { path: 'guilds', loadChildren: './guild-none/guild-none.module#GuildNonePageModule' },

  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
