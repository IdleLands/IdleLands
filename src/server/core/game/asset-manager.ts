import { Singleton, AutoWired, Inject } from 'typescript-ioc';
import { sample, includes } from 'lodash';

import { DatabaseManager } from './database-manager';

@Singleton
@AutoWired
export class AssetManager {

  @Inject public databaseManager: DatabaseManager;

  private stringAssets: any;
  private objectAssets: any;

  public async init() {
    const { stringAssets, objectAssets } = await this.databaseManager.loadAssets();

    this.stringAssets = stringAssets;
    this.objectAssets = objectAssets;
  }

  private stringFromGrammar(grammar: string): string {
    if(!grammar) return '';

    return grammar.split(' ').map(piece => {
      if(!includes(piece, '%')) return piece;
      return sample(this.stringAssets[piece.split('%')[1]]);
    })
    .join(' ');
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
