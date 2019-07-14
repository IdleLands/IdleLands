import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { SocketClusterService } from '../socket-cluster.service';

import * as Gachas from '../../../shared/astralgate';
import { IGacha } from '../../../shared/interfaces';

@Component({
  selector: 'app-astral-gate',
  templateUrl: './astral-gate.page.html',
  styleUrls: ['./astral-gate.page.scss'],
})
export class AstralGatePage implements OnInit {

  public gachas: IGacha[] = [];

  constructor(
    private socketService: SocketClusterService,
    public gameService: GameService
  ) { }

  ngOnInit() {
    this.gachas.push(...Object.values(Gachas).map(ctor => new ctor()));
  }

}
