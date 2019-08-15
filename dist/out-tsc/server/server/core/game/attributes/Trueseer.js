"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var Profession_1 = require("../professions/Profession");
var Trueseer = /** @class */ (function (_super) {
    tslib_1.__extends(Trueseer, _super);
    function Trueseer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.oocAbilityName = 'Teleseer';
        _this.oocAbilityDesc = 'Teleport to a random town on the Norkos Continent.';
        _this.oocAbilityCost = 10;
        return _this;
    }
    Trueseer.prototype.oocAbility = function (player) {
        var possibleTowns = ['Norkos', 'Maeles', 'Vocalnus', 'Raburro', 'Homlet', 'Frigri'];
        var town = lodash_1.sample(possibleTowns);
        player.$$game.movementHelper.doTeleport(player, { toLoc: town + " Town" });
        return "You teleported to " + town + " Town!";
    };
    return Trueseer;
}(Profession_1.BaseAttribute));
exports.Trueseer = Trueseer;
//# sourceMappingURL=Trueseer.js.map