"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var BaseGachaRoller_1 = require("./BaseGachaRoller");
var interfaces_1 = require("../interfaces");
var AstralGate = /** @class */ (function (_super) {
    tslib_1.__extends(AstralGate, _super);
    function AstralGate() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.name = 'Astral Gate';
        _this.desc = 'A trip to the Astral Gate can bring you back experience, gold, items, rare pets, and pet enhancing items.';
        _this.rollCost = 10;
        _this.freeResetInterval = interfaces_1.GachaFreeReset.Daily;
        _this.rewards = [
            { result: interfaces_1.GachaReward.GoldSM, chance: interfaces_1.GachaChance.Common },
            { result: interfaces_1.GachaReward.GoldMD, chance: interfaces_1.GachaChance.Uncommon },
            { result: interfaces_1.GachaReward.GoldLG, chance: interfaces_1.GachaChance.Rare },
            { result: interfaces_1.GachaReward.XPPlayerSM, chance: interfaces_1.GachaChance.Common },
            { result: interfaces_1.GachaReward.XPPlayerMD, chance: interfaces_1.GachaChance.Uncommon },
            { result: interfaces_1.GachaReward.XPPlayerLG, chance: interfaces_1.GachaChance.Rare },
            { result: interfaces_1.GachaReward.XPPlayerMax, chance: interfaces_1.GachaChance.XXXRare },
            { result: interfaces_1.GachaReward.XPPetSM, chance: interfaces_1.GachaChance.Common },
            { result: interfaces_1.GachaReward.XPPetMD, chance: interfaces_1.GachaChance.Uncommon },
            { result: interfaces_1.GachaReward.XPPetLG, chance: interfaces_1.GachaChance.Rare },
            { result: interfaces_1.GachaReward.XPPetMax, chance: interfaces_1.GachaChance.XRare },
            { result: interfaces_1.GachaReward.SoulBlue, chance: interfaces_1.GachaChance.XXRare },
            { result: interfaces_1.GachaReward.SoulGreen, chance: interfaces_1.GachaChance.XXRare },
            { result: interfaces_1.GachaReward.SoulOrange, chance: interfaces_1.GachaChance.XXRare },
            { result: interfaces_1.GachaReward.SoulPurple, chance: interfaces_1.GachaChance.XXRare },
            { result: interfaces_1.GachaReward.SoulRed, chance: interfaces_1.GachaChance.XXRare },
            { result: interfaces_1.GachaReward.SoulYellow, chance: interfaces_1.GachaChance.XXRare },
            { result: interfaces_1.GachaReward.CrystalBlue, chance: interfaces_1.GachaChance.Rare },
            { result: interfaces_1.GachaReward.CrystalGreen, chance: interfaces_1.GachaChance.Rare },
            { result: interfaces_1.GachaReward.CrystalOrange, chance: interfaces_1.GachaChance.Rare },
            { result: interfaces_1.GachaReward.CrystalPurple, chance: interfaces_1.GachaChance.Rare },
            { result: interfaces_1.GachaReward.CrystalRed, chance: interfaces_1.GachaChance.Rare },
            { result: interfaces_1.GachaReward.CrystalYellow, chance: interfaces_1.GachaChance.Rare },
            { result: interfaces_1.GachaReward.CrystalAstral, chance: interfaces_1.GachaChance.XRare },
            { result: interfaces_1.GachaReward.ItemTeleportScrollRandom, chance: interfaces_1.GachaChance.Rare },
            { result: interfaces_1.GachaReward.ItemTeleportScrollACR, chance: interfaces_1.GachaChance.XRare },
            { result: interfaces_1.GachaReward.ItemBuffScrollRandom, chance: interfaces_1.GachaChance.Rare }
        ];
        return _this;
    }
    return AstralGate;
}(BaseGachaRoller_1.BaseGachaRoller));
exports.AstralGate = AstralGate;
//# sourceMappingURL=AstralGate.js.map