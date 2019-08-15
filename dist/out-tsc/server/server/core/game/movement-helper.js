"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var lodash_1 = require("lodash");
var world_1 = require("./world");
var interfaces_1 = require("../../../shared/interfaces");
var rng_service_1 = require("./rng-service");
var event_manager_1 = require("./event-manager");
var logger_1 = require("../logger");
var holiday_helper_1 = require("./holiday-helper");
var asset_manager_1 = require("./asset-manager");
var party_helper_1 = require("./party-helper");
var MovementHelper = /** @class */ (function () {
    function MovementHelper() {
        this.directions = [
            interfaces_1.Direction.Southwest,
            interfaces_1.Direction.South,
            interfaces_1.Direction.Southeast,
            interfaces_1.Direction.East,
            interfaces_1.Direction.Northeast,
            interfaces_1.Direction.North,
            interfaces_1.Direction.Northwest,
            interfaces_1.Direction.West
        ];
    }
    MovementHelper.prototype.locToTeleport = function (name) {
        return this.assets.allTeleports[name];
    };
    MovementHelper.prototype.moveToStart = function (player) {
        player.setPos(10, 10, 'Norkos', 'Norkos Town');
    };
    MovementHelper.prototype.getTileAt = function (map, x, y) {
        return this.world.getMap(map).getTile(x, y);
    };
    MovementHelper.prototype.canEnterTile = function (player, tile) {
        var properties = lodash_1.get(tile, 'object.properties');
        if (properties) {
            var totalRequirements = 0;
            var metRequirements = 0;
            if (properties.requireMap) {
                totalRequirements++;
                if (player.$statistics.get("Map/" + properties.requireMap + "/Steps") > 0)
                    metRequirements++;
            }
            if (properties.requireBoss) {
                totalRequirements++;
                if (player.$statistics.get("BossKill/Boss/" + properties.requireBoss) > 0)
                    metRequirements++;
            }
            if (properties.requireClass) {
                totalRequirements++;
                if (player.profession === properties.requireClass)
                    metRequirements++;
            }
            if (properties.requireAchievement) {
                totalRequirements++;
                if (player.hasAchievement(properties.requireAchievement))
                    metRequirements++;
            }
            if (properties.requireCollectible) {
                totalRequirements++;
                if (player.$collectibles.hasCurrently(properties.requireCollectible))
                    metRequirements++;
            }
            if (properties.requireAscension) {
                totalRequirements++;
                if (player.ascensionLevel >= +properties.requireAscension)
                    metRequirements++;
            }
            if (properties.requireHoliday) {
                totalRequirements++;
                if (this.holidayHelper.isHoliday(properties.requireHoliday))
                    metRequirements++;
            }
            if (totalRequirements !== metRequirements)
                return false;
        }
        return !tile.blocked && tile.terrain !== 'Void';
    };
    MovementHelper.prototype.num2dir = function (dir, x, y) {
        switch (dir) {
            case interfaces_1.Direction.Southwest: return { x: x - 1, y: y - 1 };
            case interfaces_1.Direction.South: return { x: x, y: y - 1 };
            case interfaces_1.Direction.Southeast: return { x: x + 1, y: y - 1 };
            case interfaces_1.Direction.West: return { x: x - 1, y: y };
            case interfaces_1.Direction.East: return { x: x + 1, y: y };
            case interfaces_1.Direction.Northwest: return { x: x - 1, y: y + 1 };
            case interfaces_1.Direction.North: return { x: x, y: y + 1 };
            case interfaces_1.Direction.Northeast: return { x: x + 1, y: y + 1 };
            default: return { x: x, y: y };
        }
    };
    MovementHelper.prototype.xyDiff2dir = function (x1, y1, x2, y2) {
        if (x1 > x2 && y1 > y2)
            return interfaces_1.Direction.Southwest;
        if (x1 === x2 && y1 > y2)
            return interfaces_1.Direction.South;
        if (x1 < x2 && y1 > y2)
            return interfaces_1.Direction.Southeast;
        if (x1 > x2 && y1 === y2)
            return interfaces_1.Direction.West;
        if (x1 < x2 && y1 === y2)
            return interfaces_1.Direction.East;
        if (x1 > x2 && y1 < y2)
            return interfaces_1.Direction.Northwest;
        if (x1 === x2 && y1 < y2)
            return interfaces_1.Direction.North;
        if (x1 < x2 && y1 < y2)
            return interfaces_1.Direction.Northeast;
        return interfaces_1.Direction.Nowhere;
    };
    MovementHelper.prototype.getInitialWeight = function (player) {
        var weight = [300, 40, 7, 3, 1, 3, 7, 40];
        var drunk = false;
        var dirMod = null;
        if (player.lastDir) {
            dirMod = player.lastDir;
        }
        if (player.divineDirection) {
            player.increaseStatistic("Character/Movement/Steps/Divine", 1);
            dirMod = this.xyDiff2dir(player.x, player.y, player.divineDirection.x, player.divineDirection.y);
        }
        if (dirMod) {
            var lastDirIndex = this.directions.indexOf(dirMod);
            if (lastDirIndex !== -1) {
                weight = weight.slice(weight.length - lastDirIndex).concat(weight.slice(0, weight.length - lastDirIndex));
            }
        }
        if (drunk) {
            weight = [1, 1, 1, 1, 1, 1, 1, 1];
        }
        return weight;
    };
    MovementHelper.prototype.pickRandomDirection = function (player, weight) {
        var dirIndexes = [0, 1, 2, 3, 4, 5, 6, 7];
        var weights = weight;
        var useIndexes = [];
        var useWeights = [];
        for (var i = 0; i < weights.length; i++) {
            if (weights[i] === 0)
                continue;
            useWeights.push(weights[i]);
            useIndexes.push(dirIndexes[i]);
        }
        if (weight.length === 0 || useWeights.length === 0) {
            this.logger.error('PlayerMovement', new Error(player.name + " in " + player.map + " @ " + player.x + "," + player.y + " is unable to move due to no weights."));
            return;
        }
        var dirIndex = this.rng.weighted(useIndexes, useWeights);
        return { index: dirIndex, dir: this.directions[dirIndex] };
    };
    // used externally to move the player (gm, premium, etc)
    MovementHelper.prototype.doTeleport = function (player, _a) {
        var map = _a.map, x = _a.x, y = _a.y, toLoc = _a.toLoc;
        var tile = {
            terrain: '',
            region: '',
            blocked: false,
            object: {
                properties: {
                    destx: x,
                    desty: y,
                    movementType: 'teleport',
                    map: map,
                    toLoc: toLoc
                }
            }
        };
        this.handleTileTeleport(player, tile, true);
        // const realTile = this.getTileAt(player.map, player.x, player.y);
        // this.handleTile(player, realTile);
    };
    MovementHelper.prototype.handleTile = function (player, tile, ignoreIf) {
        var type = lodash_1.get(tile, 'object.properties.realtype');
        var forceEvent = lodash_1.get(tile, 'object.properties.forceEvent', '');
        if (forceEvent) {
            var cdCheck = player.x + "," + player.y + "|" + player.map;
            if (!player.cooldowns[cdCheck] || player.cooldowns[cdCheck] < Date.now()) {
                delete player.cooldowns[cdCheck];
                var oldil3EventNames = {
                    'ItemBless': 'BlessItem',
                    'ItemForsake': 'ForsakeItem',
                    'GoldBless': 'BlessGold',
                    'GoldForsake': 'ForsakeGold',
                    'XPBless': 'BlessXP',
                    'XPForsake': 'ForsakeXP',
                    'Gambling': 'Gamble'
                };
                this.eventManager.doEventFor(player, oldil3EventNames[forceEvent] || forceEvent, tile.object.properties);
            }
            if (forceEvent !== interfaces_1.EventName.Providence) {
                // 5 minute cooldown per tile
                player.cooldowns[cdCheck] = Date.now() + (1000 * 60 * 5);
            }
        }
        if (!type || !this["handleTile" + type] || ignoreIf === type)
            return;
        this["handleTile" + type](player, tile);
    };
    MovementHelper.prototype.handleTileTeleport = function (player, tile, force) {
        if (force === void 0) { force = false; }
        if (!tile.object)
            return;
        var dest = tile.object.properties;
        dest.x = +dest.destx;
        dest.y = +dest.desty;
        if (dest.movementType === interfaces_1.MovementType.Ascend && player.$personalities.isActive('Delver')) {
            player.$$game.subscriptionManager.emitToChannel(interfaces_1.Channel.PlayerAdventureLog, { playerNames: [player.name], data: {
                    when: Date.now(),
                    type: interfaces_1.AdventureLogEventType.Explore,
                    message: 'You attempted to go up the stairs but your delving personality only lets you go down!'
                } });
            return;
        }
        if (dest.movementType === interfaces_1.MovementType.Descend && player.$personalities.isActive('ScaredOfTheDark')) {
            player.$$game.subscriptionManager.emitToChannel(interfaces_1.Channel.PlayerAdventureLog, { playerNames: [player.name], data: {
                    when: Date.now(),
                    type: interfaces_1.AdventureLogEventType.Explore,
                    message: 'You attempted to go down the stairs but your scared of the dark personality only lets you go up!'
                } });
            return;
        }
        if (!force && (dest.movementType === interfaces_1.MovementType.Ascend || dest.movementType === interfaces_1.MovementType.Descend)) {
            if (player.stepCooldown > 0)
                return;
            player.stepCooldown = 10;
        }
        if (!dest.map && !dest.toLoc) {
            this.logger.error('PlayerMovement', new Error("No dest.map at " + player.x + ", " + player.y + " in " + player.map));
            return;
        }
        if (!dest.movementType) {
            this.logger.error('PlayerMovement', new Error("No dest.movementType at " + player.x + ", " + player.y + " in " + player.map));
            return;
        }
        if (!dest.fromName)
            dest.fromName = player.map;
        if (!dest.destName)
            dest.destName = dest.map;
        player.divineDirection = null;
        if (dest.toLoc) {
            if (dest.toLoc === 'guildbase') {
                return;
            }
            else {
                try {
                    var toLocData = this.locToTeleport(dest.toLoc);
                    dest.x = toLocData.x;
                    dest.y = toLocData.y;
                    dest.map = toLocData.map;
                    dest.destName = toLocData.formalName;
                }
                catch (e) {
                    this.logger.error('PlayerMovement', new Error("Loc data is not correct for " + dest.toLoc + " (" + JSON.stringify(this.locToTeleport(dest.toLoc)) + ")"));
                    player.setPos(10, 10, 'Norkos', 'Wilderness');
                    return;
                }
            }
        }
        player.setPos(dest.x, dest.y, dest.map, tile.region);
        var newTile = this.getTileAt(player.map, player.x, player.y);
        player.region = newTile.region;
        this.handleTile(player, tile, 'Teleport');
        player.increaseStatistic("Character/Movement/" + lodash_1.capitalize(dest.movementType), 1);
    };
    MovementHelper.prototype.handleTileCollectible = function (player, tileData) {
        var collectible = tileData.object;
        var collectibleName = collectible.name;
        var collectibleRarity = lodash_1.get(collectible, 'properties.rarity', 'basic');
        player.tryFindCollectible({
            name: collectibleName,
            rarity: collectibleRarity,
            description: collectible.properties.flavorText,
            storyline: collectible.properties.storyline
        });
    };
    MovementHelper.prototype.handleTileTrainer = function (player, tileData) {
        var professionName = tileData.object.name;
        var trainerName = tileData.object.properties.realName ?
            tileData.object.properties.realName + ", the " + professionName + " trainer" :
            "the " + professionName + " trainer";
        this.eventManager.doEventFor(player, interfaces_1.EventName.FindTrainer, { professionName: professionName, trainerName: trainerName });
    };
    MovementHelper.prototype.handleTileBoss = function (player, tileData) {
        this.eventManager.doEventFor(player, interfaces_1.EventName.BattleBoss, { bossName: tileData.object.name });
    };
    MovementHelper.prototype.handleTileBossParty = function (player, tileData) {
        this.eventManager.doEventFor(player, interfaces_1.EventName.BattleBoss, { bossParty: tileData.object.name });
    };
    MovementHelper.prototype.handleTileTreasure = function (player, tileData) {
        this.eventManager.doEventFor(player, interfaces_1.EventName.FindTreasure, { treasureName: tileData.object.name });
    };
    MovementHelper.prototype.takeStep = function (player) {
        if (player.$personalities.isActive('Camping')) {
            player.increaseStatistic('Character/Movement/Steps/Camping', 1);
            return;
        }
        var weight = this.getInitialWeight(player);
        if (!player.stepCooldown)
            player.stepCooldown = 0;
        var attempts = 1;
        var _a = this.pickRandomDirection(player, weight), index = _a.index, dir = _a.dir;
        // follow the leader if we're a telesheep
        if (player.$party && player.$personalities.isActive('Telesheep')) {
            var leader = this.partyHelper.getPartyLeader(player.$party);
            if (leader !== player) {
                dir = this.xyDiff2dir(player.x, player.y, leader.x, leader.y);
            }
        }
        var newLoc = this.num2dir(dir, player.x, player.y);
        var tile = this.getTileAt(player.map, newLoc.x, newLoc.y);
        while (!this.canEnterTile(player, tile)) {
            if (attempts > 8) {
                this.logger.error('PlayerMovement', new Error("Player " + player.name + " is position locked at " + player.x + ", " + player.y + " in " + player.map));
                break;
            }
            weight[index] = 0;
            var res = this.pickRandomDirection(player, weight);
            index = res.index;
            dir = res.dir;
            newLoc = this.num2dir(dir, player.x, player.y);
            tile = this.getTileAt(player.map, newLoc.x, newLoc.y);
            attempts++;
        }
        if (!tile.terrain) {
            this.logger.error('PlayerMovement', new Error("Invalid tile terrain undefined for " + player.name + " @ " + player.map + ": " + player.x + "," + player.y));
        }
        var oldLoc = { x: player.x, y: player.y, map: player.map };
        if (player.stepCooldown > 0) {
            player.stepCooldown--;
        }
        player.stepCooldown--;
        player.lastDir = dir === interfaces_1.Direction.Nowhere ? null : dir;
        player.lastLoc = oldLoc;
        player.setPos(newLoc.x, newLoc.y, player.map, tile.region);
        var map = this.world.getMap(player.map);
        if (!map || player.x <= 0 || player.y <= 0 || player.x >= map.width || player.y >= map.height) {
            this.logger.error('PlayerMovement', new Error("Out of bounds for " + player.name + " at " + player.region + " on " + player.map + ":\n          " + player.x + ", " + player.y + ". Old " + oldLoc.x + ", " + oldLoc.y));
            this.moveToStart(player);
        }
        this.handleTile(player, tile);
        player.increaseStatistic("Profession/" + player.profession + "/Steps", 1);
        player.increaseStatistic("Character/Movement/Steps/Normal", 1);
        player.increaseStatistic("Environment/Terrain/" + (lodash_1.capitalize(tile.terrain) || 'Void'), 1);
        player.increaseStatistic("Map/" + player.map + "/Region/" + (player.region || 'Wilderness'), 1);
        player.increaseStatistic("Map/" + player.map + "/Steps", 1);
        if (player.$personalities.isActive('Drunk')) {
            player.increaseStatistic("Character/Movement/Steps/Drunk", 1);
        }
        if (player.$personalities.isActive('Solo')) {
            player.increaseStatistic("Character/Movement/Steps/Solo", 1);
        }
        if (player.$party) {
            player.increaseStatistic("Character/Movement/Steps/Party", 1);
        }
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", world_1.World)
    ], MovementHelper.prototype, "world", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", logger_1.Logger)
    ], MovementHelper.prototype, "logger", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", rng_service_1.RNGService)
    ], MovementHelper.prototype, "rng", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", asset_manager_1.AssetManager)
    ], MovementHelper.prototype, "assets", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", event_manager_1.EventManager)
    ], MovementHelper.prototype, "eventManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", party_helper_1.PartyHelper)
    ], MovementHelper.prototype, "partyHelper", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", holiday_helper_1.HolidayHelper)
    ], MovementHelper.prototype, "holidayHelper", void 0);
    MovementHelper = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], MovementHelper);
    return MovementHelper;
}());
exports.MovementHelper = MovementHelper;
//# sourceMappingURL=movement-helper.js.map