"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Profession_1 = require("../professions/Profession");
var Golden = /** @class */ (function (_super) {
    tslib_1.__extends(Golden, _super);
    function Golden() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.oocAbilityName = 'Turn All To Gold';
        _this.oocAbilityDesc = 'Attract a gold-related event.';
        _this.oocAbilityCost = 25;
        return _this;
    }
    Golden.prototype.oocAbility = function (player) {
        var event = player.$$game.rngService.weighted(['BlessGold', 'Merchant', 'Gamble', 'ForsakeGold'], [50, 150, 100, 10]);
        player.$$game.eventManager.doEventFor(player, event);
        return "You've attracted some gold!";
    };
    return Golden;
}(Profession_1.BaseAttribute));
exports.Golden = Golden;
//# sourceMappingURL=Golden.js.map