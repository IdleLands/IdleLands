import { Event } from './Event';
import { Player, Choice } from '../../../../shared/models';
import { AdventureLogEventType, GuildBuilding } from '../../../../shared/interfaces';

export class Gamble extends Event {
  public static readonly WEIGHT = 15;

  public doChoice(eventManager: any, player: Player, choice: Choice, valueChosen: string): boolean {

    if(valueChosen === 'No') return true;

    let { odds, bet, payoff } = choice.extraData;
    const { ddOddsDivisor, ddBetMult, ddPayoffMult } = choice.extraData;

    if(valueChosen === 'Double') {
      odds /= (ddOddsDivisor || 2);
      payoff *= (ddPayoffMult || 2);
      bet *= (ddBetMult || 3);
    }

    if(player.gold < bet) {
      eventManager.errorMessage(player, 'You do not have enough gold to do that.');
      return false;
    }

    player.spendGold(bet);
    player.increaseStatistic(`Event/Gamble/Wager`, bet);

    if(this.rng.likelihood(odds)) {
      eventManager.successMessage(player, `You won ${payoff.toLocaleString()} gold against the odds of ${odds.toFixed(2)}%!`);
      player.gainGold(payoff);
      player.increaseStatistic(`Event/Gamble/WinTimes`, 1);
      player.increaseStatistic(`Event/Gamble/Win`, payoff);

      if(valueChosen === 'Double') {
        player.increaseStatistic(`Event/Gamble/WinDoubleTimes`, 1);
        player.increaseStatistic(`Event/Gamble/WinDouble`, payoff);
      }

      const allText = `${player.fullName()} bet ${bet.toLocaleString()} gold at the gambling table against the odds
        of ${odds}%${valueChosen === 'Double' ? ' (Double Down)' : ''} and won ${payoff.toLocaleString()} gold!`;
      this.emitMessage([player], allText, AdventureLogEventType.Gold);

    } else {
      eventManager.errorMessage(player,
        `You lost ${bet.toLocaleString()} gold against the odds of ${odds}%! Better luck next time.`);
      player.increaseStatistic(`Event/Gamble/LoseTimes`, 1);

      if(valueChosen === 'Double') {
        player.increaseStatistic(`Event/Gamble/LoseDoubleTimes`, 1);
      }

      const allText = `${player.fullName()} bet ${bet.toLocaleString()} gold at the gambling table against the odds
        of ${odds}%${valueChosen === 'Double' ? ' (Double Down)' : ''} and lost it all.`;
      this.emitMessage([player], allText, AdventureLogEventType.Gold);
    }

    return true;
  }

  public operateOn(player: Player) {

    let baseCostMult = 0.05;
    let ddOddsDivisor = 2;
    let ddPayoffMult = 3;
    let ddBetMult = 2;

    const guild = this.guildManager.getGuildForPlayer(player);
    if(guild) {
      const bonus = guild.activeBuildingBonus(GuildBuilding.Tavern);
      baseCostMult += (bonus / 1000);
      ddOddsDivisor = Math.max(4 / 3, ddOddsDivisor - (bonus / 100));
      ddPayoffMult += (bonus / 100);
      ddBetMult += (bonus / 100);
    }

    const baseCostFivePercent = Math.floor(player.gold * baseCostMult);

    const odds = this.rng.numberInRange(10, 50);
    const bet = this.rng.numberInRange(baseCostFivePercent, baseCostFivePercent * 5);

    // scale the cost based on how unlikely you are to win, adding up to 90% more money with a base of +0% for safest bet
    let oddsMod = ((100 - odds) / 100);
    oddsMod += (10 - (odds / 5)) / 10;

    const payoff = Math.floor(bet + (bet * oddsMod));

    const message = this.rng.pickone([
      'Feelin\' lucky, punk?',
      'Wanna gamble, kiddo?',
      'You wanna put up a friendly wager?',
      'You all in on black or red?'
    ]);

    const choice = this.getChoice({
      desc: `
        ${message} The odds are ${odds}% if you wager ${bet.toLocaleString()} gold, and the payoff is ${payoff.toLocaleString()} gold.
        You can Double Down for a ${(100 * (1 - ddOddsDivisor).toFixed(2)}% odds reduction, but a ${ddPayoffMult.toFixed(2)}x payoff.
      `,
      choices: ['Yes', 'No', 'Double'],
      defaultChoice: player.getDefaultChoice(['Yes', 'No', 'Double']),
      extraData: {
        odds,
        bet,
        payoff,
        ddOddsDivisor,
        ddBetMult,
        ddPayoffMult
      }
    });

    player.$choices.addChoice(player, choice);
  }
}
