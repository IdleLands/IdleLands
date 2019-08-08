import { AutoWired, Singleton } from 'typescript-ioc';

import { MongoClient } from 'mongodb';

interface IL3Stats {

  // actually refers to IL2
  Ancient: boolean;

  Donator: boolean;
  Contributor: boolean;
  Ascensions: number;
  Wolfmaster: boolean;
  Spiritualist: boolean;
  Anniversary: number;
}

@Singleton
@AutoWired
export class IL3Linker {
  public async getIL3Stats(name: string): Promise<IL3Stats> {

    const url = process.env.IDLELANDS3_MONGODB_URI;
    if(!url) return null;

    const client = await MongoClient.connect(url);

    const achColl = client.db('idlelands').collection('achievements');
    const achievements = await achColl.findOne({ _id: name });

    client.close();

    if(!achievements || !achievements.achievements) return null;

    const achievementR = achievements.achievements;

    const il3: IL3Stats = {
      Ancient: false,
      Donator: false,
      Contributor: false,
      Ascensions: 0,
      Wolfmaster: false,
      Spiritualist: false,
      Anniversary: 0
    };

    if(achievementR.Ancient) il3.Ancient = true;
    if(achievementR.Donator) il3.Donator = true;
    if(achievementR.Contributor) il3.Contributor = true;
    if(achievementR.Ascended) il3.Ascensions = achievementR.Ascended ? achievementR.Ascended.tier : 0;
    if(achievementR.Wolfmaster) il3.Wolfmaster = true;
    if(achievementR.Spiritualist) il3.Spiritualist = true;
    if(achievementR.Anniversary) il3.Anniversary = achievementR.Anniversary ? achievementR.Anniversary.tier : 0;

    return il3;
  }
}
