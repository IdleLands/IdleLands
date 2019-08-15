"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var Battle = /** @class */ (function (_super) {
    tslib_1.__extends(Battle, _super);
    function Battle() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Battle.prototype.operateOn = function (player) {
        var allPlayers = player.$party ? player.$party.members : [player.name];
        if (!player.$$game.combatHelper.canDoCombat(player)) {
            this.emitMessageToNames(allPlayers, 'Someone in your party is too injured to fight!', interfaces_1.AdventureLogEventType.Combat);
            return;
        }
        var combatInst = player.$$game.combatHelper.createAndRunMonsterCombat(player);
        var emitString = player.$$game.combatHelper.getCompressedCombat(combatInst);
        var displayPartyFormat = [];
        Object.values(combatInst.parties).forEach(function (_a) {
            var id = _a.id, name = _a.name;
            var partyObj = { name: name, players: [] };
            Object.values(combatInst.characters).forEach(function (member) {
                if (member.combatPartyId !== id)
                    return;
                partyObj.players.push(member.name);
            });
            displayPartyFormat.push(partyObj);
        });
        var eventText = this.eventText(interfaces_1.EventMessageType.Battle, player, { _eventData: { parties: displayPartyFormat } });
        var allText = "" + eventText;
        this.emitMessageToNames(allPlayers, allText, interfaces_1.AdventureLogEventType.Combat, { combatString: emitString });
    };
    Battle.WEIGHT = 9;
    return Battle;
}(Event_1.Event));
exports.Battle = Battle;
//# sourceMappingURL=Battle.js.map