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
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsPageModule) },
  { path: 'map', loadChildren: () => import('./map/map.module').then(m => m.MapPageModule) },
  { path: 'chat', loadChildren: () => import('./chat/chat.module').then(m => m.ChatPageModule) },

  { path: 'accomplishments', component: TabAccomplishmentsPage, children: [
    {
      path: 'achievements',
      children: [
        { path: '', loadChildren: () => import('./achievements/achievements.module').then(m => m.AchievementsPageModule) }
      ]
    },
    {
      path: 'collectibles',
      children: [
        { path: '', loadChildren: () => import('./collectibles/collectibles.module').then(m => m.CollectiblesPageModule) }
      ]
    },
    {
      path: 'statistics',
      children: [
        { path: '', loadChildren: () => import('./statistics/statistics.module').then(m => m.StatisticsPageModule) }
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
        { path: '', loadChildren: () => import('./astral-gate/astral-gate.module').then(m => m.AstralGatePageModule) }
      ]
    },
    {
      path: 'ilp',
      children: [
        { path: '', loadChildren: () => import('./premium/premium.module').then(m => m.PremiumPageModule) }
      ]
    },

    { path: 'gold',
      children: [
        { path: '', loadChildren: () => import('./premium-gold/premium-gold.module').then(m => m.PremiumGoldPageModule) }
      ]
    },

    {
      path: 'festivals',
      children: [
        { path: '', loadChildren: () => import('./festivals/festivals.module').then(m => m.FestivalsPageModule) }
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
        { path: '', loadChildren: () => import('./equipment/equipment.module').then(m => m.EquipmentPageModule) }
      ]
    },
    {
      path: 'inventory',
      children: [
        { path: '', loadChildren: () => import('./inventory/inventory.module').then(m => m.InventoryPageModule) }
      ]
    },
    {
      path: 'materials',
      children: [
        { path: '', loadChildren: () => import('./enhancement-materials/enhancement-materials.module').then(m => m.EnhancementMaterialsPageModule) }
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
        { path: '', loadChildren: () => import('./character/character.module').then(m => m.CharacterPageModule) }
      ]
    },
    {
      path: 'adventure-log',
      children: [
        { path: '', loadChildren: () => import('./adventure-log/adventure-log.module').then(m => m.AdventureLogPageModule) }
      ]
    },
    {
      path: 'choices',
      children: [
        { path: '', loadChildren: () => import('./choices/choices.module').then(m => m.ChoicesPageModule) }
      ]
    },
    {
      path: 'personalities',
      children: [
        { path: '', loadChildren: () => import('./personalities/personalities.module').then(m => m.PersonalitiesPageModule) }
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
        { path: '', loadChildren: () => import('./petslist/petslist.module').then(m => m.PetslistPageModule) }
      ]
    },
    {
      path: 'current',
      children: [
        { path: '', loadChildren: () => import('./petcurrent/petcurrent.module').then(m => m.PetcurrentPageModule) }
      ]
    },
    {
      path: 'gear',
      children: [
        { path: '', loadChildren: () => import('./petcurrentequipment/petcurrentequipment.module').then(m => m.PetcurrentequipmentPageModule) }
      ]
    },
    {
      path: 'adventures',
      children: [
        { path: '', loadChildren: () => import('./adventures/adventures.module').then(m => m.AdventuresPageModule) }
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
        { path: '', loadChildren: () => import('./quests-personal/quests-personal.module').then(m => m.QuestsPersonalPageModule) }
      ]
    },
    {
      path: 'global',
      children: [
        { path: '', loadChildren: () => import('./quests-global/quests-global.module').then(m => m.QuestsGlobalPageModule) }
      ]
    },
    {
      path: '',
      redirectTo: '/quests/personal',
      pathMatch: 'full'
    }
  ] },

  { path: 'combat/:combatData', loadChildren: () => import('./combat/combat.module').then(m => m.CombatPageModule) },

  { path: 's/c/:combatData', loadChildren: () => import('./combat/combat.module').then(m => m.CombatPageModule) },

  { path: 'moderator', loadChildren: () => import('./moderator/moderator.module').then(m => m.ModeratorPageModule) },

  { path: 'guild', component: TabGuildsPage, children: [
    {
      path: 'overview',
      children: [
        { path: '', loadChildren: () => import('./guild-overview/guild-overview.module').then(m => m.GuildOverviewPageModule) }
      ]
    },
    {
      path: 'buildings',
      children: [
        { path: '', loadChildren: () => import('./guild-buildings/guild-buildings.module').then(m => m.GuildBuildingsPageModule) }
      ]
    },

    { path: 'members',
      children: [
        { path: '', loadChildren: () => import('./guild-manage/guild-manage.module').then(m => m.GuildManagePageModule) }
      ]
    },
    {
      path: '',
      redirectTo: '/guild/overview',
      pathMatch: 'full'
    }
  ] },

  { path: 'guilds', loadChildren: () => import('./guild-none/guild-none.module').then(m => m.GuildNonePageModule) },

  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
