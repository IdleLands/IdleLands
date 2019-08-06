import { Event } from './Event';
import { Player } from '../../../../shared/models/entity';
import { AdventureLogEventType, ICombat } from '../../../../shared/interfaces';

export class BattleBoss extends Event {
  public static readonly WEIGHT = 0;

  public operateOn(player: Player, opts: any = { bossName: '', bossParty: '' }) {

    const allPlayers = player.$party ? player.$party.members : [player.name];

    if(!player.$$game.combatHelper.canDoCombat(player)) {
      this.emitMessageToNames(allPlayers,
        'Someone in your party is too injured to fight!',
        AdventureLogEventType.Combat);
      return;
    }

    const curTimer = player.bossTimers[opts.bossParty || opts.bossName];
    if(Date.now() < curTimer) {
      this.emitMessageToNames(allPlayers,
        `You could not encounter ${opts.bossParty || opts.bossName} because they were not alive! Check back at ${new Date(curTimer)}.`,
        AdventureLogEventType.Combat);
      return;
    }

    delete player.bossTimers[opts.bossParty || opts.bossName];

    const combatInst: ICombat = player.$$game.combatHelper.createAndRunBossCombat(player, opts);

    const emitString = player.$$game.combatHelper.getCompressedCombat(combatInst);

    const displayPartyFormat = [];
    Object.values(combatInst.parties).forEach(({ id, name }) => {
      const partyObj = { name, players: [] };
      Object.values(combatInst.characters).forEach(member => {
        if(member.combatPartyId !== id) return;
        partyObj.players.push(member.name);
      });

      displayPartyFormat.push(partyObj);
    });

    const allText = `${player.$party ? player.$party.name : player.fullName()}
      geared up for an epic battle against ${opts.bossName || opts.bossParty}!`;

    this.emitMessageToNames(allPlayers, allText, AdventureLogEventType.Combat, { combatString: emitString });
  }
}
