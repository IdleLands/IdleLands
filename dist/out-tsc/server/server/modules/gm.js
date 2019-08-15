"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var models_1 = require("../../shared/models");
var interfaces_1 = require("../../shared/interfaces");
var GMMotdEvent = /** @class */ (function (_super) {
    tslib_1.__extends(GMMotdEvent, _super);
    function GMMotdEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.GMSetMOTD;
        _this.description = 'GM: Set the MOTD for the game';
        _this.args = 'motd';
        return _this;
    }
    GMMotdEvent.prototype.callback = function (_a) {
        var motd = (_a === void 0 ? { motd: '' } : _a).motd;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                if (player.modTier < interfaces_1.ModeratorTier.GameMod)
                    return [2 /*return*/, this.gameError('Lol no.')];
                this.game.gmHelper.initiateSetMOTD(motd);
                return [2 /*return*/];
            });
        });
    };
    return GMMotdEvent;
}(models_1.ServerSocketEvent));
exports.GMMotdEvent = GMMotdEvent;
var GMToggleMuteEvent = /** @class */ (function (_super) {
    tslib_1.__extends(GMToggleMuteEvent, _super);
    function GMToggleMuteEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.GMToggleMute;
        _this.description = 'GM: Toggle mute for a player';
        _this.args = 'playerName, duration';
        return _this;
    }
    GMToggleMuteEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { playerName: '', duration: 60 } : _a, playerName = _b.playerName, duration = _b.duration;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player;
            return tslib_1.__generator(this, function (_c) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                if (player.modTier < interfaces_1.ModeratorTier.ChatMod)
                    return [2 /*return*/, this.gameError('Lol no.')];
                this.game.gmHelper.initiateMute(playerName, duration);
                return [2 /*return*/];
            });
        });
    };
    return GMToggleMuteEvent;
}(models_1.ServerSocketEvent));
exports.GMToggleMuteEvent = GMToggleMuteEvent;
var GMChangeModTierEvent = /** @class */ (function (_super) {
    tslib_1.__extends(GMChangeModTierEvent, _super);
    function GMChangeModTierEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.GMChangeModTier;
        _this.description = 'GM: Change mod tier for a player';
        _this.args = 'playerName, newTier';
        return _this;
    }
    GMChangeModTierEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { playerName: '', newTier: 0 } : _a, playerName = _b.playerName, newTier = _b.newTier;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player;
            return tslib_1.__generator(this, function (_c) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                if (player.modTier < interfaces_1.ModeratorTier.Admin)
                    return [2 /*return*/, this.gameError('Lol no.')];
                this.game.gmHelper.initiateChangeModTier(playerName, newTier);
                return [2 /*return*/];
            });
        });
    };
    return GMChangeModTierEvent;
}(models_1.ServerSocketEvent));
exports.GMChangeModTierEvent = GMChangeModTierEvent;
var GMStartFestivalEvent = /** @class */ (function (_super) {
    tslib_1.__extends(GMStartFestivalEvent, _super);
    function GMStartFestivalEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.GMStartFestival;
        _this.description = 'GM: Start a festival';
        _this.args = 'festival';
        return _this;
    }
    GMStartFestivalEvent.prototype.callback = function (_a) {
        var festival = (_a === void 0 ? { festival: null } : _a).festival;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                if (player.modTier < interfaces_1.ModeratorTier.GameMod)
                    return [2 /*return*/, this.gameError('Lol no.')];
                if (!festival)
                    return [2 /*return*/, this.gameError('No festival specified.')];
                this.game.festivalManager.startGMFestival(player, festival);
                return [2 /*return*/];
            });
        });
    };
    return GMStartFestivalEvent;
}(models_1.ServerSocketEvent));
exports.GMStartFestivalEvent = GMStartFestivalEvent;
var GMSetStatisticEvent = /** @class */ (function (_super) {
    tslib_1.__extends(GMSetStatisticEvent, _super);
    function GMSetStatisticEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.GMSetStatistic;
        _this.description = 'GM: Set statistic for a player';
        _this.args = 'player, statistic, value';
        return _this;
    }
    GMSetStatisticEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { player: '', statistic: '', value: 0 } : _a, player = _b.player, statistic = _b.statistic, value = _b.value;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var myPlayer, playerRef, statVal;
            return tslib_1.__generator(this, function (_c) {
                myPlayer = this.player;
                if (!myPlayer)
                    return [2 /*return*/, this.notConnected()];
                if (myPlayer.modTier < interfaces_1.ModeratorTier.GameMod)
                    return [2 /*return*/, this.gameError('Lol no.')];
                playerRef = this.game.playerManager.getPlayer(player);
                if (!playerRef)
                    return [2 /*return*/, this.gameError('Could not find that player.')];
                statVal = +value;
                if (isNaN(statVal))
                    return [2 /*return*/, this.gameError('Stat value invalid.')];
                playerRef.$statistics.set(statistic, statVal);
                this.gameMessage("Set " + player + " " + statistic + " to " + statVal.toLocaleString() + ".");
                return [2 /*return*/];
            });
        });
    };
    return GMSetStatisticEvent;
}(models_1.ServerSocketEvent));
exports.GMSetStatisticEvent = GMSetStatisticEvent;
var GMSetNameEvent = /** @class */ (function (_super) {
    tslib_1.__extends(GMSetNameEvent, _super);
    function GMSetNameEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.GMSetName;
        _this.description = 'GM: Set name for a player';
        _this.args = 'player, newName';
        return _this;
    }
    GMSetNameEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { player: '', newName: '' } : _a, player = _b.player, newName = _b.newName;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var myPlayer, playerRef;
            return tslib_1.__generator(this, function (_c) {
                myPlayer = this.player;
                if (!myPlayer)
                    return [2 /*return*/, this.notConnected()];
                if (myPlayer.modTier < interfaces_1.ModeratorTier.GameMod)
                    return [2 /*return*/, this.gameError('Lol no.')];
                playerRef = this.game.playerManager.getPlayer(player);
                if (playerRef)
                    return [2 /*return*/, this.gameError('That player is online. You cannot rename an online player.')];
                this.game.databaseManager.renamePlayer(player, newName);
                this.gameMessage("Set " + player + " name to " + newName + ".");
                return [2 /*return*/];
            });
        });
    };
    return GMSetNameEvent;
}(models_1.ServerSocketEvent));
exports.GMSetNameEvent = GMSetNameEvent;
var GMSetLevelEvent = /** @class */ (function (_super) {
    tslib_1.__extends(GMSetLevelEvent, _super);
    function GMSetLevelEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.GMSetLevel;
        _this.description = 'GM: Set level for a player';
        _this.args = 'player, newLevel';
        return _this;
    }
    GMSetLevelEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { player: '', newLevel: 0 } : _a, player = _b.player, newLevel = _b.newLevel;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var myPlayer, playerRef, levelVal;
            return tslib_1.__generator(this, function (_c) {
                myPlayer = this.player;
                if (!myPlayer)
                    return [2 /*return*/, this.notConnected()];
                if (myPlayer.modTier < interfaces_1.ModeratorTier.GameMod)
                    return [2 /*return*/, this.gameError('Lol no.')];
                playerRef = this.game.playerManager.getPlayer(player);
                if (!playerRef)
                    return [2 /*return*/, this.gameError('Could not find that player.')];
                levelVal = +newLevel;
                if (isNaN(levelVal))
                    return [2 /*return*/, this.gameError('ILP value invalid.')];
                playerRef.level.set(levelVal);
                this.gameMessage("Set " + player + " level to " + levelVal.toLocaleString() + ".");
                return [2 /*return*/];
            });
        });
    };
    return GMSetLevelEvent;
}(models_1.ServerSocketEvent));
exports.GMSetLevelEvent = GMSetLevelEvent;
var GMGiveILPEvent = /** @class */ (function (_super) {
    tslib_1.__extends(GMGiveILPEvent, _super);
    function GMGiveILPEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.GMGiveILP;
        _this.description = 'GM: Give ILP to a player';
        _this.args = 'player, ilp';
        return _this;
    }
    GMGiveILPEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { player: '', ilp: 0 } : _a, player = _b.player, ilp = _b.ilp;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var myPlayer, playerRef, ilpVal;
            return tslib_1.__generator(this, function (_c) {
                myPlayer = this.player;
                if (!myPlayer)
                    return [2 /*return*/, this.notConnected()];
                if (myPlayer.modTier < interfaces_1.ModeratorTier.GameMod)
                    return [2 /*return*/, this.gameError('Lol no.')];
                playerRef = this.game.playerManager.getPlayer(player);
                if (!playerRef)
                    return [2 /*return*/, this.gameError('Could not find that player.')];
                ilpVal = +ilp;
                if (isNaN(ilpVal))
                    return [2 /*return*/, this.gameError('ILP value invalid.')];
                playerRef.gainILP(ilpVal);
                this.gameMessage("Gave " + player + " " + ilpVal.toLocaleString() + " ILP.");
                return [2 /*return*/];
            });
        });
    };
    return GMGiveILPEvent;
}(models_1.ServerSocketEvent));
exports.GMGiveILPEvent = GMGiveILPEvent;
var GMGiveGoldEvent = /** @class */ (function (_super) {
    tslib_1.__extends(GMGiveGoldEvent, _super);
    function GMGiveGoldEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.GMGiveGold;
        _this.description = 'GM: Give gold to a player';
        _this.args = 'player, gold';
        return _this;
    }
    GMGiveGoldEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { player: '', gold: 0 } : _a, player = _b.player, gold = _b.gold;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var myPlayer, playerRef, goldVal;
            return tslib_1.__generator(this, function (_c) {
                myPlayer = this.player;
                if (!myPlayer)
                    return [2 /*return*/, this.notConnected()];
                if (myPlayer.modTier < interfaces_1.ModeratorTier.GameMod)
                    return [2 /*return*/, this.gameError('Lol no.')];
                playerRef = this.game.playerManager.getPlayer(player);
                if (!playerRef)
                    return [2 /*return*/, this.gameError('Could not find that player.')];
                goldVal = +gold;
                if (isNaN(goldVal))
                    return [2 /*return*/, this.gameError('Gold value invalid.')];
                playerRef.gainGold(goldVal, false);
                this.gameMessage("Gave " + player + " " + goldVal.toLocaleString() + " gold.");
                return [2 /*return*/];
            });
        });
    };
    return GMGiveGoldEvent;
}(models_1.ServerSocketEvent));
exports.GMGiveGoldEvent = GMGiveGoldEvent;
var GMGiveItemEvent = /** @class */ (function (_super) {
    tslib_1.__extends(GMGiveItemEvent, _super);
    function GMGiveItemEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.GMGiveItem;
        _this.description = 'GM: Give item to a player';
        _this.args = 'player, item';
        return _this;
    }
    GMGiveItemEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { player: '', item: { name: '', type: '', itemClass: '', stats: {} } } : _a, player = _b.player, item = _b.item;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var myPlayer, playerRef, itemRef;
            return tslib_1.__generator(this, function (_c) {
                myPlayer = this.player;
                if (!myPlayer)
                    return [2 /*return*/, this.notConnected()];
                if (myPlayer.modTier < interfaces_1.ModeratorTier.GameMod)
                    return [2 /*return*/, this.gameError('Lol no.')];
                playerRef = this.game.playerManager.getPlayer(player);
                if (!playerRef)
                    return [2 /*return*/, this.gameError('Could not find that player.')];
                if (!item.name || !item.itemClass || !item.type)
                    return [2 /*return*/, this.gameError('Invalid item data')];
                itemRef = new models_1.Item();
                itemRef.init(item);
                this.game.eventManager.doEventFor(playerRef, interfaces_1.EventName.FindItem, { item: itemRef });
                return [2 /*return*/];
            });
        });
    };
    return GMGiveItemEvent;
}(models_1.ServerSocketEvent));
exports.GMGiveItemEvent = GMGiveItemEvent;
var GMPortCharacterEvent = /** @class */ (function (_super) {
    tslib_1.__extends(GMPortCharacterEvent, _super);
    function GMPortCharacterEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.GMPortCharacterId;
        _this.description = 'GM: Port a character to a different character';
        _this.args = 'player, newPlayer';
        return _this;
    }
    GMPortCharacterEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { player: '', newPlayer: '' } : _a, player = _b.player, newPlayer = _b.newPlayer;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var myPlayer, playerRef, playerRef2, worked, e_1;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        myPlayer = this.player;
                        if (!myPlayer)
                            return [2 /*return*/, this.notConnected()];
                        if (myPlayer.modTier < interfaces_1.ModeratorTier.GameMod)
                            return [2 /*return*/, this.gameError('Lol no.')];
                        playerRef = this.game.playerManager.getPlayer(player);
                        if (playerRef)
                            return [2 /*return*/, this.gameError('That player is online. You cannot port an online player.')];
                        playerRef2 = this.game.playerManager.getPlayer(newPlayer);
                        if (playerRef2)
                            return [2 /*return*/, this.gameError('That player is online. You cannot port an online player.')];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.game.databaseManager.movePlayerToNewId(player, newPlayer)];
                    case 2:
                        worked = _c.sent();
                        if (!worked)
                            return [2 /*return*/, this.gameError('Something went wrong. Probably, one of the names was not a valid player.')];
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _c.sent();
                        return [2 /*return*/, this.gameError('Something bad happened.')];
                    case 4:
                        this.gameMessage("Set " + player + " id to " + newPlayer + ".");
                        return [2 /*return*/];
                }
            });
        });
    };
    return GMPortCharacterEvent;
}(models_1.ServerSocketEvent));
exports.GMPortCharacterEvent = GMPortCharacterEvent;
//# sourceMappingURL=gm.js.map