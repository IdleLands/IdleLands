import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ChatPage, DiscordEmojiPipe } from './chat.page';
import { SharedModule } from '../shared.module';
import { ModQuickPopover } from './modquick.popover';

const routes: Routes = [
  {
    path: '',
    component: ChatPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),

    SharedModule
  ],
  declarations: [ChatPage, DiscordEmojiPipe, ModQuickPopover],
  entryComponents: [ModQuickPopover]
})
export class ChatPageModule { }
