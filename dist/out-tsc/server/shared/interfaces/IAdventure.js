"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b, _c, _d, _e;
var IGacha_1 = require("./IGacha");
var AdventureDuration;
(function (AdventureDuration) {
    AdventureDuration[AdventureDuration["VeryShort"] = 2] = "VeryShort";
    AdventureDuration[AdventureDuration["Short"] = 4] = "Short";
    AdventureDuration[AdventureDuration["Medium"] = 8] = "Medium";
    AdventureDuration[AdventureDuration["Long"] = 16] = "Long";
    AdventureDuration[AdventureDuration["VeryLong"] = 24] = "VeryLong";
})(AdventureDuration = exports.AdventureDuration || (exports.AdventureDuration = {}));
var AdventureType;
(function (AdventureType) {
    AdventureType["Combat"] = "combat";
    AdventureType["MerchantGuild"] = "merchantguild";
    AdventureType["BossHunt"] = "bosshunt";
    AdventureType["TimeTravel"] = "timetravel";
    AdventureType["MagicalItemSearch"] = "magicalitemsearch";
    AdventureType["EnhancementSearch"] = "enhancementsearch";
    AdventureType["Adventure"] = "adventure";
    AdventureType["AdventurersGraveyard"] = "adventurersgraveyard";
})(AdventureType = exports.AdventureType || (exports.AdventureType = {}));
exports.AdventureNames = (_a = {},
    _a[AdventureType.Combat] = 'Training Adventure',
    _a[AdventureType.MerchantGuild] = 'Trip to the Merchant Guild',
    _a[AdventureType.BossHunt] = 'Guardian Hunt',
    _a[AdventureType.TimeTravel] = 'Time Travel Adventure (Rare)',
    _a[AdventureType.MagicalItemSearch] = 'Magical Item Search (Rare)',
    _a[AdventureType.EnhancementSearch] = 'Pet Enhancement Material Search',
    _a[AdventureType.Adventure] = 'Idle Adventure',
    _a[AdventureType.AdventurersGraveyard] = 'Graverobbing the Adventurers Graveyard',
    _a);
exports.AdventureDescriptions = (_b = {},
    _b[AdventureType.Combat] = 'Seek out foes to earn gold and experience.',
    _b[AdventureType.MerchantGuild] = 'Send your pets off to buy and sell items from the Merchant Guild.',
    _b[AdventureType.BossHunt] = 'Seek and attempt to defeat a guardian of the realm.',
    _b[AdventureType.TimeTravel] = 'Travel through time and attempt to bring back historical items.',
    _b[AdventureType.MagicalItemSearch] = 'Search for magical items in the realm of Idliathlia.',
    _b[AdventureType.EnhancementSearch] = 'Hunt down pet enhancement materials.',
    _b[AdventureType.Adventure] = 'Set sail on the winds of adventure.',
    _b[AdventureType.AdventurersGraveyard] = 'Go to the olde Adventurer Graveyard and bring back an item.',
    _b);
exports.AdventureRequirements = (_c = {},
    _c[AdventureType.TimeTravel] = function (player) { return player.ascensionLevel > 0; },
    _c);
exports.AdventureRewards = (_d = {},
    _d[AdventureType.Combat] = [
        { result: IGacha_1.GachaReward.XPPetSM, chance: IGacha_1.GachaChance.VeryCommon },
        { result: IGacha_1.GachaReward.XPPetMD, chance: IGacha_1.GachaChance.Common },
        { result: IGacha_1.GachaReward.XPPetLG, chance: IGacha_1.GachaChance.Uncommon },
        { result: IGacha_1.GachaReward.XPPetMax, chance: IGacha_1.GachaChance.XXRare },
        { result: IGacha_1.GachaReward.XPPlayerSM, chance: IGacha_1.GachaChance.VeryCommon },
        { result: IGacha_1.GachaReward.XPPlayerMD, chance: IGacha_1.GachaChance.Common },
        { result: IGacha_1.GachaReward.XPPlayerLG, chance: IGacha_1.GachaChance.Uncommon },
        { result: IGacha_1.GachaReward.XPPlayerMax, chance: IGacha_1.GachaChance.XXXRare },
        { result: IGacha_1.GachaReward.GoldSM, chance: IGacha_1.GachaChance.VeryCommon },
        { result: IGacha_1.GachaReward.GoldMD, chance: IGacha_1.GachaChance.Common },
        { result: IGacha_1.GachaReward.GoldLG, chance: IGacha_1.GachaChance.Uncommon }
    ],
    _d[AdventureType.MerchantGuild] = [
        { result: IGacha_1.GachaReward.GoldSM, chance: IGacha_1.GachaChance.VeryCommon },
        { result: IGacha_1.GachaReward.GoldMD, chance: IGacha_1.GachaChance.Common },
        { result: IGacha_1.GachaReward.GoldLG, chance: IGacha_1.GachaChance.Uncommon },
        { result: IGacha_1.GachaReward.ItemBasic, chance: IGacha_1.GachaChance.Rare },
        { result: IGacha_1.GachaReward.ItemPro, chance: IGacha_1.GachaChance.XRare },
        { result: IGacha_1.GachaReward.ItemIdle, chance: IGacha_1.GachaChance.XXRare },
        { result: IGacha_1.GachaReward.ItemBuffScrollRandom, chance: IGacha_1.GachaChance.Rare },
        { result: IGacha_1.GachaReward.ItemTeleportScrollRandom, chance: IGacha_1.GachaChance.Rare }
    ],
    _d[AdventureType.BossHunt] = [
        { result: IGacha_1.GachaReward.XPPetSM, chance: IGacha_1.GachaChance.VeryCommon },
        { result: IGacha_1.GachaReward.XPPetMD, chance: IGacha_1.GachaChance.Common },
        { result: IGacha_1.GachaReward.XPPetLG, chance: IGacha_1.GachaChance.Uncommon },
        { result: IGacha_1.GachaReward.XPPetMax, chance: IGacha_1.GachaChance.XXRare },
        { result: IGacha_1.GachaReward.XPPlayerSM, chance: IGacha_1.GachaChance.VeryCommon },
        { result: IGacha_1.GachaReward.XPPlayerMD, chance: IGacha_1.GachaChance.Common },
        { result: IGacha_1.GachaReward.XPPlayerLG, chance: IGacha_1.GachaChance.Uncommon },
        { result: IGacha_1.GachaReward.XPPlayerMax, chance: IGacha_1.GachaChance.XXXRare },
        { result: IGacha_1.GachaReward.GoldSM, chance: IGacha_1.GachaChance.VeryCommon },
        { result: IGacha_1.GachaReward.GoldMD, chance: IGacha_1.GachaChance.Common },
        { result: IGacha_1.GachaReward.GoldLG, chance: IGacha_1.GachaChance.Uncommon },
        { result: IGacha_1.GachaReward.GuardianCollectible, chance: IGacha_1.GachaChance.Rare },
        { result: IGacha_1.GachaReward.GuardianItem, chance: IGacha_1.GachaChance.Rare }
    ],
    _d[AdventureType.TimeTravel] = [
        { result: IGacha_1.GachaReward.XPPetSM, chance: IGacha_1.GachaChance.VeryCommon },
        { result: IGacha_1.GachaReward.XPPlayerSM, chance: IGacha_1.GachaChance.VeryCommon },
        { result: IGacha_1.GachaReward.HistoricalCollectible, chance: IGacha_1.GachaChance.XXRare }
    ],
    _d[AdventureType.MagicalItemSearch] = [
        { result: IGacha_1.GachaReward.XPPetSM, chance: IGacha_1.GachaChance.VeryCommon },
        { result: IGacha_1.GachaReward.XPPlayerSM, chance: IGacha_1.GachaChance.VeryCommon },
        { result: IGacha_1.GachaReward.ItemBuffScrollRandom, chance: IGacha_1.GachaChance.Rare },
        { result: IGacha_1.GachaReward.ItemTeleportScrollRandom, chance: IGacha_1.GachaChance.Rare }
    ],
    _d[AdventureType.EnhancementSearch] = [
        { result: IGacha_1.GachaReward.XPPetSM, chance: IGacha_1.GachaChance.VeryCommon },
        { result: IGacha_1.GachaReward.XPPetMD, chance: IGacha_1.GachaChance.Common },
        { result: IGacha_1.GachaReward.XPPetLG, chance: IGacha_1.GachaChance.Uncommon },
        { result: IGacha_1.GachaReward.XPPetMax, chance: IGacha_1.GachaChance.XRare },
        { result: IGacha_1.GachaReward.CrystalRed, chance: IGacha_1.GachaChance.Rare },
        { result: IGacha_1.GachaReward.CrystalOrange, chance: IGacha_1.GachaChance.Rare },
        { result: IGacha_1.GachaReward.CrystalYellow, chance: IGacha_1.GachaChance.Rare },
        { result: IGacha_1.GachaReward.CrystalGreen, chance: IGacha_1.GachaChance.Rare },
        { result: IGacha_1.GachaReward.CrystalBlue, chance: IGacha_1.GachaChance.Rare },
        { result: IGacha_1.GachaReward.CrystalPurple, chance: IGacha_1.GachaChance.Rare },
        { result: IGacha_1.GachaReward.SoulRed, chance: IGacha_1.GachaChance.XXRare },
        { result: IGacha_1.GachaReward.SoulOrange, chance: IGacha_1.GachaChance.XXRare },
        { result: IGacha_1.GachaReward.SoulYellow, chance: IGacha_1.GachaChance.XXRare },
        { result: IGacha_1.GachaReward.SoulGreen, chance: IGacha_1.GachaChance.XXRare },
        { result: IGacha_1.GachaReward.SoulBlue, chance: IGacha_1.GachaChance.XXRare },
        { result: IGacha_1.GachaReward.SoulPurple, chance: IGacha_1.GachaChance.XXRare },
    ],
    _d[AdventureType.Adventure] = [
        { result: IGacha_1.GachaReward.XPPetSM, chance: IGacha_1.GachaChance.VeryCommon },
        { result: IGacha_1.GachaReward.XPPetMD, chance: IGacha_1.GachaChance.Common },
        { result: IGacha_1.GachaReward.XPPetLG, chance: IGacha_1.GachaChance.Uncommon },
        { result: IGacha_1.GachaReward.XPPlayerSM, chance: IGacha_1.GachaChance.VeryCommon },
        { result: IGacha_1.GachaReward.XPPlayerMD, chance: IGacha_1.GachaChance.Common },
        { result: IGacha_1.GachaReward.XPPlayerLG, chance: IGacha_1.GachaChance.Uncommon },
        { result: IGacha_1.GachaReward.CrystalRed, chance: IGacha_1.GachaChance.XRare },
        { result: IGacha_1.GachaReward.CrystalOrange, chance: IGacha_1.GachaChance.XRare },
        { result: IGacha_1.GachaReward.CrystalYellow, chance: IGacha_1.GachaChance.XRare },
        { result: IGacha_1.GachaReward.CrystalGreen, chance: IGacha_1.GachaChance.XRare },
        { result: IGacha_1.GachaReward.CrystalBlue, chance: IGacha_1.GachaChance.XRare },
        { result: IGacha_1.GachaReward.CrystalPurple, chance: IGacha_1.GachaChance.XRare },
        { result: IGacha_1.GachaReward.ItemBuffScrollRandom, chance: IGacha_1.GachaChance.Rare },
        { result: IGacha_1.GachaReward.ItemTeleportScrollRandom, chance: IGacha_1.GachaChance.Rare },
        { result: IGacha_1.GachaReward.ItemBasic, chance: IGacha_1.GachaChance.Rare }
    ],
    _d[AdventureType.AdventurersGraveyard] = [
        { result: IGacha_1.GachaReward.XPPetSM, chance: IGacha_1.GachaChance.VeryCommon },
        { result: IGacha_1.GachaReward.XPPlayerSM, chance: IGacha_1.GachaChance.VeryCommon },
        { result: IGacha_1.GachaReward.ItemBasic, chance: IGacha_1.GachaChance.Rare },
        { result: IGacha_1.GachaReward.ItemPro, chance: IGacha_1.GachaChance.XRare },
        { result: IGacha_1.GachaReward.ItemIdle, chance: IGacha_1.GachaChance.XXRare },
    ],
    _d);
exports.AdventureChances = [
    { result: AdventureType.Adventure, chance: IGacha_1.GachaChance.Common },
    { result: AdventureType.Combat, chance: IGacha_1.GachaChance.Common },
    { result: AdventureType.BossHunt, chance: IGacha_1.GachaChance.Common },
    { result: AdventureType.TimeTravel, chance: IGacha_1.GachaChance.Common },
    { result: AdventureType.MerchantGuild, chance: IGacha_1.GachaChance.Common },
    { result: AdventureType.EnhancementSearch, chance: IGacha_1.GachaChance.Common },
    { result: AdventureType.AdventurersGraveyard, chance: IGacha_1.GachaChance.Common },
    { result: AdventureType.MagicalItemSearch, chance: IGacha_1.GachaChance.Common }
];
exports.AdventureDurationChances = [
    { result: AdventureDuration.VeryShort, chance: IGacha_1.GachaChance.Rare },
    { result: AdventureDuration.Short, chance: IGacha_1.GachaChance.Uncommon },
    { result: AdventureDuration.Medium, chance: IGacha_1.GachaChance.Common },
    { result: AdventureDuration.Long, chance: IGacha_1.GachaChance.Uncommon },
    { result: AdventureDuration.VeryLong, chance: IGacha_1.GachaChance.XRare },
];
exports.BaseAdventureRewardCount = (_e = {},
    _e[AdventureDuration.VeryShort] = 1,
    _e[AdventureDuration.Short] = 1.5,
    _e[AdventureDuration.Medium] = 2,
    _e[AdventureDuration.Long] = 2.5,
    _e[AdventureDuration.VeryLong] = 4,
    _e);
//# sourceMappingURL=IAdventure.js.map