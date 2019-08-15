"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var Party = /** @class */ (function (_super) {
    tslib_1.__extends(Party, _super);
    function Party() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Party.prototype.operateOn = function (player) {
        var _this = this;
        if (player.$personalities.isActive('Solo') || player.$personalities.isActive('Follower')) {
            this.emitMessage([player], 'You almost started looking for a party before you realized you did not want one!', interfaces_1.AdventureLogEventType.Party);
            return;
        }
        if (player.$party) {
            this.emitMessage([player], 'You almost started looking for a party before you realized you were in one!', interfaces_1.AdventureLogEventType.Party);
            return;
        }
        /* TODO: this does not work cross server.
                 to do so, fullname() needs to be stubbed or queried, and solo/camper need to be sent or queried
        */
        var checkPlayers = this.playerManager.allPlayers.filter(function (x) { return !x.$party
            && x !== player
            && !x.$personalities.isActive('Solo')
            && !x.$personalities.isActive('Camper')
            && !x.$personalities.isActive('Leader'); });
        if (checkPlayers.length < 3) {
            this.emitMessage([player], 'You almost found enough people for a group!', interfaces_1.AdventureLogEventType.Party);
            return;
        }
        var newParty = this.partyHelper.createParty();
        var chosenPlayers = this.rng.picksome(checkPlayers, 3);
        player.increaseStatistic("Event/Party/Create", 1);
        var allMembers = [player].concat(chosenPlayers);
        allMembers.forEach(function (joinPlayer) {
            _this.partyHelper.playerJoin(newParty, joinPlayer);
        });
        this.partyHelper.shareParty(newParty);
        var partyMemberString = chosenPlayers.map(function (p) { return "\u00AB" + p.fullName() + "\u00BB"; }).join(', ');
        var eventText = this.eventText(interfaces_1.EventMessageType.Party, player, { partyName: newParty.name, partyMembers: partyMemberString });
        this.emitMessage([player], eventText, interfaces_1.AdventureLogEventType.Party);
    };
    Party.WEIGHT = 9;
    return Party;
}(Event_1.Event));
exports.Party = Party;
//# sourceMappingURL=Party.js.map