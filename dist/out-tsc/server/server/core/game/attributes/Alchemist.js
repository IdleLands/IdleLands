"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("../professions/Profession");
var Alchemist = /** @class */ (function (_super) {
    tslib_1.__extends(Alchemist, _super);
    function Alchemist() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.oocAbilityName = 'Alchemize';
        _this.oocAbilityDesc = 'Sometimes converts pet XP to GOLD and vice-versa.';
        _this.oocAbilityCost = 25;
        return _this;
    }
    Alchemist.prototype.oocAbility = function (player) {
        var shouldTakeXP = player.$$game.rngService.likelihood(50);
        if (shouldTakeXP) {
            var maxXPTaken = player.$pets.$activePet.gold.maximum;
            var xpTaken = Math.min(maxXPTaken, player.$pets.$activePet.xp.total);
            if (xpTaken === 0)
                return 'The experiment was a failure; there is no experience to be taken.';
            player.$pets.$activePet.gainXP(-xpTaken, false);
            player.$pets.$activePet.gainGold(xpTaken, false);
            return "Your pet has gained " + xpTaken.toLocaleString() + " gold!";
        }
        var goldTaken = player.$pets.$activePet.gold.total;
        player.$pets.$activePet.gainXP(goldTaken, false);
        player.$pets.$activePet.gainGold(-goldTaken, false);
        if (goldTaken === 0)
            return 'The experiment was a failure; there is no gold to be taken.';
        return "Your pet has gained " + goldTaken.toLocaleString() + " exp!";
    };
    return Alchemist;
}(Profession_1.BaseAttribute));
exports.Alchemist = Alchemist;
//# sourceMappingURL=Alchemist.js.map