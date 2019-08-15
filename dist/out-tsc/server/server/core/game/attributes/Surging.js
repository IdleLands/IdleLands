"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("../professions/Profession");
var Surging = /** @class */ (function (_super) {
    tslib_1.__extends(Surging, _super);
    function Surging() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.oocAbilityName = 'Experience Surge';
        _this.oocAbilityDesc = 'Your pet gains 5% of its max experience.';
        _this.oocAbilityCost = 25;
        return _this;
    }
    Surging.prototype.oocAbility = function (player) {
        var xpNeeded = Math.floor(player.$pets.$activePet.xp.maximum / 20);
        var xpGain = player.$pets.$activePet.gainXP(xpNeeded);
        return "Your pet has gained " + xpGain.toLocaleString() + " exp!";
    };
    return Surging;
}(Profession_1.BaseAttribute));
exports.Surging = Surging;
//# sourceMappingURL=Surging.js.map