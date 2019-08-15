"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var database_manager_1 = require("./database-manager");
var entity_1 = require("../../../shared/models/entity");
var interfaces_1 = require("../../../shared/interfaces");
var rng_service_1 = require("./rng-service");
var chat_helper_1 = require("./chat-helper");
var subscription_manager_1 = require("./subscription-manager");
var player_manager_1 = require("./player-manager");
var FestivalManager = /** @class */ (function () {
    function FestivalManager() {
    }
    FestivalManager.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.db.loadFestivals()];
                    case 1:
                        _a.festivals = _b.sent();
                        if (!this.festivals) {
                            this.festivals = new entity_1.Festivals();
                            this.save();
                        }
                        this.festivals.init();
                        this.subscribeToFestivalChanges();
                        return [2 /*return*/];
                }
            });
        });
    };
    FestivalManager.prototype.tick = function () {
        var _this = this;
        this.festivals.festivals.forEach(function (festival) {
            if (_this.isValidFestival(festival))
                return;
            _this.initateRemoveFestival(festival);
        });
    };
    // we store them as integers now, instead of decimals. so 300% isn't stored as 3, it's stored as 300.
    FestivalManager.prototype.getMultiplier = function (stat) {
        return this.festivals.festivals.reduce(function (prev, cur) { return prev += cur.stats[stat] || 0; }, 0) / 100;
    };
    FestivalManager.prototype.isValidFestival = function (festival) {
        return festival.endTime > Date.now();
    };
    FestivalManager.prototype.makeSystemFestival = function (festival) {
        festival.startedBy = "\u2606" + festival.startedBy;
        return festival;
    };
    FestivalManager.prototype.startAscensionFestival = function (player) {
        var _a;
        var endTime = new Date();
        endTime.setDate(endTime.getDate() + 7);
        var festival = this.makeSystemFestival({
            name: player.name + "'s Ascension",
            startedBy: player.name,
            endTime: endTime.getTime(),
            stats: (_a = {},
                _a[interfaces_1.Stat.XP] = player.ascensionLevel,
                _a[interfaces_1.Stat.GOLD] = player.ascensionLevel,
                _a)
        });
        this.initiateAddFestival(festival);
        this.chat.sendMessageFromClient({
            message: "A new festival \"" + festival.name + "\" has started!",
            playerName: '☆System'
        });
    };
    FestivalManager.prototype.startGMFestival = function (player, festival) {
        var addedFestival = this.makeSystemFestival(festival);
        this.initiateAddFestival(addedFestival);
        this.chat.sendMessageFromClient({
            message: "A new festival \"" + addedFestival.name + "\" has started!",
            playerName: "\u2606" + player.name
        });
    };
    FestivalManager.prototype.startFestival = function (player, festival) {
        this.initiateAddFestival(festival);
        this.chat.sendMessageFromClient({
            message: "A new festival \"" + festival.name + "\" has started!",
            playerName: player.name
        });
    };
    FestivalManager.prototype.subscribeToFestivalChanges = function () {
        var _this = this;
        this.subscriptionManager.subscribeToChannel(interfaces_1.Channel.Festivals, function (_a) {
            var festival = _a.festival, operation = _a.operation;
            switch (operation) {
                case interfaces_1.FestivalChannelOperation.Add: {
                    _this.addFestival(festival);
                    break;
                }
                case interfaces_1.FestivalChannelOperation.Remove: {
                    _this.removeFestival(festival);
                    break;
                }
            }
        });
    };
    FestivalManager.prototype.hasFestivalForName = function (name) {
        return this.festivals.festivals.some(function (fest) { return fest.startedBy === name; });
    };
    FestivalManager.prototype.initiateAddFestival = function (festival) {
        if (!festival.id)
            festival.id = this.rng.id();
        // only do this for ILP-created festivals
        // if(this.festivals.festivals.some(fest => fest.startedBy === festival.startedBy && !festival.startedBy.includes('☆'))) return false;
        this.subscriptionManager.emitToChannel(interfaces_1.Channel.Festivals, { festival: festival, operation: interfaces_1.FestivalChannelOperation.Add });
        return true;
    };
    FestivalManager.prototype.initateRemoveFestival = function (festival) {
        this.subscriptionManager.emitToChannel(interfaces_1.Channel.Festivals, { festival: festival, operation: interfaces_1.FestivalChannelOperation.Remove });
    };
    FestivalManager.prototype.addFestival = function (festival) {
        this.festivals.addFestival(festival);
        this.save();
        this.playerManager.allPlayers.forEach(function (player) { return player.recalculateStats(); });
    };
    FestivalManager.prototype.removeFestival = function (festival) {
        this.festivals.removeFestival(festival.id);
        this.save();
        this.playerManager.allPlayers.forEach(function (player) { return player.recalculateStats(); });
    };
    FestivalManager.prototype.save = function () {
        this.db.saveFestivals(this.festivals);
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", database_manager_1.DatabaseManager)
    ], FestivalManager.prototype, "db", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", player_manager_1.PlayerManager)
    ], FestivalManager.prototype, "playerManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", subscription_manager_1.SubscriptionManager)
    ], FestivalManager.prototype, "subscriptionManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", chat_helper_1.ChatHelper)
    ], FestivalManager.prototype, "chat", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", rng_service_1.RNGService)
    ], FestivalManager.prototype, "rng", void 0);
    FestivalManager = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], FestivalManager);
    return FestivalManager;
}());
exports.FestivalManager = FestivalManager;
//# sourceMappingURL=festival-manager.js.map