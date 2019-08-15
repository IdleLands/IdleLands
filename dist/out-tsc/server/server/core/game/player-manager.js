"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var fast_json_patch_1 = require("fast-json-patch");
var lodash_1 = require("lodash");
var interfaces_1 = require("../../../shared/interfaces");
var subscription_manager_1 = require("./subscription-manager");
var discord_manager_1 = require("./discord-manager");
var PlayerManager = /** @class */ (function () {
    function PlayerManager() {
        this.players = {};
        this.playerList = [];
        this.playerWatches = {};
        this.playerSockets = {};
        this.currentPlayerMaps = {};
        this.allPlayersSimple = {};
        this.allPlayersInMaps = {};
        this.playerDataHold = {};
    }
    Object.defineProperty(PlayerManager.prototype, "allPlayers", {
        get: function () {
            return this.playerList;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlayerManager.prototype, "allSimplePlayers", {
        get: function () {
            return lodash_1.values(this.allPlayersSimple);
        },
        enumerable: true,
        configurable: true
    });
    PlayerManager.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.subscribeToPlayerMessages();
                this.subscribeToPlayerListMods();
                return [2 /*return*/];
            });
        });
    };
    PlayerManager.prototype.subscribeToPlayerListMods = function () {
        var _this = this;
        this.subscriptionManager.subscribeToChannel(interfaces_1.Channel.Players, function (_a) {
            var player = _a.player, operation = _a.operation;
            switch (operation) {
                case interfaces_1.PlayerChannelOperation.Add: {
                    var oldMap = _this.currentPlayerMaps[player.name];
                    if (oldMap && oldMap !== player.map) {
                        lodash_1.pullAllBy(_this.allPlayersInMaps[oldMap], [player], function (p) { return p.name === player.name; });
                    }
                    _this.allPlayersSimple[player.name] = player;
                    _this.currentPlayerMaps[player.name] = player.map;
                    _this.allPlayersInMaps[player.map] = _this.allPlayersInMaps[player.map] || [];
                    lodash_1.pullAllBy(_this.allPlayersInMaps[player.map], [player], function (p) { return p.name === player.name; });
                    _this.allPlayersInMaps[player.map].push(player);
                    _this.subscriptionManager.emitToClients(interfaces_1.Channel.PlayerUpdates, { player: player, operation: operation });
                    break;
                }
                case interfaces_1.PlayerChannelOperation.Update: {
                    var oldMap = _this.currentPlayerMaps[player.name];
                    if (oldMap && oldMap !== player.map) {
                        lodash_1.pullAllBy(_this.allPlayersInMaps[oldMap], [player], function (p) { return p.name === player.name; });
                    }
                    _this.allPlayersSimple[player.name] = player;
                    _this.currentPlayerMaps[player.name] = player.map;
                    _this.allPlayersInMaps[player.map] = _this.allPlayersInMaps[player.map] || [];
                    lodash_1.pullAllBy(_this.allPlayersInMaps[player.map], [player], function (p) { return p.name === player.name; });
                    _this.allPlayersInMaps[player.map].push(player);
                    _this.subscriptionManager.emitToClients(interfaces_1.Channel.PlayerUpdates, { player: {
                            name: player.name,
                            x: player.x,
                            y: player.y,
                            map: player.map
                        }, operation: operation });
                    break;
                }
                case interfaces_1.PlayerChannelOperation.SpecificUpdate: {
                    _this.subscriptionManager.emitToClients(interfaces_1.Channel.PlayerUpdates, { player: player, operation: operation });
                    break;
                }
                case interfaces_1.PlayerChannelOperation.Remove: {
                    delete _this.allPlayersSimple[player.name];
                    delete _this.currentPlayerMaps[player.name];
                    lodash_1.pullAllBy(_this.allPlayersInMaps[player.map], [player], function (p) { return p.name === player.name; });
                    _this.subscriptionManager.emitToClients(interfaces_1.Channel.PlayerUpdates, { player: player, operation: operation });
                    break;
                }
            }
        });
    };
    PlayerManager.prototype.getSimplePlayer = function (playerName) {
        return this.allPlayersSimple[playerName];
    };
    PlayerManager.prototype.subscribeToPlayerMessages = function () {
        var _this = this;
        this.subscriptionManager.subscribeToChannel(interfaces_1.Channel.PlayerAdventureLog, function (_a) {
            var playerNames = _a.playerNames, data = _a.data;
            if (!playerNames || !data)
                throw new Error('Cannot send an adventure log message without player names or data!');
            playerNames.forEach(function (playerName) {
                _this.emitToPlayer(playerName, interfaces_1.ServerEventName.AdventureLogAdd, tslib_1.__assign({}, data));
            });
        });
    };
    PlayerManager.prototype.simplifyPlayer = function (player) {
        return {
            name: player.name,
            title: player.title,
            level: player.level.__current,
            x: player.x,
            y: player.y,
            map: player.map,
            ascensionLevel: player.ascensionLevel,
            gender: player.gender,
            profession: player.profession,
            mutedUntil: player.mutedUntil,
            modTier: player.modTier
        };
    };
    PlayerManager.prototype.updatePlayer = function (player, operation) {
        if (operation === void 0) { operation = interfaces_1.PlayerChannelOperation.Update; }
        this.subscriptionManager.emitToChannel(interfaces_1.Channel.Players, { player: this.simplifyPlayer(player), operation: operation });
    };
    PlayerManager.prototype.resetPlayerList = function () {
        this.playerList = Object.values(this.players);
    };
    PlayerManager.prototype.addPlayer = function (player, socket) {
        var sendUpdate = true;
        if (this.players[player.name] && this.players[player.name] !== player) {
            sendUpdate = false;
            this.removePlayer(player, false);
        }
        player.loggedIn = true;
        this.playerWatches[player.name] = fast_json_patch_1.observe(player);
        this.players[player.name] = player;
        this.playerSockets[player.name] = socket;
        this.playerDataHold[player.name] = {};
        this.resetPlayerList();
        if (sendUpdate) {
            this.updatePlayer(player, interfaces_1.PlayerChannelOperation.Add);
        }
        this.updatePlayerCount();
    };
    PlayerManager.prototype.removePlayer = function (player, sendUpdates) {
        if (sendUpdates === void 0) { sendUpdates = true; }
        if (this.playerWatches[player.name]) {
            this.playerWatches[player.name].unobserve();
        }
        delete this.players[player.name];
        delete this.playerWatches[player.name];
        delete this.playerDataHold[player.name];
        this.resetPlayerList();
        if (sendUpdates) {
            this.updatePlayer(player, interfaces_1.PlayerChannelOperation.Remove);
        }
        if (player.$party) {
            player.$$game.partyHelper.playerLeave(player);
        }
        this.updatePlayerCount();
    };
    PlayerManager.prototype.updatePlayerCount = function () {
        this.discordManager.updateUserCount(this.playerList.length);
    };
    PlayerManager.prototype.getPlayer = function (name) {
        return this.players[name];
    };
    PlayerManager.prototype.getPlayersInMap = function (map) {
        var players = this.allPlayersInMaps[map] || [];
        return players.map(function (x) { return lodash_1.pick(x, ['name', 'title', 'x', 'y', 'level', 'profession', 'gender']); });
    };
    PlayerManager.prototype.getPlayerPatch = function (name) {
        return fast_json_patch_1.generate(this.playerWatches[name]);
    };
    PlayerManager.prototype.getPlayerSocket = function (name) {
        return this.playerSockets[name];
    };
    PlayerManager.prototype.emitToPlayer = function (playerName, event, data) {
        var socket = this.getPlayerSocket(playerName);
        if (!socket)
            return;
        socket.emit(event, data);
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", subscription_manager_1.SubscriptionManager)
    ], PlayerManager.prototype, "subscriptionManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", discord_manager_1.DiscordManager)
    ], PlayerManager.prototype, "discordManager", void 0);
    PlayerManager = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], PlayerManager);
    return PlayerManager;
}());
exports.PlayerManager = PlayerManager;
//# sourceMappingURL=player-manager.js.map