import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { sample, includes } from 'lodash';

import { DatabaseManager } from './database-manager';

@Singleton
@AutoWired
export class AssetManager {

  @Inject private databaseManager: DatabaseManager;

  private stringAssets: any;
  private objectAssets: any;
  private petAssets: any;
  private mapAssets: any;
  private mapInfoAssets: any;
  private teleports: any;

  public get allObjectAssets() {
    return this.objectAssets;
  }

  public get allStringAssets() {
    return this.stringAssets;
  }

  public get allPetAssets() {
    return this.petAssets;
  }

  public get allMapAssets() {
    return { maps: this.mapAssets, mapInfo: this.mapInfoAssets };
  }

  public get allTeleports() {
    return this.teleports;
  }

  public async init(assets) {
    const { stringAssets, objectAssets, mapAssets, petAssets, mapInformation, teleports } = assets;

    this.stringAssets = stringAssets;
    this.objectAssets = objectAssets;
    this.mapAssets = mapAssets;
    this.petAssets = petAssets;
    this.mapInfoAssets = mapInformation;
    this.teleports = teleports;
  }

  private stringFromGrammar(grammar: string): string {
    if(!grammar) return '';

    return grammar.split(' ').map(piece => {
      if(!includes(piece, '%')) return piece;
      return sample(this.stringAssets[piece.split('%')[1]]);
    })
    .join(' ');
  }

  public witch() {
    const grammar = sample(this.stringAssets.providenceGrammar);
    return this.stringFromGrammar(grammar);
  }

  public providence() {
    const grammar = sample(this.stringAssets.providenceGrammar);
    return this.stringFromGrammar(grammar);
  }

  public battle() {
    const grammar = sample(this.stringAssets.battleGrammar);
    return this.stringFromGrammar(grammar);
  }

  public party() {
    const grammar = sample(this.stringAssets.partyGrammar);
    return this.stringFromGrammar(grammar);
  }
}
