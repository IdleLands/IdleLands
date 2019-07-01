
import { Event, EventMessageType } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, ItemClass, ItemSlot } from '../../../../shared/interfaces';
import { Item } from '../../../../shared/models';

export class Providence extends Event {
  public static readonly WEIGHT = 0;

  private readonly PROBABILITIES = {
    xp: 10,
    level: 5,
    gender: 80,
    gold: 50,
    profession: 10,
    clearProvidence: 20,
    newProvidence: 80,
    personality: 50,
    title: 75,
    ilp: 1
  };

  private createProvidenceItem(multiplier = 1, t1shift = 0, t2shift = 0, t3shift = 0): Item {
    const baseItem: any = {
      type: ItemSlot.Providence,
      itemClass: ItemClass.Newbie,
      name: this.assetManager.providence(),
      stats: {}
    };

    this.statTiers.t1.forEach(stat => {
      if(this.rng.likelihood(20)) return;
      baseItem.stats[stat] = this.rng.numberInRange(
        Math.min(-15, (-150 + t2shift) * multiplier),
        (150 + t1shift) * multiplier
      );
    });

    this.statTiers.t2.forEach(stat => {
      if(this.rng.likelihood(30)) return;
      baseItem.stats[stat] = this.rng.numberInRange(
        Math.min(-10, (-100 + t2shift) * multiplier),
        (100 + t2shift) * multiplier
      );
    });

    this.statTiers.t3.forEach(stat => {
      if(this.rng.likelihood(50)) return;
      baseItem.stats[stat] = this.rng.numberInRange(
        Math.min(-10, (-75 + t3shift) * multiplier),
        (75 + t3shift) * multiplier
      );
    });

    const item = new Item();
    item.init(baseItem);

    return item;
  }

  private handleProvidenceData(player: Player, providenceData): string {
    let message = '';

    const { xp, level, gender, profession, gold } = providenceData;

    if(xp && this.rng.likelihood(this.PROBABILITIES.xp)) {
      const curPlayerXp = player.xp.total;
      const lostXp = curPlayerXp - xp;

      player.xp.add(xp);
      message = `${message} ${xp > 0 ? 'Gained' : 'Lost'} ${Math.abs(xp).toLocaleString()} xp!`;

      if(xp < 0 && player.xp.atMinimum()) {
        message = `${message} Lost 1 level!`;
        player.level.sub(1);
        player.resetMaxXP();
        player.xp.set(player.xp.maximum + lostXp);
      }

    } else if(level && this.rng.likelihood(this.PROBABILITIES.level)) {
      player.level.add(level);
      player.resetMaxXP();
      message = `${message} ${level > 0 ? 'Gained' : 'Lost'} ${Math.abs(level)} levels!`;
    }

    if(player.gender !== gender && this.rng.likelihood(this.PROBABILITIES.gender)) {
      player.changeGender(gender);
      message = `${message} Gender is now ${gender}!`;
    }

    if(gold && this.rng.likelihood(this.PROBABILITIES.gold)) {
      player.gold += gold;
      message = `${message} ${gold > 0 ? 'Gained' : 'Lost'} ${Math.abs(gold).toLocaleString()} gold!`;
    }

    if(profession !== player.profession && this.rng.likelihood(this.PROBABILITIES.profession)) {
      player.changeProfessionWithRef(profession);
      message = `${message} Profession is now ${profession}!`;
    }

    if(this.rng.likelihood(this.PROBABILITIES.personality)) {
      player.$personalities.allEarnedPersonalities().forEach(name => {
        if(name === 'Camping' || this.rng.likelihood(50)) return;
        player.togglePersonality(name);
      });
      message = `${message} Personality shift!`;
    }

    if(this.rng.likelihood(this.PROBABILITIES.title)) {
      player.changeTitle(this.rng.pickone(player.$achievements.getTitles()));
      message = `${message} Title change!`;
    }

    if(this.rng.likelihood(this.PROBABILITIES.ilp)) {
      player.gainILP(5);
      message = `${message} Got ILP!`;
    }

    return message;
  }

  private basicProvidence(player: Player, baseMessage: string, providenceData): string {
    const providence = player.$inventory.itemInEquipmentSlot(ItemSlot.Providence);

    baseMessage = `${baseMessage} ${this.handleProvidenceData(player, providenceData).trim()}`;

    if(providence && this.rng.likelihood(this.PROBABILITIES.clearProvidence)) {
      player.forceUnequip(providence);

      baseMessage = `${baseMessage} Providence cleared!`;

    } else if(!providence && this.rng.likelihood(this.PROBABILITIES.newProvidence)) {
      const newProvidence = this.createProvidenceItem(Math.round(player.level.total / 10));
      player.equip(newProvidence);

      baseMessage = `${baseMessage} Gained Divine Providence!`;
    }

    player.recalculateStats();

    return baseMessage;
  }

  public operateOn(player: Player) {
    const canGainXp = player.level.total < player.level.maximum - 100;

    const providenceData = {
      xp: this.rng.numberInRange(-player.xp.maximum, canGainXp ? player.xp.maximum : 0),
      level: this.rng.numberInRange(-3, canGainXp ? 2 : 0),
      gender: this.rng.pickone(player.availableGenders),
      profession: this.rng.pickone(player.$statistics.getChildren('Profession')) || 'Generalist',
      gold: this.rng.numberInRange(-Math.min(300 * player.level.total, player.gold), 200 * player.level.total)
    };

    const baseMessage = this.eventText(EventMessageType.Providence, player, {});
    const finalMessage = this.basicProvidence(player, baseMessage, providenceData);

    this.emitMessage([player], finalMessage, AdventureLogEventType.Meta);
  }
}
