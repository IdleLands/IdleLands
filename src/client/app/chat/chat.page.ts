import { Component, OnInit, ElementRef, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { ServerEventName } from '../../../shared/interfaces';
import { IonList, PopoverController } from '@ionic/angular';
import { ModQuickPopover } from './modquick.popover';
import { SafeHtml, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  @ViewChild('chatArea') private chatArea: any;
  @ViewChild(IonList, { read: ElementRef }) private chatList: ElementRef;
  private mutationObserver: MutationObserver;

  public message: string;

  constructor(
    private popoverCtrl: PopoverController,
    public gameService: GameService,
    private socketService: SocketClusterService
  ) { }

  async ngOnInit() {

    this.gameService.updateOptions();

    this.mutationObserver = new MutationObserver(() => {
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    });

    this.mutationObserver.observe(this.chatList.nativeElement, {
      childList: true
    });

    setTimeout(() => {
      this.gameService.resetMessages();

      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }, 0);
  }

  private scrollToBottom() {
    this.chatArea.el.scrollTop = this.chatArea.el.scrollHeight;
  }

  async toggleChatMenu() {
    this.gameService.playerMenu.toggle();
  }

  send() {
    const message = (this.message || '').trim();
    if(!message) return;

    this.socketService.emit(ServerEventName.ChatMessage, { message });
    this.message = '';
  }

  async openPopover(playerName: string, $event) {
    if(!this.gameService.playerRef.modTier || !playerName) return;

    $event.preventDefault();
    $event.stopPropagation();

    const popover = await this.popoverCtrl.create({
      component: ModQuickPopover,
      componentProps: {
        playerName
      },
      event: $event,
      translucent: true
    });

    return await popover.present();
  }

}

@Pipe({
    name: 'replaceDiscordEmoji'
})
export class DiscordEmojiPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  public transform(message: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(
      message
        .split(' ')
        .map(word => {
          const matches = word.match(/&lt;a?:([a-zA-Z0-9_]+):([0-9]+)&gt;/);
          if(!matches || !matches[0] || !matches[1] || !matches[2]) return word;
          const ext = word.includes('<a:') ? 'gif' : 'png';
          return `
            <img class="discord-emoji" alt="${matches[1]}" src="https://cdn.discordapp.com/emojis/${matches[2]}.${ext}?v=1" />
          `;
        })
        .join(' ')
    );
  }
}
