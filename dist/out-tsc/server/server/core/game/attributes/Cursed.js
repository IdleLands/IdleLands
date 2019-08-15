"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("../professions/Profession");
var Cursed = /** @class */ (function (_super) {
    tslib_1.__extends(Cursed, _super);
    function Cursed() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.oocAbilityName = 'Curse';
        _this.oocAbilityDesc = 'Activate a random Forsake event.';
        _this.oocAbilityCost = 5;
        return _this;
    }
    Cursed.prototype.oocAbility = function (player) {
        var event = player.$$game.rngService.weighted(['ForsakeItem', 'ForsakeGold', 'ForsakeXP', 'Switcheroo'], [50, 50, 50, 5]);
        player.$$game.eventManager.doEventFor(player, event);
        return "You've been #cursed!";
    };
    return Cursed;
}(Profession_1.BaseAttribute));
exports.Cursed = Cursed;
//# sourceMappingURL=Cursed.js.map