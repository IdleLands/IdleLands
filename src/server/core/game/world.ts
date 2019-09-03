import { Singleton, AutoWired } from 'typescript-ioc';
import { get } from 'lodash';

import { Blockers, GidMap } from '../static/tile-data';

export interface Tile {
  terrain: string;
  blocked: boolean;
  blocker?: number;
  region: string;
  object?: any;
}

class Map {

  public get height(): number {
    return this.map.height;
  }

  public get width(): number {
    return this.map.width;
  }

  public get jsonMap(): any {
    return this.map;
  }

  private regions: { [key: string]: boolean } = { };
  public get allRegions(): string[] {
    return Object.keys(this.regions);
  }

  constructor(private map: any, private data: any) {
    this.init();
  }

  private init() {
    Object.keys(this.data.regions).forEach(x => {
      Object.keys(this.data.regions[x]).forEach(y => {
        this.regions[this.data.regions[x][y] || 'Wilderness'] = true;
      });
    });

    if(Object.keys(this.regions).length === 0) this.regions['Wilderness'] = true;
  }

  getTile(x: number, y: number): Tile {
    const tilePosition = (y * this.map.width) + x;

    return {
      terrain: GidMap[this.map.layers[0].data[tilePosition]] || 'Void',
      blocked: Blockers[this.map.layers[1].data[tilePosition]],
      blocker: GidMap[this.map.layers[1].data[tilePosition]],
      region: get(this.data.regions, [x, y]) || 'Wilderness',
      object: get(this.data.objects, [x, y])
    };
  }

}

@Singleton
@AutoWired
export class World {

  private maps: { [key: string]: Map } = { };
  public get mapNames() {
    return Object.keys(this.maps);
  }

  public init({ maps, mapInfo }) {
    Object.keys(maps).forEach(mapName => {
      this.maps[mapName] = new Map(maps[mapName], mapInfo[mapName]);
    });
  }

  public getMap(map: string): Map {
    return this.maps[map];
  }
}
