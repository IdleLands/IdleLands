import { Event } from './Event';
import { Player, Choice, Item } from '../../../../shared/models';

export class Gamble extends Event {
  public static readonly WEIGHT = 15;

  public static doChoice(player: Player, choice: Choice, valueChosen: string, { error, success, event, rng }): boolean {

    if(valueChosen === 'No') return true;

    let { odds, bet, payoff } = choice.extraData;
    if(valueChosen === 'Double') {
      odds /= 2;
      payoff *= 3;
      bet = bet;
    }

    if(player.gold < bet) {
      error(player, 'You do not have enough gold to do that.');
      return false;
    }

    player.gainGold(-bet);
    player.$statistics.increase(`Event.Gamble.Wager`, bet);

    if(rng.likelihood(odds)) {
      success(player, `You won ${payoff.toLocaleString()} gold against the odds of ${odds}%!`);
      player.gainGold(payoff);
      player.$statistics.increase(`Event.Gamble.WinTimes`, 1);
      player.$statistics.increase(`Event.Gamble.Win`, payoff);

      if(valueChosen === 'Double') {
        player.$statistics.increase(`Event.Gamble.WinDoubleTimes`, 1);
        player.$statistics.increase(`Event.Gamble.WinDouble`, payoff);
      }

    } else {
      success(player, `You lost ${bet.toLocaleString()} gold against the odds of ${odds}%! Better luck next time.`);
      player.$statistics.increase(`Event.Gamble.LoseTimes`, 1);

      if(valueChosen === 'Double') {
        player.$statistics.increase(`Event.Gamble.LoseDoubleTimes`, 1);
      }
    }

    return true;
  }

  public operateOn(player: Player) {

    const baseCostFivePercent = Math.floor(player.gold * 0.05);

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
        You can Double Down for a 50% odds reduction, but a 3x payoff.
      `,
      choices: ['Yes', 'No', 'Double'],
      defaultChoice: 'Yes',
      extraData: {
        odds,
        bet,
        payoff
      }
    });

    player.$choices.addChoice(player, choice);
  }
}
