"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var Witch = /** @class */ (function (_super) {
    tslib_1.__extends(Witch, _super);
    function Witch() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Witch.prototype.pickBuffType = function () {
        return this.rng.pickone([
            { name: 'Steps', stat: 'Character/Ticks', duration: 180 },
            { name: 'Steps', stat: 'Character/Ticks', duration: 360 },
            { name: 'Steps', stat: 'Character/Ticks', duration: 720 },
            { name: 'Steps', stat: 'Character/Ticks', duration: 1440 },
            { name: 'Events', stat: 'Character/Events', duration: 5 },
            { name: 'Events', stat: 'Character/Events', duration: 10 },
            { name: 'Events', stat: 'Character/Events', duration: 15 },
            { name: 'Events', stat: 'Character/Events', duration: 30 },
            { name: 'Combats', stat: 'Combat/All/Times/Total', duration: 3 },
            { name: 'Combats', stat: 'Combat/All/Times/Total', duration: 5 },
            { name: 'Combats', stat: 'Combat/All/Times/Total', duration: 7 },
            { name: 'Combats', stat: 'Combat/All/Times/Total', duration: 10 }
        ]);
    };
    Witch.prototype.pickBuffStats = function (player) {
        var stat = this.rng.pickone(interfaces_1.AllStatsButSpecial);
        var statModPercent = this.rng.pickone([-20, -10, -5, -1, 1, 5, 10, 20, 25]);
        var statMod = Math.floor(player.getStat(stat) * (1 / statModPercent));
        return { stat: stat, statModPercent: statModPercent, statMod: statMod };
    };
    Witch.prototype.operateOn = function (player) {
        var _a;
        if (player.injuryCount() >= player.$statistics.get('Game/Premium/Upgrade/InjuryThreshold')) {
            this.emitMessage([player], 'You met with a witch who graciously offered to cure one of your injuries!', interfaces_1.AdventureLogEventType.Witch);
            player.cureInjury();
            return;
        }
        var buffType = this.pickBuffType();
        var buff = this.pickBuffStats(player);
        if (buff.statMod === 0) {
            this.emitMessage([player], 'You almost had a fatal encounter with a Witch! Luckily, it wanted to give you something that didn\'t exist.', interfaces_1.AdventureLogEventType.Witch);
            return;
        }
        var buffName = this.assetManager.witch();
        var eventText = this.eventText(interfaces_1.EventMessageType.Witch, player, { buff: buffName });
        var endText = "[" + (buff.statMod > 0 ? '+' : '') + buff.statMod + " " + buff.stat.toUpperCase() + " for " + buffType.duration + " " + buffType.name + "]";
        var allText = eventText + " " + endText;
        player.addBuff({
            name: buffName,
            statistic: buffType.stat,
            booster: buff.statModPercent > 0,
            duration: buffType.duration,
            stats: (_a = {},
                _a[buff.stat] = buff.statMod,
                _a)
        });
        this.emitMessage([player], allText, interfaces_1.AdventureLogEventType.Witch);
    };
    Witch.WEIGHT = 3;
    return Witch;
}(Event_1.Event));
exports.Witch = Witch;
//# sourceMappingURL=Witch.js.map