import { Component, Input } from '@angular/core';
import { GenderPositions } from './genders';
import { GameService } from '../../game.service';


@Component({
  selector: 'app-gendervatar',
  templateUrl: './gendervatar.component.html',
  styleUrls: ['./gendervatar.component.scss'],
})
export class GendervatarComponent {

  @Input() public gender: string;
  @Input() public scale = 2;

  get spriteUrl() {
    return `${this.gameService.baseUrl}/assets/tiles.png`;
  }

  get genderPositions() {
    return GenderPositions;
  }

  constructor(private gameService: GameService) {}

  scaleStyle(): string {
    return `scale(${this.scale}, ${this.scale})`;
  }

  imgStyleFit(): string {
    const pos = this.genderPositions[this.gender] || { x: 5, y: 1 };
    return `-${pos.x * 16}px -${(pos.y * 16)}px`;
  }

}
