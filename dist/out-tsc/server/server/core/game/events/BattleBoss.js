"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var BattleBoss = /** @class */ (function (_super) {
    tslib_1.__extends(BattleBoss, _super);
    function BattleBoss() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BattleBoss.prototype.operateOn = function (player, opts) {
        if (opts === void 0) { opts = { bossName: '', bossParty: '' }; }
        var allPlayers = player.$party ? player.$party.members : [player.name];
        if (!player.$$game.combatHelper.canDoCombat(player)) {
            this.emitMessageToNames(allPlayers, 'Someone in your party is too injured to fight!', interfaces_1.AdventureLogEventType.Combat);
            return;
        }
        var curTimer = player.cooldowns[opts.bossParty || opts.bossName];
        if (Date.now() < curTimer) {
            /*
            this.emitMessageToNames(allPlayers,
              `You could not encounter ${opts.bossParty || opts.bossName} because they were not available! Check back at %timestamp.`,
              AdventureLogEventType.Combat,
              { timestamp: curTimer });
            */
            return;
        }
        delete player.cooldowns[opts.bossParty || opts.bossName];
        var combatInst = player.$$game.combatHelper.createAndRunBossCombat(player, opts);
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
        var allText = (player.$party ? player.$party.name : player.fullName()) + "\n      geared up for an epic battle against " + (opts.bossName || opts.bossParty) + "!";
        this.emitMessageToNames(allPlayers, allText, interfaces_1.AdventureLogEventType.Combat, { combatString: emitString });
    };
    BattleBoss.WEIGHT = 0;
    return BattleBoss;
}(Event_1.Event));
exports.BattleBoss = BattleBoss;
//# sourceMappingURL=BattleBoss.js.map