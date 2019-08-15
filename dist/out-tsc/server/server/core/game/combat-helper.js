"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var lodash_1 = require("lodash");
var lzutf8_1 = require("lzutf8");
var combat_simulator_1 = require("../../../shared/combat/combat-simulator");
var interfaces_1 = require("../../../shared/interfaces");
var asset_manager_1 = require("./asset-manager");
var player_manager_1 = require("./player-manager");
var item_generator_1 = require("./item-generator");
var calculator_helper_1 = require("./calculator-helper");
var Affinities = require("./affinities");
var Professions = require("./professions");
var rng_service_1 = require("./rng-service");
var CombatHelper = /** @class */ (function () {
    function CombatHelper() {
    }
    CombatHelper.prototype.canDoCombat = function (player) {
        var _this = this;
        var players = player.$party ? player.$party.members.map(function (x) { return _this.playerManager.getPlayer(x); }) : [player];
        return !players.some(function (checkPlayer) { return checkPlayer.injuryCount() > checkPlayer.$statistics.get('Game/Premium/Upgrade/InjuryThreshold'); });
    };
    CombatHelper.prototype.createAndRunMonsterCombat = function (player) {
        // if no party, just make a random name for this single person
        var characters = {};
        var parties = {};
        var ante = {};
        // player party
        if (player.$party) {
            parties[0] = { id: 0, name: player.$party.name };
        }
        else {
            parties[0] = { id: 0, name: this.assets.party() };
        }
        // monster party
        parties[1] = { id: 1, name: this.assets.party() };
        // give players ids
        var currentId = 0;
        var playerPartyPlayers = this.getAllPlayerPartyMembers(player);
        var antes = this.getPlayerAntes(playerPartyPlayers);
        var playerParty = this.getAllPartyCombatMembers(playerPartyPlayers)
            .concat(this.getAllPartyCombatPets(playerPartyPlayers));
        playerParty.forEach(function (combatPlayer) {
            combatPlayer.combatId = currentId;
            combatPlayer.combatPartyId = 0;
            characters[currentId] = combatPlayer;
            ante[currentId] = antes[combatPlayer.realName] || { xp: 0, gold: 0 };
            currentId++;
        });
        var monsters = [];
        // generate monsters to fight against (each player gets one for their level)
        for (var i = 0; i < playerParty.length; i++) {
            var monster = this.createBattleMonster(playerParty[i].level);
            monster.combatId = currentId;
            monster.combatPartyId = 1;
            monsters.push(monster);
            characters[currentId] = monster;
            currentId++;
        }
        var monsterAntes = this.getGenericAntes(monsters);
        Object.assign(ante, monsterAntes);
        var doCombat = {
            timestamp: Date.now(),
            seed: Date.now(),
            name: this.assets.battle(),
            characters: characters,
            parties: parties,
            ante: ante
        };
        var _a = this.startCombat(doCombat), combat = _a.combat, simulator = _a.simulator;
        simulator.beginCombat();
        return combat;
    };
    CombatHelper.prototype.createAndRunBossCombat = function (player, opts) {
        var _this = this;
        if (opts === void 0) { opts = { bossName: '', bossParty: '' }; }
        // if no party, just make a random name for this single person
        var characters = {};
        var parties = {};
        var ante = {};
        // player party
        if (player.$party) {
            parties[0] = { id: 0, name: player.$party.name };
        }
        else {
            parties[0] = { id: 0, name: this.assets.party() };
        }
        // monster party
        parties[1] = { id: 1, name: this.assets.party() };
        // give players ids
        var currentId = 0;
        var playerPartyPlayers = this.getAllPlayerPartyMembers(player);
        var antes = this.getPlayerAntes(playerPartyPlayers);
        var playerParty = this.getAllPartyCombatMembers(playerPartyPlayers)
            .concat(this.getAllPartyCombatPets(playerPartyPlayers));
        playerParty.forEach(function (combatPlayer) {
            combatPlayer.combatId = currentId;
            combatPlayer.combatPartyId = 0;
            characters[currentId] = combatPlayer;
            ante[currentId] = antes[combatPlayer.realName] || { xp: 0, gold: 0 };
            currentId++;
        });
        var allAssets = this.assets.allBossAssets;
        var bossMonsterPrototypes = opts.bossParty
            ? allAssets.parties[opts.bossParty].members.map(function (x) { return allAssets.creatures[x]; })
            : [allAssets.creatures[opts.bossName]];
        var monsters = [];
        // generate monsters to fight against (each player gets one for their level)
        bossMonsterPrototypes.forEach(function (proto) {
            var monster = _this.createBossMonster(proto);
            monster.combatId = currentId;
            monster.combatPartyId = 1;
            monsters.push(monster);
            characters[currentId] = monster;
            currentId++;
        });
        var monsterAntes = this.getGenericAntes(monsters);
        Object.assign(ante, monsterAntes);
        var _a = this.getBossAntes(bossMonsterPrototypes), collectibles = _a.collectibles, items = _a.items;
        ante[currentId - 1].collectibles = collectibles;
        ante[currentId - 1].items = items;
        var doCombat = {
            timestamp: Date.now(),
            seed: Date.now(),
            name: this.assets.battle(),
            characters: characters,
            parties: parties,
            ante: ante
        };
        var _b = this.startCombat(doCombat), combat = _b.combat, simulator = _b.simulator;
        simulator.events$.subscribe(function (_a) {
            var action = _a.action, data = _a.data;
            if (action === combat_simulator_1.CombatAction.Victory) {
                if (data.wasTie || data.winningParty !== 0) {
                    // 5min cool down even if they lose or tie.
                    player.cooldowns[opts.bossParty || opts.bossName] = Date.now() + (60 * 1000 * 5);
                    return;
                }
                var respawn = opts.bossParty
                    ? allAssets.parties[opts.bossParty].respawn
                    : allAssets.creatures[opts.bossName].respawn;
                player.cooldowns[opts.bossParty || opts.bossName] = Date.now() + (respawn * 1000);
                Object.values(combat.characters)
                    .filter(function (char) { return char.combatPartyId === 0; })
                    .forEach(function (char) {
                    var playerRef = _this.playerManager.getPlayer(char.realName);
                    if (!playerRef)
                        return;
                    Object.values(combat.characters)
                        .filter(function (potBoss) { return potBoss.combatPartyId !== 0; })
                        .forEach(function (potBoss) {
                        playerRef.increaseStatistic("BossKill/Total", 1);
                        playerRef.increaseStatistic("BossKill/Boss/" + potBoss.name, 1);
                    });
                });
            }
        });
        simulator.beginCombat();
        return combat;
    };
    CombatHelper.prototype.createAndRunPvPCombat = function (player, targeted) {
        // if no party, just make a random name for this single person
        var characters = {};
        var parties = {};
        var ante = {};
        // player party
        if (player.$party) {
            parties[0] = { id: 0, name: player.$party.name };
        }
        else {
            parties[0] = { id: 0, name: this.assets.party() };
        }
        if (targeted.$party) {
            parties[1] = { id: 1, name: targeted.$party.name };
        }
        else {
            parties[1] = { id: 1, name: this.assets.party() };
        }
        // give players ids
        var currentId = 0;
        // first party
        var playerPartyPlayers = this.getAllPlayerPartyMembers(player);
        var antes = this.getPlayerAntes(playerPartyPlayers);
        var playerParty = this.getAllPartyCombatMembers(playerPartyPlayers)
            .concat(this.getAllPartyCombatPets(playerPartyPlayers));
        playerParty.forEach(function (combatPlayer) {
            combatPlayer.combatId = currentId;
            combatPlayer.combatPartyId = 0;
            characters[currentId] = combatPlayer;
            ante[currentId] = antes[combatPlayer.realName] || { xp: 0, gold: 0 };
            currentId++;
        });
        // second party
        var playerParty2Players = this.getAllPlayerPartyMembers(targeted);
        var antes2 = this.getPlayerAntes(playerParty2Players);
        var playerParty2 = this.getAllPartyCombatMembers(playerParty2Players)
            .concat(this.getAllPartyCombatPets(playerParty2Players));
        playerParty2.forEach(function (combatPlayer) {
            combatPlayer.combatId = currentId;
            combatPlayer.combatPartyId = 1;
            characters[currentId] = combatPlayer;
            ante[currentId] = antes2[combatPlayer.realName] || { xp: 0, gold: 0 };
            currentId++;
        });
        var doCombat = {
            timestamp: Date.now(),
            seed: Date.now(),
            name: this.assets.battle(),
            characters: characters,
            parties: parties,
            ante: ante
        };
        var _a = this.startCombat(doCombat), combat = _a.combat, simulator = _a.simulator;
        simulator.beginCombat();
        return combat;
    };
    CombatHelper.prototype.startCombat = function (combat) {
        var _this = this;
        var simulator = new combat_simulator_1.CombatSimulator(combat);
        simulator.events$.subscribe(function (_a) {
            var action = _a.action, data = _a.data;
            if (action === combat_simulator_1.CombatAction.Victory) {
                if (data.wasTie)
                    return;
                _this.handleRewards(data.combat, data.winningParty);
            }
            if (action === combat_simulator_1.CombatAction.IncrementStatistic) {
                var statistic = data.statistic, value = data.value, name_1 = data.name;
                var playerRef = _this.playerManager.getPlayer(name_1);
                if (!playerRef)
                    return;
                playerRef.increaseStatistic(statistic, value);
            }
        });
        return { combat: combat, simulator: simulator };
    };
    CombatHelper.prototype.getAllPlayerPartyMembers = function (player) {
        var _this = this;
        return player.$party ? player.$party.members.map(function (x) { return _this.playerManager.getPlayer(x); }) : [player];
    };
    CombatHelper.prototype.getPlayerAntes = function (players) {
        return players.reduce(function (prev, cur) {
            prev[cur.name] = {
                gold: Math.floor(cur.gold * 0.01),
                xp: Math.floor(cur.xp.total * 0.05)
            };
            return prev;
        }, {});
    };
    CombatHelper.prototype.getGenericAntes = function (combatChars) {
        var _this = this;
        return combatChars.reduce(function (prev, cur) {
            prev[cur.combatId] = {
                gold: Math.max(cur.level * 1000, Math.floor(cur.stats[interfaces_1.Stat.GOLD])),
                xp: Math.floor(_this.calculatorHelper.calcLevelMaxXP(cur.level) * 0.05)
            };
            return prev;
        }, {});
    };
    CombatHelper.prototype.getBossAntes = function (bossPrototypes) {
        var _this = this;
        var collectibles = [];
        var items = [];
        bossPrototypes.forEach(function (proto) {
            if (proto.items) {
                proto.items.forEach(function (item) {
                    if (!_this.rng.likelihood(item.dropPercent))
                        return;
                    items.push(item.name);
                });
            }
            if (proto.collectibles) {
                proto.collectibles.forEach(function (coll) {
                    if (!_this.rng.likelihood(coll.dropPercent))
                        return;
                    collectibles.push(coll.name);
                });
            }
        });
        return { collectibles: collectibles, items: items };
    };
    CombatHelper.prototype.getAllPartyCombatMembers = function (players) {
        var _this = this;
        return players.map(function (partyPlayer) { return _this.createCombatCharacter(partyPlayer); });
    };
    CombatHelper.prototype.getAllPartyCombatPets = function (players) {
        var _this = this;
        var basePets = players.map(function (player) {
            if (!_this.rng.likelihood(player.$pets.getCurrentValueForUpgrade(interfaces_1.PetUpgrade.BattleJoinPercent)))
                return;
            var pet = player.$pets.$activePet;
            var petC = _this.createCombatPet(pet);
            petC.ownerName = player.name;
            return petC;
        }).filter(Boolean);
        var extraPets = players.reduce(function (prev, player) {
            var extraCount = player.$statistics.get('Game/Premium/Upgrade/MaxPetsInCombat');
            if (extraCount <= 1)
                return prev;
            if (player.profession === 'Necromancer') {
                var necroPets = [];
                for (var i = 0; i < extraCount - 1; i++) {
                    necroPets.push(_this.createNecroPet(player));
                }
                return prev.concat(necroPets);
            }
            var newPets = [];
            var possiblePets = Object.values(player.$petsData.allPets)
                .filter(function (x) { return x !== player.$pets.$activePet && x.affinity !== interfaces_1.PetAffinity.None; });
            for (var i = 0; i < extraCount - 1; i++) {
                var pet = lodash_1.sample(possiblePets);
                if (!pet)
                    return prev.concat(newPets);
                lodash_1.pull(possiblePets, pet);
                newPets.push(_this.createCombatPet(pet));
            }
            return prev.concat(newPets);
        }, []);
        return basePets.concat(extraPets);
    };
    CombatHelper.prototype.getMonsterProto = function (generateLevel) {
        var monsterBase = lodash_1.cloneDeep(lodash_1.sample(this.assets.allObjectAssets.monster
            .filter(function (x) { return x.level >= generateLevel - 25 && x.level <= generateLevel + 25; })));
        if (!monsterBase) {
            var monsterProfession = lodash_1.sample(Object.values(interfaces_1.Profession));
            monsterBase = {
                name: "Vector " + monsterProfession,
                profession: monsterProfession,
                level: generateLevel,
                stats: {}
            };
        }
        return monsterBase;
    };
    CombatHelper.prototype.createBossMonster = function (proto) {
        var base = lodash_1.cloneDeep(proto);
        base.attributes.name = base.name;
        return this.equipBattleMonster(base.attributes, base.availableScore);
    };
    CombatHelper.prototype.createBattleMonster = function (generateLevel) {
        var monsterBase = this.getMonsterProto(generateLevel);
        return this.equipBattleMonster(monsterBase);
    };
    CombatHelper.prototype.equipBattleMonster = function (monsterBase, maxScore) {
        var _this = this;
        // fix class snafu nonsense
        if (monsterBase.profession === 'Random')
            monsterBase.profession = lodash_1.sample(Object.values(interfaces_1.Profession));
        if (!monsterBase.profession) {
            monsterBase.profession = lodash_1.sample(['Monster', 'MagicalMonster']);
        }
        var curScore = 0;
        // generate equipment
        var items = [
            interfaces_1.ItemSlot.Body, interfaces_1.ItemSlot.Charm, interfaces_1.ItemSlot.Feet, interfaces_1.ItemSlot.Finger, interfaces_1.ItemSlot.Hands,
            interfaces_1.ItemSlot.Head, interfaces_1.ItemSlot.Legs, interfaces_1.ItemSlot.Mainhand, interfaces_1.ItemSlot.Neck, interfaces_1.ItemSlot.Offhand
        ].map(function (itemSlot) {
            var item = _this.itemGenerator.generateItem({
                generateLevel: monsterBase.level,
                forceType: itemSlot
            });
            if (!item)
                return null;
            if (maxScore && item.score + curScore > maxScore)
                return null;
            curScore += item.score;
            return item;
        });
        var professionInstance = Professions[monsterBase.profession] ? new Professions[monsterBase.profession]() : null;
        var affinityInstance = Affinities[monsterBase.attribute] ? new Affinities[monsterBase.attribute]() : null;
        Object.values(interfaces_1.Stat).forEach(function (stat) {
            monsterBase.stats[stat] = monsterBase.stats[stat] || 0;
            // item boosts
            items.forEach(function (item) {
                if (!item)
                    return;
                monsterBase.stats[stat] += (item.stats[stat] || 0);
            });
            // profession boost
            var profBasePerLevel = professionInstance ? professionInstance.calcLevelStat(_this, stat) : 0;
            monsterBase.stats[stat] += profBasePerLevel || 0;
            // affinity boost
            var affBasePerLevel = affinityInstance ? affinityInstance.calcLevelStat(_this, stat) : 0;
            monsterBase.stats[stat] += affBasePerLevel || 0;
            // stat multiplier from profession
            var statBase = monsterBase.stats[stat];
            var profMult = professionInstance ? professionInstance.calcStatMultiplier(stat) : 1;
            if (profMult > 1) {
                var addedValue = Math.floor((statBase * profMult)) - statBase;
                monsterBase.stats[stat] += addedValue || 0;
            }
            else if (profMult < 1) {
                var lostValue = statBase - Math.floor(statBase * profMult);
                monsterBase.stats[stat] -= lostValue || 0;
            }
        });
        // next we do specific-adds from the profession
        // we do these last, despite being additive, because they rely heavily on the stats from before
        var copyStats = lodash_1.clone(monsterBase.stats);
        Object.values(interfaces_1.Stat).forEach(function (checkStat) {
            var profBoosts = professionInstance ? professionInstance.calcStatsForStats(copyStats, checkStat) : [];
            profBoosts.forEach(function (_a) {
                var stat = _a.stat, boost = _a.boost;
                monsterBase.stats[stat] += boost || 0;
            });
        });
        // monsters get a free hp boost b/c I said so
        monsterBase.stats[interfaces_1.Stat.HP] = Math.max(1, monsterBase.stats[interfaces_1.Stat.HP]);
        monsterBase.stats[interfaces_1.Stat.HP] += (monsterBase.level * 100);
        Object.keys(monsterBase.stats).forEach(function (statKey) {
            monsterBase.stats[statKey] = Math.max(monsterBase.stats[statKey], 10);
        });
        monsterBase.maxStats = lodash_1.clone(monsterBase.stats);
        return monsterBase;
    };
    CombatHelper.prototype.createCombatCharacter = function (player) {
        var stats = lodash_1.clone(player.currentStats);
        var maxStats = lodash_1.clone(player.currentStats);
        stats[interfaces_1.Stat.SPECIAL] = player.$profession.determineStartingSpecial(player);
        maxStats[interfaces_1.Stat.SPECIAL] = player.$profession.determineMaxSpecial(player);
        return {
            name: player.fullName(),
            realName: player.name,
            level: player.level.total,
            specialName: player.$profession.specialStatName,
            maxStats: maxStats,
            stats: stats,
            profession: player.profession
        };
    };
    CombatHelper.prototype.createCombatPet = function (pet) {
        var stats = lodash_1.clone(pet.currentStats);
        var maxStats = lodash_1.clone(pet.currentStats);
        return {
            name: pet.name + " (" + pet.$$player.name + "'s Pet)",
            level: pet.level.total,
            stats: stats,
            maxStats: maxStats,
            affinity: pet.affinity,
            attribute: pet.attribute,
            rating: pet.rating
        };
    };
    CombatHelper.prototype.createNecroPet = function (player) {
        var multiplier = 0.75;
        var stats = Object.assign({}, player.currentStats);
        Object.keys(stats).forEach(function (stat) { return stats[stat] = Math.floor(stats[stat] * multiplier); });
        var maxStats = Object.assign({}, stats);
        var profession = lodash_1.sample(Object.values(interfaces_1.Profession));
        var prefix = lodash_1.sample(['Zombie', 'Skeletal', 'Bone', 'Ghostly', 'Mummy', 'Ghoulish', 'Spectral', 'Shadow']);
        return {
            name: prefix + " " + profession + " (" + player.name + "'s Minion)",
            level: Math.floor(player.level.total * multiplier),
            stats: stats,
            maxStats: maxStats,
            profession: profession
        };
    };
    CombatHelper.prototype.handleRewards = function (combat, winningParty) {
        var _this = this;
        var winningPlayers = Object.values(combat.characters)
            .filter(function (x) { return x.combatPartyId === winningParty; })
            .map(function (x) { return _this.playerManager.getPlayer(x.realName); })
            .filter(Boolean);
        var winningPets = Object.values(combat.characters)
            .filter(function (x) { return x.combatPartyId === winningParty; })
            .map(function (x) {
            var player = _this.playerManager.getPlayer(x.ownerName);
            if (!player)
                return;
            return player.$pets.$activePet;
        })
            .filter(Boolean);
        // remove winner ante so they don't cash in hard or lose too hard
        Object.values(combat.characters).filter(function (x) { return x.combatPartyId === winningParty; }).forEach(function (char) { return delete combat.ante[char.combatId]; });
        var totalXPAnte = Object.values(combat.ante).reduce(function (prev, cur) { return prev + cur.xp; }, 0);
        var totalGoldAnte = Object.values(combat.ante).reduce(function (prev, cur) { return prev + cur.gold; }, 0);
        var anteItems = Object.values(combat.ante).reduce(function (prev, cur) { return prev.concat(cur.items || []); }, []);
        var anteCollectibles = Object.values(combat.ante).reduce(function (prev, cur) { return prev.concat(cur.collectibles || []); }, []);
        var _a = this.assets.allBossAssets, items = _a.items, collectibles = _a.collectibles;
        var earnedGold = Math.floor(totalGoldAnte / winningPlayers.length);
        var earnedXP = Math.floor(totalXPAnte / winningPlayers.length);
        winningPets.forEach(function (pet) {
            pet.gainGold(earnedGold);
            pet.gainXP(earnedXP);
        });
        // split rewards evenly amongst the winners
        winningPlayers.forEach(function (char) {
            char.gainGold(earnedGold);
            char.gainXP(earnedXP);
            if (anteItems.length > 0) {
                anteItems.forEach(function (itemName) {
                    var foundItem = _this.itemGenerator.generateGuardianItem(char, itemName, items[itemName].type, items[itemName]);
                    char.$$game.eventManager.doEventFor(char, interfaces_1.EventName.FindItem, { fromGuardian: true, item: foundItem });
                });
            }
            if (anteCollectibles.length > 0) {
                anteCollectibles.forEach(function (collName) {
                    var coll = collectibles[collName];
                    char.tryFindCollectible({
                        name: collName,
                        rarity: interfaces_1.ItemClass.Guardian,
                        description: coll.flavorText,
                        storyline: coll.storyline
                    });
                });
            }
        });
        // assign penalties
        Object.values(combat.characters).forEach(function (x) {
            if (x.combatPartyId === winningParty)
                return;
            var player = _this.playerManager.getPlayer(x.realName);
            if (!player)
                return;
            var ante = combat.ante[x.combatId];
            if (!ante)
                return;
            player.gainGold(-ante.gold);
            player.gainXP(-ante.xp);
            player.addBuff(_this.createRandomInjury(player));
        });
    };
    CombatHelper.prototype.getCompressedCombat = function (combat) {
        var data = JSON.parse(JSON.stringify(combat));
        delete data.chance;
        Object.values(data.characters).forEach(function (char) { return delete char.effects; });
        return lzutf8_1.compress(JSON.stringify(data), { outputEncoding: 'Base64' });
    };
    CombatHelper.prototype.createRandomInjury = function (player) {
        var _a;
        var injuryName = this.assets.injury();
        var debuffStat = lodash_1.sample([interfaces_1.Stat.STR, interfaces_1.Stat.INT, interfaces_1.Stat.LUK, interfaces_1.Stat.CON, interfaces_1.Stat.DEX, interfaces_1.Stat.HP, interfaces_1.Stat.AGI]);
        var debuffValue = Math.floor(player.getStat(debuffStat) * 0.05);
        return {
            name: injuryName,
            statistic: 'Character/Ticks',
            duration: 180,
            stats: (_a = {}, _a[debuffStat] = -debuffValue, _a)
        };
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", asset_manager_1.AssetManager)
    ], CombatHelper.prototype, "assets", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", item_generator_1.ItemGenerator)
    ], CombatHelper.prototype, "itemGenerator", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", player_manager_1.PlayerManager)
    ], CombatHelper.prototype, "playerManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", rng_service_1.RNGService)
    ], CombatHelper.prototype, "rng", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", calculator_helper_1.CalculatorHelper)
    ], CombatHelper.prototype, "calculatorHelper", void 0);
    CombatHelper = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], CombatHelper);
    return CombatHelper;
}());
exports.CombatHelper = CombatHelper;
//# sourceMappingURL=combat-helper.js.map