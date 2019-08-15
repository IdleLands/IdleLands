"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var models_1 = require("../../../../shared/models");
var Providence = /** @class */ (function (_super) {
    tslib_1.__extends(Providence, _super);
    function Providence() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.PROBABILITIES = {
            xp: 10,
            level: 5,
            gender: 80,
            gold: 50,
            profession: 10,
            clearProvidence: 20,
            newProvidence: 80,
            personality: 50,
            title: 75,
            ilp: 1
        };
        return _this;
    }
    Providence.prototype.createProvidenceItem = function (multiplier, t1shift, t2shift, t3shift) {
        var _this = this;
        if (multiplier === void 0) { multiplier = 1; }
        if (t1shift === void 0) { t1shift = 0; }
        if (t2shift === void 0) { t2shift = 0; }
        if (t3shift === void 0) { t3shift = 0; }
        var baseItem = {
            type: interfaces_1.ItemSlot.Providence,
            itemClass: interfaces_1.ItemClass.Newbie,
            name: this.assetManager.providence(),
            stats: {}
        };
        this.statTiers.t1.forEach(function (stat) {
            if (_this.rng.likelihood(20))
                return;
            baseItem.stats[stat] = _this.rng.numberInRange(Math.min(-15, (-150 + t2shift) * multiplier), (150 + t1shift) * multiplier);
        });
        this.statTiers.t2.forEach(function (stat) {
            if (_this.rng.likelihood(30))
                return;
            baseItem.stats[stat] = _this.rng.numberInRange(Math.min(-10, (-100 + t2shift) * multiplier), (100 + t2shift) * multiplier);
        });
        this.statTiers.t3.forEach(function (stat) {
            if (_this.rng.likelihood(50))
                return;
            baseItem.stats[stat] = _this.rng.numberInRange(Math.min(-10, (-75 + t3shift) * multiplier), (75 + t3shift) * multiplier);
        });
        var item = new models_1.Item();
        item.init(baseItem);
        return item;
    };
    Providence.prototype.handleProvidenceData = function (player, providenceData) {
        var _this = this;
        var message = '';
        var xp = providenceData.xp, level = providenceData.level, gender = providenceData.gender, profession = providenceData.profession, gold = providenceData.gold;
        if (xp && this.rng.likelihood(this.PROBABILITIES.xp)) {
            var curPlayerXp = player.xp.total;
            var lostXp = curPlayerXp - xp;
            player.xp.add(xp);
            message = message + " " + (xp > 0 ? 'Gained' : 'Lost') + " " + Math.abs(xp).toLocaleString() + " xp!";
            if (xp < 0 && player.xp.atMinimum()) {
                message = message + " Lost 1 level!";
                player.level.sub(1);
                player.resetMaxXP();
                player.xp.set(player.xp.maximum + lostXp);
            }
        }
        else if (level && this.rng.likelihood(this.PROBABILITIES.level)) {
            player.level.add(level);
            player.resetMaxXP();
            message = message + " " + (level > 0 ? 'Gained' : 'Lost') + " " + Math.abs(level) + " levels!";
        }
        if (player.gender !== gender && this.rng.likelihood(this.PROBABILITIES.gender)) {
            player.changeGender(gender);
            message = message + " Gender is now " + gender + "!";
        }
        if (gold && this.rng.likelihood(this.PROBABILITIES.gold)) {
            player.gold += gold;
            message = message + " " + (gold > 0 ? 'Gained' : 'Lost') + " " + Math.abs(gold).toLocaleString() + " gold!";
        }
        if (profession !== player.profession && this.rng.likelihood(this.PROBABILITIES.profession)) {
            player.changeProfessionWithRef(profession);
            message = message + " Profession is now " + profession + "!";
        }
        if (this.rng.likelihood(this.PROBABILITIES.personality)) {
            player.$personalities.allEarnedPersonalities().forEach(function (name) {
                if (name === 'Camping' || _this.rng.likelihood(50))
                    return;
                player.togglePersonality(name);
            });
            message = message + " Personality shift!";
        }
        if (this.rng.likelihood(this.PROBABILITIES.title)) {
            player.changeTitle(this.rng.pickone(player.$achievements.getTitles()));
            message = message + " Title change!";
        }
        if (this.rng.likelihood(this.PROBABILITIES.ilp)) {
            player.gainILP(5);
            message = message + " Got ILP!";
        }
        return message;
    };
    Providence.prototype.basicProvidence = function (player, baseMessage, providenceData) {
        var providence = player.$inventory.itemInEquipmentSlot(interfaces_1.ItemSlot.Providence);
        baseMessage = baseMessage + " " + this.handleProvidenceData(player, providenceData).trim();
        if (providence && this.rng.likelihood(this.PROBABILITIES.clearProvidence)) {
            player.forceUnequip(providence);
            baseMessage = baseMessage + " Providence cleared!";
        }
        else if (!providence && this.rng.likelihood(this.PROBABILITIES.newProvidence)) {
            var newProvidence = this.createProvidenceItem(Math.round(player.level.total / 10));
            player.equip(newProvidence);
            baseMessage = baseMessage + " Gained Divine Providence!";
        }
        player.recalculateStats();
        return baseMessage;
    };
    Providence.prototype.operateOn = function (player) {
        var canGainXp = player.level.total < player.level.maximum - 100;
        var providenceData = {
            xp: this.rng.numberInRange(-player.xp.maximum, canGainXp ? player.xp.maximum : 0),
            level: this.rng.numberInRange(-3, canGainXp ? 2 : 0),
            gender: this.rng.pickone(player.availableGenders),
            profession: this.rng.pickone(player.$statistics.getChildren('Profession')) || 'Generalist',
            gold: this.rng.numberInRange(-Math.min(300 * player.level.total, player.gold), 200 * player.level.total)
        };
        var baseMessage = this.eventText(interfaces_1.EventMessageType.Providence, player, {});
        var finalMessage = this.basicProvidence(player, baseMessage, providenceData);
        this.emitMessage([player], finalMessage, interfaces_1.AdventureLogEventType.Meta);
    };
    Providence.WEIGHT = 0;
    return Providence;
}(Event_1.Event));
exports.Providence = Providence;
//# sourceMappingURL=Providence.js.map