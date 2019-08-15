"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Profession_1 = require("../professions/Profession");
var Ferocious = /** @class */ (function (_super) {
    tslib_1.__extends(Ferocious, _super);
    function Ferocious() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.oocAbilityName = 'Fight';
        _this.oocAbilityDesc = 'Fight some monsters!';
        _this.oocAbilityCost = 35;
        return _this;
    }
    Ferocious.prototype.oocAbility = function (player) {
        player.$$game.eventManager.doEventFor(player, interfaces_1.EventName.Battle);
        return "Your pet started a fight!";
    };
    return Ferocious;
}(Profession_1.BaseAttribute));
exports.Ferocious = Ferocious;
//# sourceMappingURL=Ferocious.js.map