"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var GachaFreeReset;
(function (GachaFreeReset) {
    GachaFreeReset["Daily"] = "daily";
})(GachaFreeReset = exports.GachaFreeReset || (exports.GachaFreeReset = {}));
var GachaChance;
(function (GachaChance) {
    GachaChance[GachaChance["UnbelievablyCommon"] = 2000] = "UnbelievablyCommon";
    GachaChance[GachaChance["VeryCommon"] = 600] = "VeryCommon";
    GachaChance[GachaChance["Common"] = 450] = "Common";
    GachaChance[GachaChance["Uncommon"] = 300] = "Uncommon";
    GachaChance[GachaChance["Rare"] = 200] = "Rare";
    GachaChance[GachaChance["XRare"] = 100] = "XRare";
    GachaChance[GachaChance["XXRare"] = 50] = "XXRare";
    GachaChance[GachaChance["XXXRare"] = 10] = "XXXRare";
    GachaChance[GachaChance["XXXXRare"] = 1] = "XXXXRare";
    GachaChance[GachaChance["Always"] = -1] = "Always";
})(GachaChance = exports.GachaChance || (exports.GachaChance = {}));
var GachaReward;
(function (GachaReward) {
    GachaReward["XPPlayerSM"] = "xp:player:sm";
    GachaReward["XPPlayerMD"] = "xp:player:md";
    GachaReward["XPPlayerLG"] = "xp:player:lg";
    GachaReward["XPPlayerMax"] = "xp:player:max";
    GachaReward["XPPetSM"] = "xp:pet:sm";
    GachaReward["XPPetMD"] = "xp:pet:md";
    GachaReward["XPPetLG"] = "xp:pet:lg";
    GachaReward["XPPetMax"] = "xp:pet:max";
    GachaReward["GoldSM"] = "gold:player:sm";
    GachaReward["GoldMD"] = "gold:player:md";
    GachaReward["GoldLG"] = "gold:player:lg";
    GachaReward["ILPSM"] = "ilp:player:sm";
    GachaReward["ILPMD"] = "ilp:player:md";
    GachaReward["ILPLG"] = "ilp:player:lg";
    GachaReward["SoulGreen"] = "collectible:Soul:Green";
    GachaReward["SoulYellow"] = "collectible:Soul:Yellow";
    GachaReward["SoulRed"] = "collectible:Soul:Red";
    GachaReward["SoulBlue"] = "collectible:Soul:Blue";
    GachaReward["SoulPurple"] = "collectible:Soul:Purple";
    GachaReward["SoulOrange"] = "collectible:Soul:Orange";
    GachaReward["CrystalGreen"] = "item:Crystal:Green";
    GachaReward["CrystalYellow"] = "item:Crystal:Yellow";
    GachaReward["CrystalRed"] = "item:Crystal:Red";
    GachaReward["CrystalBlue"] = "item:Crystal:Blue";
    GachaReward["CrystalPurple"] = "item:Crystal:Purple";
    GachaReward["CrystalOrange"] = "item:Crystal:Orange";
    GachaReward["CrystalAstral"] = "item:Crystal:Astral";
    GachaReward["ItemBasic"] = "item:generated:basic";
    GachaReward["ItemPro"] = "item:generated:pro";
    GachaReward["ItemIdle"] = "item:generated:idle";
    GachaReward["ItemGodly"] = "item:generated:godly";
    GachaReward["ItemGoatly"] = "item:generated:goatly";
    GachaReward["ItemOmega"] = "item:generated:omega";
    GachaReward["EventEnchantment"] = "event:chosen:Enchant";
    GachaReward["GuardianItem"] = "item:guardian:gear";
    GachaReward["GuardianCollectible"] = "collectible:guardian:random";
    GachaReward["HistoricalCollectible"] = "collectible:historical:random";
    GachaReward["ItemTeleportScrollRandom"] = "item:teleportscroll:random";
    GachaReward["ItemTeleportScrollACR"] = "item:teleportscroll:astralcontrolroom";
    GachaReward["ItemBuffScrollRandom"] = "item:buffscroll:random";
})(GachaReward = exports.GachaReward || (exports.GachaReward = {}));
exports.GachaNameReward = (_a = {},
    _a[GachaReward.XPPlayerSM] = 'Player XP (Small)',
    _a[GachaReward.XPPlayerMD] = 'Player XP (Medium)',
    _a[GachaReward.XPPlayerLG] = 'Player XP (Large)',
    _a[GachaReward.XPPlayerMax] = 'Player Level Up',
    _a[GachaReward.XPPetSM] = 'Pet XP (Small)',
    _a[GachaReward.XPPetMD] = 'Pet XP (Medium)',
    _a[GachaReward.XPPetLG] = 'Pet XP (Large)',
    _a[GachaReward.XPPetMax] = 'Pet Level Up',
    _a[GachaReward.GoldSM] = 'Gold (Small)',
    _a[GachaReward.GoldMD] = 'Gold (Medium)',
    _a[GachaReward.GoldLG] = 'Gold (Large)',
    _a[GachaReward.ILPSM] = 'ILP (Small)',
    _a[GachaReward.ILPMD] = 'ILP (Medium)',
    _a[GachaReward.ILPLG] = 'ILP (Large)',
    _a[GachaReward.ItemBasic] = 'Item (Basic)',
    _a[GachaReward.ItemPro] = 'Item (Pro)',
    _a[GachaReward.ItemIdle] = 'Item (Idle)',
    _a[GachaReward.ItemGodly] = 'Item (Godly)',
    _a[GachaReward.ItemGoatly] = 'Item (Goatly)',
    _a[GachaReward.ItemOmega] = 'Item (Omega)',
    _a[GachaReward.EventEnchantment] = 'Item Enchantment',
    _a[GachaReward.GuardianItem] = 'Item (Guardian)',
    _a[GachaReward.GuardianCollectible] = 'Collectible (Guardian)',
    _a[GachaReward.HistoricalCollectible] = 'Collectible (Historical)',
    _a[GachaReward.SoulGreen] = 'Pet Soul (Green)',
    _a[GachaReward.SoulYellow] = 'Pet Soul (Yellow)',
    _a[GachaReward.SoulRed] = 'Pet Soul (Red)',
    _a[GachaReward.SoulBlue] = 'Pet Soul (Blue)',
    _a[GachaReward.SoulPurple] = 'Pet Soul (Purple)',
    _a[GachaReward.SoulOrange] = 'Pet Soul (Orange)',
    _a[GachaReward.CrystalGreen] = 'Pet Crystal (Green)',
    _a[GachaReward.CrystalYellow] = 'Pet Crystal (Yellow)',
    _a[GachaReward.CrystalRed] = 'Pet Crystal (Red)',
    _a[GachaReward.CrystalBlue] = 'Pet Crystal (Blue)',
    _a[GachaReward.CrystalPurple] = 'Pet Crystal (Purple)',
    _a[GachaReward.CrystalOrange] = 'Pet Crystal (Orange)',
    _a[GachaReward.CrystalAstral] = 'Pet Crystal (Astral)',
    _a[GachaReward.ItemTeleportScrollRandom] = 'Teleport Scroll (Random)',
    _a[GachaReward.ItemTeleportScrollACR] = 'Teleport Scroll (ACR)',
    _a[GachaReward.ItemBuffScrollRandom] = 'Buff Scroll (Random)',
    _a);
//# sourceMappingURL=IGacha.js.map