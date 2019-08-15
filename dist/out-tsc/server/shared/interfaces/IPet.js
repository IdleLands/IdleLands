"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PetUpgrade;
(function (PetUpgrade) {
    // how much gold the pet can hold
    PetUpgrade["GoldStorage"] = "goldStorage";
    // the likelihood of the pet joining the battle
    PetUpgrade["BattleJoinPercent"] = "battleJoinPercent";
    // how long it takes (in seconds) for a pet to find an item and ilp
    PetUpgrade["GatherTime"] = "gatherTime";
    // the quality boost (1..5) for the pet item find generator
    PetUpgrade["ItemFindQualityBoost"] = "itemFindQualityBoost";
    // the level boost (1..5000) for the pet item find generator
    PetUpgrade["ItemFindLevelBoost"] = "itemFindLevelBoost";
    // the level boost calculated as a % of the players level
    PetUpgrade["ItemFindLevelPercent"] = "itemFindLevelPercent";
    // the amount of ILP this pet gathers per tick
    PetUpgrade["ILPGatherQuantity"] = "ilpGatherQuantity";
    // the strength of the pet soul, goes up with ascension typically
    PetUpgrade["StrongerSoul"] = "strongerSoul";
    // the % of the soul to share with the player
    PetUpgrade["SoulShare"] = "soulShare";
})(PetUpgrade = exports.PetUpgrade || (exports.PetUpgrade = {}));
var PetAffinity;
(function (PetAffinity) {
    // non-combat
    PetAffinity["None"] = "None";
    // primarily physical attack/skills
    PetAffinity["Attacker"] = "Attacker";
    // primarily buffs
    PetAffinity["Buffer"] = "Buffer";
    // primarily offensive spells
    PetAffinity["Caster"] = "Caster";
    // primarily defensive skills
    PetAffinity["Defender"] = "Defender";
    // primarily heals
    PetAffinity["Healer"] = "Healer";
    // primarily debuffs
    PetAffinity["Hunter"] = "Hunter";
})(PetAffinity = exports.PetAffinity || (exports.PetAffinity = {}));
var PetAttribute;
(function (PetAttribute) {
    PetAttribute["Alchemist"] = "Alchemist";
    PetAttribute["Blessed"] = "Blessed";
    PetAttribute["Cursed"] = "Cursed";
    PetAttribute["Golden"] = "Golden";
    PetAttribute["Fateful"] = "Fateful";
    PetAttribute["Ferocious"] = "Ferocious";
    // Mischievous = 'Mischievous', // TODO: force a battle between this pet and another random pet
    PetAttribute["Surging"] = "Surging";
    // Thief = 'Thief', // TODO: steal gold from another player
    PetAttribute["Trueseer"] = "Trueseer";
})(PetAttribute = exports.PetAttribute || (exports.PetAttribute = {}));
var PetUpgradeMaterial;
(function (PetUpgradeMaterial) {
    PetUpgradeMaterial["CrystalGreen"] = "CrystalGreen";
    PetUpgradeMaterial["CrystalYellow"] = "CrystalYellow";
    PetUpgradeMaterial["CrystalRed"] = "CrystalRed";
    PetUpgradeMaterial["CrystalBlue"] = "CrystalBlue";
    PetUpgradeMaterial["CrystalPurple"] = "CrystalPurple";
    PetUpgradeMaterial["CrystalOrange"] = "CrystalOrange";
    PetUpgradeMaterial["CrystalAstral"] = "CrystalAstral";
})(PetUpgradeMaterial = exports.PetUpgradeMaterial || (exports.PetUpgradeMaterial = {}));
//# sourceMappingURL=IPet.js.map