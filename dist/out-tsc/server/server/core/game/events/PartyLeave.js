"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var PartyLeave = /** @class */ (function (_super) {
    tslib_1.__extends(PartyLeave, _super);
    function PartyLeave() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PartyLeave.prototype.doChoice = function (eventManager, player, choice, valueChosen) {
        if (valueChosen === 'No')
            return true;
        player.$$game.partyHelper.playerLeave(player);
        return true;
    };
    PartyLeave.prototype.operateOn = function (player) {
        // force the id to be PartyLeave so we can easily find it later, since only one can exist.
        var existingChoice = player.$choices.getChoice('PartyLeave');
        if (existingChoice)
            return;
        var choice = this.getChoice({
            id: 'PartyLeave',
            desc: "\n        Would you like to leave your party?\n      ",
            choices: ['Yes', 'No'],
            defaultChoice: player.getDefaultChoice(['Yes', 'No'])
        });
        player.$choices.addChoice(player, choice);
    };
    // this is set to 15 if you have a party, but it is default 0 so it doesn't dilute the event pool
    PartyLeave.WEIGHT = 0;
    return PartyLeave;
}(Event_1.Event));
exports.PartyLeave = PartyLeave;
//# sourceMappingURL=PartyLeave.js.map