import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, AllStatsButSpecial, EventMessageType } from '../../../../shared/interfaces';

export class Witch extends Event {
  public static readonly WEIGHT = 3;

  private pickBuffType() {
    return this.rng.pickone([
      { name: 'Steps', stat: 'Character/Ticks', duration: 180 },
      { name: 'Steps', stat: 'Character/Ticks', duration: 360 },
      { name: 'Steps', stat: 'Character/Ticks', duration: 720 },
      { name: 'Steps', stat: 'Character/Ticks', duration: 1440 },

      { name: 'Events', stat: 'Character/Events', duration: 5 },
      { name: 'Events', stat: 'Character/Events', duration: 10 },
      { name: 'Events', stat: 'Character/Events', duration: 15 },
      { name: 'Events', stat: 'Character/Events', duration: 30 },

      { name: 'Combats', stat: 'Combat/All/Times/Total', duration: 3 },
      { name: 'Combats', stat: 'Combat/All/Times/Total', duration: 5 },
      { name: 'Combats', stat: 'Combat/All/Times/Total', duration: 7 },
      { name: 'Combats', stat: 'Combat/All/Times/Total', duration: 10 }
    ]);
  }

  private pickBuffStats(player: Player) {
    const stat = this.rng.pickone(AllStatsButSpecial);
    const statModPercent = this.rng.pickone([-20, -10, -5, -1, 1, 5, 10, 20, 25]);
    const statMod = Math.floor(player.getStat(stat) * (1 / statModPercent));

    return { stat, statModPercent, statMod };
  }

  public operateOn(player: Player) {

    if(player.injuryCount() >= player.$statistics.get('Game/Premium/Upgrade/InjuryThreshold')) {
      this.emitMessage([player],
        'You met with a witch who graciously offered to cure one of your injuries!',
        AdventureLogEventType.Witch);
      player.cureInjury();
      return;
    }

    const buffType = this.pickBuffType();
    const buff = this.pickBuffStats(player);

    if(buff.statMod === 0) {
      this.emitMessage([player],
        'You almost had a fatal encounter with a Witch! Luckily, it wanted to give you something that didn\'t exist.',
        AdventureLogEventType.Witch);
      return;
    }

    const buffName = this.assetManager.witch();
    const eventText = this.eventText(EventMessageType.Witch, player, { buff: buffName });
    const endText = `[${buff.statMod > 0 ? '+' : ''}${buff.statMod} ${buff.stat.toUpperCase()} for ${buffType.duration} ${buffType.name}]`;
    const allText = `${eventText} ${endText}`;

    player.addBuff({
      name: buffName,
      statistic: buffType.stat,
      booster: buff.statModPercent > 0,
      duration: buffType.duration,
      stats: {
        [buff.stat]: buff.statMod
      }
    });

    this.emitMessage([player], allText, AdventureLogEventType.Witch);
  }
}
