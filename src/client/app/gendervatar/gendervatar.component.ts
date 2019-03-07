import { Component, Input } from '@angular/core';
import { environment } from '../../environments/environment';

const genderPositions = {
  blue:                   { x: 2,   y: 1 },
  male:                   { x: 3,   y: 1 },
  female:                 { x: 4,   y: 1 },
  glowcloud:              { x: 8,   y: 6 },
  'not a bear':           { x: 0,   y: 8 },
  'astronomical entity':  { x: 1,   y: 8 },
  soap:                   { x: 3,   y: 17},
  'boss monster':         { x: 7,   y: 2 },

  'Fighter-blue':         { x: 7,   y: 9 },
  'Fighter-red':          { x: 8,   y: 9 },
  'Fighter-green':        { x: 0,   y: 10 },
  'Fighter-gold':         { x: 1,   y: 10 },

  'Mage-blue':            { x: 2,   y: 10 },
  'Mage-red':             { x: 3,   y: 10 },
  'Mage-green':           { x: 4,   y: 10 },
  'Mage-gold':            { x: 5,   y: 10 },

  'Cleric-blue':          { x: 6,   y: 10 },
  'Cleric-red':           { x: 7,   y: 10 },
  'Cleric-green':         { x: 8,   y: 10 },
  'Cleric-gold':          { x: 0,   y: 11 },

  'Jester-blue':          { x: 1,   y: 11 },
  'Jester-red':           { x: 2,   y: 11 },
  'Jester-green':         { x: 3,   y: 11 },
  'Jester-gold':          { x: 4,   y: 11 },

  'Rogue-blue':           { x: 5,   y: 11 },
  'Rogue-red':            { x: 6,   y: 11 },
  'Rogue-green':          { x: 7,   y: 11 },
  'Rogue-gold':           { x: 8,   y: 11 },

  'Generalist-blue':      { x: 0,   y: 12 },
  'Generalist-red':       { x: 1,   y: 12 },
  'Generalist-green':     { x: 2,   y: 12 },
  'Generalist-gold':      { x: 3,   y: 12 },

  'Archer-blue':          { x: 4,   y: 12 },
  'Archer-red':           { x: 5,   y: 12 },
  'Archer-green':         { x: 6,   y: 12 },
  'Archer-gold':          { x: 7,   y: 12 },

  'Pirate-blue':          { x: 8,   y: 12 },
  'Pirate-red':           { x: 0,   y: 13 },
  'Pirate-green':         { x: 1,   y: 13 },
  'Pirate-gold':          { x: 2,   y: 13 },

  'MagicalMonster-blue':  { x: 3,   y: 13 },
  'MagicalMonster-red':   { x: 4,   y: 13 },
  'MagicalMonster-green': { x: 5,   y: 13 },
  'MagicalMonster-gold':  { x: 6,   y: 13 },

  'Monster-blue':         { x: 7,   y: 13 },
  'Monster-red':          { x: 8,   y: 13 },
  'Monster-green':        { x: 0,   y: 14 },
  'Monster-gold':         { x: 1,   y: 14 },

  'Barbarian-blue':       { x: 2,   y: 14 },
  'Barbarian-red':        { x: 3,   y: 14 },
  'Barbarian-green':      { x: 4,   y: 14 },
  'Barbarian-gold':       { x: 5,   y: 14 },

  'Bard-blue':            { x: 6,   y: 14 },
  'Bard-red':             { x: 7,   y: 14 },
  'Bard-green':           { x: 8,   y: 14 },
  'Bard-gold':            { x: 0,   y: 15 },

  'SandwichArtist-blue':  { x: 1,   y: 15 },
  'SandwichArtist-red':   { x: 2,   y: 15 },
  'SandwichArtist-green': { x: 3,   y: 15 },
  'SandwichArtist-gold':  { x: 4,   y: 15 },

  'Necromancer-blue':     { x: 5,   y: 15 },
  'Necromancer-red':      { x: 6,   y: 15 },
  'Necromancer-green':    { x: 7,   y: 15 },
  'Necromancer-gold':     { x: 8,   y: 15 },

  'Bitomancer-blue':      { x: 0,   y: 16 },
  'Bitomancer-red':       { x: 1,   y: 16 },
  'Bitomancer-green':     { x: 2,   y: 16 },
  'Bitomancer-gold':      { x: 3,   y: 16 },

  'green boss monster':   { x: 5,   y: 16 },
  'blue boss monster':    { x: 6,   y: 16 },
  'gold boss monster':    { x: 7,   y: 16 },

  'veteran male':         { x: 8,   y: 16 },
  'veteran female':       { x: 0,   y: 17 },

  'angry bear':           { x: 1,   y: 17 },
  'mighty glowcloud':     { x: 2,   y: 17 },

};

@Component({
  selector: 'app-gendervatar',
  templateUrl: './gendervatar.component.html',
  styleUrls: ['./gendervatar.component.scss'],
})
export class GendervatarComponent {

  @Input() public gender: string;
  @Input() public scale = 2 ;

  get baseUrl() {
    return `${environment.app.protocol}://${environment.app.hostname}:${environment.app.port}/assets/tiles.png`;
  }

  get genderPositions() {
    return genderPositions;
  }

  scaleStyle(): string {
    return `scale(${this.scale}, ${this.scale})`;
  }

  imgStyleFit(): string {
    const pos = genderPositions[this.gender] || { x: 5, y: 1 };
    return `-${pos.x * 16}px -${(pos.y * 16)}px`;
  }

}
