"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _a, _b;
var typescript_ioc_1 = require("typescript-ioc");
var lodash_1 = require("lodash");
var Achievements = require("./achievements");
var interfaces_1 = require("../../../shared/interfaces");
var asset_manager_1 = require("./asset-manager");
// big thanks to Boaty for this and the class change titles.
// you da bes!
var StepperAchievementTitles = (_a = {},
    _a[interfaces_1.Profession.Archer] = 'Sagittarian',
    _a[interfaces_1.Profession.Barbarian] = 'Barbaric',
    _a[interfaces_1.Profession.Bard] = 'Diva',
    _a[interfaces_1.Profession.Bitomancer] = 'Digistepper',
    _a[interfaces_1.Profession.Cleric] = 'Divine',
    _a[interfaces_1.Profession.Fighter] = 'Warlord',
    _a[interfaces_1.Profession.Generalist] = 'Jack of All Trades',
    _a[interfaces_1.Profession.Jester] = 'Clown',
    _a[interfaces_1.Profession.Mage] = 'Magical',
    _a[interfaces_1.Profession.MagicalMonster] = 'Minotaur',
    _a[interfaces_1.Profession.Monster] = 'Monstrous',
    _a[interfaces_1.Profession.Necromancer] = 'Hellraiser',
    _a[interfaces_1.Profession.Pirate] = 'Piratical',
    _a[interfaces_1.Profession.Rogue] = 'Roguish',
    _a[interfaces_1.Profession.SandwichArtist] = 'Artistic',
    _a);
var ClassChangeTitles = (_b = {},
    _b[interfaces_1.Profession.Archer] = ['Off-Target', 'Inaccurate', 'Good Shot', 'Precise', 'Exact'],
    _b[interfaces_1.Profession.Barbarian] = ['Uncouth', 'Rude', 'Lowbrow', 'Philistine', 'Uncivilized'],
    _b[interfaces_1.Profession.Bard] = ['Tone Deaf', 'Melodic', 'Harmonic', 'Symphonic', 'Operatic'],
    _b[interfaces_1.Profession.Bitomancer] = ['Beta Tester', 'Code Monkey', 'Geek', 'Cyberpunk', 'l33t h4x0r'],
    _b[interfaces_1.Profession.Cleric] = ['Sanctimonious', 'Pious', 'Devout', 'Righteous', 'Saintly'],
    _b[interfaces_1.Profession.Fighter] = ['Ornery', 'Combatative', 'Pugilistic', 'Militant', 'Bellicose'],
    _b[interfaces_1.Profession.Generalist] = ['Vague', 'Undifferentiated', 'Average', 'Versatile', 'Well-Rounded'],
    _b[interfaces_1.Profession.Jester] = ['Unfunny', 'Laughable', 'Amusing', 'Hilarious', 'Hysterical'],
    _b[interfaces_1.Profession.Mage] = ['Charlatan', 'Conjurer', 'Wizard', 'Warlock', 'Shaman'],
    _b[interfaces_1.Profession.MagicalMonster] = ['Gnome', 'Goblin', 'Centaur', 'Griffin', 'Manticore'],
    _b[interfaces_1.Profession.Monster] = ['Yucky', 'Deformed', 'Freak of Nature', 'Grotesque', 'Inhuman'],
    _b[interfaces_1.Profession.Necromancer] = ['Morbid', 'Gravedigger', 'Witch Doctor', 'Dark Artist', 'Thaumaturge'],
    _b[interfaces_1.Profession.Pirate] = ['Damp', 'Swabbie', 'Keelhauler', 'Scurvy', 'Old Salt'],
    _b[interfaces_1.Profession.Rogue] = ['Naughty', 'Bad Egg', 'Rascal', 'Rapscallion', 'Blackguard'],
    _b[interfaces_1.Profession.SandwichArtist] = ['Bologna Botticelli', 'Grilled Cheese Gaugin', 'Roast Beef Rembrandt',
        'Pepperoni Picasso', 'Muffuletta Michaelangelo'],
    _b);
var AchievementManager = /** @class */ (function () {
    function AchievementManager() {
        this.allAchievements = {};
        this.statToAchievement = {};
    }
    AchievementManager.prototype.init = function () {
        var _this = this;
        Object.keys(Achievements).forEach(function (achievementName) {
            var ach = Achievements[achievementName];
            _this.allAchievements[achievementName] = ach;
            if (!ach.statWatches)
                return;
            ach.statWatches.forEach(function (stat) {
                _this.statToAchievement[stat] = _this.statToAchievement[stat] || [];
                _this.statToAchievement[stat].push(ach);
            });
        });
        var allExtraAchievements = this.getAllPetAchievements().concat(this.getAllClassSpecificAchievements());
        allExtraAchievements.forEach(function (petAch) {
            _this.allAchievements[petAch.name] = petAch;
            petAch.statWatches.forEach(function (stat) {
                _this.statToAchievement[stat] = _this.statToAchievement[stat] || [];
                _this.statToAchievement[stat].push(petAch);
            });
        });
    };
    AchievementManager.prototype.getAllPetAchievements = function () {
        var allPets = Object.values(this.assets.allPetAssets);
        return allPets.map(function (pet) {
            return {
                name: "Tribal: " + pet.typeName,
                statWatches: Object.keys(pet.requirements.statistics).concat(['Item/Collectible/Find']),
                type: interfaces_1.AchievementType.Pet,
                descriptionForTier: function () { return "You earned a new pet: " + pet.typeName + ".\n          It offers the following permanent bonuses for " + pet.cost.toLocaleString() + " gold:\n          " + Object.keys(pet.permanentUpgrades).map(function (x) { return x + " +" + pet.permanentUpgrades[x]; }).join(', '); },
                calculateTier: function (player) {
                    var meetsStatistics = Object.keys(pet.requirements.statistics).every(function (stat) {
                        var val = player.$statistics.get(stat);
                        return val >= pet.requirements.statistics[stat];
                    });
                    var meetsAchievements = pet.requirements.achievements ? Object.keys(pet.requirements.achievements).every(function (ach) {
                        var achTier = player.$achievements.getAchievementTier(ach);
                        return achTier >= pet.requirements.achievements[ach];
                    }) : true;
                    var meetsCollectibles = pet.requirements.collectibles ? pet.requirements.collectibles.every(function (coll) {
                        return player.$collectibles.has(coll);
                    }) : true;
                    return meetsStatistics && meetsCollectibles && meetsAchievements ? 1 : 0;
                },
                rewardsForTier: function () { return [{ type: interfaces_1.AchievementRewardType.Pet, pet: pet.typeName }]; }
            };
        });
    };
    AchievementManager.prototype.getAllClassSpecificAchievements = function () {
        var allClasses = Object.values(interfaces_1.Profession);
        var stepper = allClasses.map(function (x) {
            return {
                name: "Stepper: " + x,
                statWatches: ["Profession/" + x + "/Steps"],
                type: interfaces_1.AchievementType.Progress,
                descriptionForTier: function () { return "You've taken " + (1000000).toLocaleString() + " steps as a " + x + ".\n          Title: " + StepperAchievementTitles[x] + ". Gender: Blue " + x + "."; },
                calculateTier: function (player) { return player.$statistics.get("Profession/" + x + "/Steps") > 1000000 ? 1 : 0; },
                rewardsForTier: function () { return [
                    { type: interfaces_1.AchievementRewardType.Title, title: StepperAchievementTitles[x] },
                    { type: interfaces_1.AchievementRewardType.Gender, gender: x + "-blue" }
                ]; }
            };
        });
        var becomeTierMap = [5, 15, 25, 50, 100];
        var becomer = allClasses.map(function (x) {
            return {
                name: "Professional: " + x,
                statWatches: ["Profession/" + x + "/Become"],
                type: interfaces_1.AchievementType.Progress,
                descriptionForTier: function (tier) {
                    var baseStr = "You've become a " + x + " " + becomeTierMap[tier - 1] + " times.\n            Titles: " + ClassChangeTitles[x].slice(0, tier).join(', ') + ".";
                    if (tier >= 3) {
                        baseStr = baseStr + " Gender: Red " + x;
                    }
                    if (tier >= 5) {
                        baseStr = baseStr + " Gender: Green " + x;
                    }
                    return baseStr;
                },
                calculateTier: function (player) {
                    var base = player.$statistics.get("Profession/" + x + "/Become");
                    if (base >= 100)
                        return 5;
                    if (base >= 50)
                        return 4;
                    if (base >= 25)
                        return 3;
                    if (base >= 15)
                        return 2;
                    if (base >= 5)
                        return 1;
                    return 0;
                },
                rewardsForTier: function (tier) {
                    var rewards = [];
                    for (var i = 0; i < tier; i++) {
                        rewards.push({ type: interfaces_1.AchievementRewardType.Title, title: ClassChangeTitles[x][i] });
                    }
                    if (tier >= 3) {
                        rewards.push({ type: interfaces_1.AchievementRewardType.Gender, gender: x + "-red" });
                    }
                    if (tier >= 5) {
                        rewards.push({ type: interfaces_1.AchievementRewardType.Gender, gender: x + "-green" });
                    }
                    return rewards;
                }
            };
        });
        return stepper.concat(becomer);
    };
    AchievementManager.prototype.getAchievementObject = function (player, achName, alwaysGet) {
        if (alwaysGet === void 0) { alwaysGet = false; }
        var ach = this.allAchievements[achName];
        var tier = ach.calculateTier(player);
        if (tier === 0)
            return;
        var existingTier = alwaysGet ? 0 : player.$achievements.getAchievementTier(ach.name);
        if (tier === existingTier)
            return;
        var existingAchAt = alwaysGet ? player.$achievements.getAchievementAchieved(ach.name) : 0;
        var achObj = {
            name: ach.name,
            achievedAt: existingAchAt || Date.now(),
            tier: tier,
            desc: ach.descriptionForTier(tier),
            type: ach.type,
            rewards: ach.rewardsForTier(tier)
        };
        return achObj;
    };
    AchievementManager.prototype.checkAchievementsFor = function (player, stat) {
        var _this = this;
        if (stat && !this.statToAchievement[stat])
            return [];
        var newAchievements = [];
        var checkArr = stat ? this.statToAchievement[stat] : Object.values(this.allAchievements);
        checkArr.forEach(function (ach) {
            var achObj = _this.getAchievementObject(player, ach.name);
            if (!achObj)
                return;
            newAchievements.push(achObj);
            player.$achievements.add(achObj);
        });
        return newAchievements;
    };
    AchievementManager.prototype.syncAchievements = function (player) {
        var _this = this;
        var allEarnedAchievements = lodash_1.compact(Object.values(this.allAchievements).map(function (ach) { return _this.getAchievementObject(player, ach.name, true); }));
        player.$achievements.resetAchievementsTo(allEarnedAchievements);
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", asset_manager_1.AssetManager)
    ], AchievementManager.prototype, "assets", void 0);
    AchievementManager = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], AchievementManager);
    return AchievementManager;
}());
exports.AchievementManager = AchievementManager;
//# sourceMappingURL=achievement-manager.js.map