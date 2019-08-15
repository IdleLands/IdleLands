"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a, _b;
var PermanentUpgrade;
(function (PermanentUpgrade) {
    // the permanent inventory size boost for buying this pet
    PermanentUpgrade["InventorySizeBoost"] = "inventorySizeBoost";
    // the permanent soul storage size boost for buying this pet
    PermanentUpgrade["BuffScrollDuration"] = "buffScrollDurationBoost";
    // the permanent adventure log size boost for buying this pet
    PermanentUpgrade["AdventureLogSizeBoost"] = "adventureLogSizeBoost";
    // the permanent choice log size boost for buying this pet
    PermanentUpgrade["ChoiceLogSizeBoost"] = "choiceLogSizeBoost";
    // the permanent enchant cap boost for buying this pet
    PermanentUpgrade["EnchantCapBoost"] = "enchantCapBoost";
    // the permanent item stat cap % boost for buying this pet
    PermanentUpgrade["ItemStatCapBoost"] = "itemStatCapBoost";
    // the permanent item stat cap % boost for buying this pet
    PermanentUpgrade["PetMissionCapBoost"] = "petMissionCapBoost";
    // the permanent injury threshold for being locked out of combat
    PermanentUpgrade["InjuryThreshold"] = "injuryThreshold";
    // the number of pets you can bring into combat
    PermanentUpgrade["MaxPetsInCombat"] = "maxPetsInCombat";
    // the maximum stamina boost you get. stacks with other sources.
    PermanentUpgrade["MaxStaminaBoost"] = "maxStaminaBoost";
})(PermanentUpgrade = exports.PermanentUpgrade || (exports.PermanentUpgrade = {}));
var PremiumTier;
(function (PremiumTier) {
    PremiumTier[PremiumTier["None"] = 0] = "None";
    PremiumTier[PremiumTier["Donator"] = 1] = "Donator";
    PremiumTier[PremiumTier["Subscriber"] = 2] = "Subscriber";
    PremiumTier[PremiumTier["Subscriber2"] = 3] = "Subscriber2";
    PremiumTier[PremiumTier["Subscriber3"] = 4] = "Subscriber3";
    PremiumTier[PremiumTier["Moderator"] = 5] = "Moderator";
    PremiumTier[PremiumTier["GM"] = 10] = "GM";
})(PremiumTier = exports.PremiumTier || (exports.PremiumTier = {}));
var ContributorTier;
(function (ContributorTier) {
    ContributorTier[ContributorTier["None"] = 0] = "None";
    ContributorTier[ContributorTier["Contributor"] = 2] = "Contributor";
})(ContributorTier = exports.ContributorTier || (exports.ContributorTier = {}));
exports.PremiumScale = (_a = {},
    _a[PermanentUpgrade.AdventureLogSizeBoost] = 3,
    _a[PermanentUpgrade.ChoiceLogSizeBoost] = 5,
    _a[PermanentUpgrade.EnchantCapBoost] = 15,
    _a[PermanentUpgrade.InventorySizeBoost] = 20,
    _a[PermanentUpgrade.BuffScrollDuration] = 10,
    _a[PermanentUpgrade.ItemStatCapBoost] = 25,
    _a[PermanentUpgrade.PetMissionCapBoost] = 50,
    _a[PermanentUpgrade.MaxStaminaBoost] = 2,
    _a);
var OtherILPPurchase;
(function (OtherILPPurchase) {
    OtherILPPurchase["ResetCooldowns"] = "resetCooldowns";
})(OtherILPPurchase = exports.OtherILPPurchase || (exports.OtherILPPurchase = {}));
exports.OtherILPCosts = (_b = {},
    _b[OtherILPPurchase.ResetCooldowns] = 50,
    _b);
//# sourceMappingURL=IPremium.js.map