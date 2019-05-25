import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';
import { ServerEventName } from '../../../shared/interfaces';
import { IonList } from '@ionic/angular';

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
    private gameService: GameService,
    private socketService: SocketClusterService
  ) { }

  async ngOnInit() {
    this.mutationObserver = new MutationObserver(() => {
      setTimeout(() => {
        this.chatArea.el.scrollTop = this.chatArea.el.scrollHeight;
      }, 100);
    });

    this.mutationObserver.observe(this.chatList.nativeElement, {
      childList: true
    });

    setTimeout(() => {
      this.gameService.resetMessages();
    }, 0);
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

}
