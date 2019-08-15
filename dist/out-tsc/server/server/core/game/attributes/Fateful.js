"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("../professions/Profession");
var Fateful = /** @class */ (function (_super) {
    tslib_1.__extends(Fateful, _super);
    function Fateful() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.oocAbilityName = 'Fatewater Bath';
        _this.oocAbilityDesc = 'Take a quick bath in a puddle of Fate Water.';
        _this.oocAbilityCost = 25;
        return _this;
    }
    Fateful.prototype.oocAbility = function (player) {
        player.$$game.eventManager.doEventFor(player, 'Providence');
        return "You've bathed in your fate!";
    };
    return Fateful;
}(Profession_1.BaseAttribute));
exports.Fateful = Fateful;
//# sourceMappingURL=Fateful.js.map