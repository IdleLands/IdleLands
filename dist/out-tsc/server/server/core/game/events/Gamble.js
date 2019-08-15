"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var Gamble = /** @class */ (function (_super) {
    tslib_1.__extends(Gamble, _super);
    function Gamble() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Gamble.prototype.doChoice = function (eventManager, player, choice, valueChosen) {
        if (valueChosen === 'No')
            return true;
        var _a = choice.extraData, odds = _a.odds, bet = _a.bet, payoff = _a.payoff;
        if (valueChosen === 'Double') {
            odds /= 2;
            payoff *= 3;
            bet = bet * 2;
        }
        if (player.gold < bet) {
            eventManager.errorMessage(player, 'You do not have enough gold to do that.');
            return false;
        }
        player.gainGold(-bet);
        player.increaseStatistic("Event/Gamble/Wager", bet);
        if (this.rng.likelihood(odds)) {
            eventManager.successMessage(player, "You won " + payoff.toLocaleString() + " gold against the odds of " + odds + "%!");
            player.gainGold(payoff);
            player.increaseStatistic("Event/Gamble/WinTimes", 1);
            player.increaseStatistic("Event/Gamble/Win", payoff);
            if (valueChosen === 'Double') {
                player.increaseStatistic("Event/Gamble/WinDoubleTimes", 1);
                player.increaseStatistic("Event/Gamble/WinDouble", payoff);
            }
            var allText = player.fullName() + " bet " + bet.toLocaleString() + " gold at the gambling table against the odds\n        of " + odds + "%" + (valueChosen === 'Double' ? ' (Double Down)' : '') + " and won " + payoff.toLocaleString() + " gold!";
            this.emitMessage([player], allText, interfaces_1.AdventureLogEventType.Gold);
        }
        else {
            eventManager.successMessage(player, "You lost " + bet.toLocaleString() + " gold against the odds of " + odds + "%! Better luck next time.");
            player.increaseStatistic("Event/Gamble/LoseTimes", 1);
            if (valueChosen === 'Double') {
                player.increaseStatistic("Event/Gamble/LoseDoubleTimes", 1);
            }
            var allText = player.fullName() + " bet " + bet.toLocaleString() + " gold at the gambling table against the odds\n        of " + odds + "%" + (valueChosen === 'Double' ? ' (Double Down)' : '') + " and lost it all.";
            this.emitMessage([player], allText, interfaces_1.AdventureLogEventType.Gold);
        }
        return true;
    };
    Gamble.prototype.operateOn = function (player) {
        var baseCostFivePercent = Math.floor(player.gold * 0.05);
        var odds = this.rng.numberInRange(10, 50);
        var bet = this.rng.numberInRange(baseCostFivePercent, baseCostFivePercent * 5);
        // scale the cost based on how unlikely you are to win, adding up to 90% more money with a base of +0% for safest bet
        var oddsMod = ((100 - odds) / 100);
        oddsMod += (10 - (odds / 5)) / 10;
        var payoff = Math.floor(bet + (bet * oddsMod));
        var message = this.rng.pickone([
            'Feelin\' lucky, punk?',
            'Wanna gamble, kiddo?',
            'You wanna put up a friendly wager?',
            'You all in on black or red?'
        ]);
        var choice = this.getChoice({
            desc: "\n        " + message + " The odds are " + odds + "% if you wager " + bet.toLocaleString() + " gold, and the payoff is " + payoff.toLocaleString() + " gold.\n        You can Double Down for a 50% odds reduction, but a 3x payoff.\n      ",
            choices: ['Yes', 'No', 'Double'],
            defaultChoice: player.getDefaultChoice(['Yes', 'No', 'Double']),
            extraData: {
                odds: odds,
                bet: bet,
                payoff: payoff
            }
        });
        player.$choices.addChoice(player, choice);
    };
    Gamble.WEIGHT = 15;
    return Gamble;
}(Event_1.Event));
exports.Gamble = Gamble;
//# sourceMappingURL=Gamble.js.map