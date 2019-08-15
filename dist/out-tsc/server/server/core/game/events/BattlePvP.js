"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var BattlePvP = /** @class */ (function (_super) {
    tslib_1.__extends(BattlePvP, _super);
    function BattlePvP() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BattlePvP.prototype.operateOn = function (player) {
        var checkPlayers = this.playerManager.allPlayers.filter(function (x) { return (player.$party ? x.$party : !x.$party)
            && (player.$party ? x.$party.name !== player.$party.name : true)
            && x !== player; });
        if (checkPlayers.length < 1) {
            this.emitMessage([player], 'You almost found a sparring partner!', interfaces_1.AdventureLogEventType.Party);
            return;
        }
        var chosenTarget = checkPlayers[0];
        var allPlayers = [];
        allPlayers.push.apply(allPlayers, (player.$party ? player.$party.members : [player.name]));
        allPlayers.push.apply(allPlayers, (chosenTarget.$party ? chosenTarget.$party.members : [chosenTarget.name]));
        if (!player.$$game.combatHelper.canDoCombat(player) || !player.$$game.combatHelper.canDoCombat(chosenTarget)) {
            this.emitMessageToNames(allPlayers, 'Someone is too injured to fight!', interfaces_1.AdventureLogEventType.Combat);
            return;
        }
        var combatInst = player.$$game.combatHelper.createAndRunPvPCombat(player, chosenTarget);
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
    BattlePvP.WEIGHT = 9;
    return BattlePvP;
}(Event_1.Event));
exports.BattlePvP = BattlePvP;
//# sourceMappingURL=BattlePvP.js.map