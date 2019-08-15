"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("../professions/Profession");
var Blessed = /** @class */ (function (_super) {
    tslib_1.__extends(Blessed, _super);
    function Blessed() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.oocAbilityName = 'Bless';
        _this.oocAbilityDesc = 'Activate a random Bless event.';
        _this.oocAbilityCost = 15;
        return _this;
    }
    Blessed.prototype.oocAbility = function (player) {
        var event = player.$$game.rngService.weighted(['BlessItem', 'BlessGold', 'BlessXP', 'Enchant'], [100, 300, 100, 5]);
        player.$$game.eventManager.doEventFor(player, event);
        return "You've been #blessed!";
    };
    return Blessed;
}(Profession_1.BaseAttribute));
exports.Blessed = Blessed;
//# sourceMappingURL=Blessed.js.map