"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var rng_service_1 = require("./rng-service");
var Events = require("../game/events");
var player_manager_1 = require("./player-manager");
var interfaces_1 = require("../../../shared/interfaces");
var logger_1 = require("../logger");
var subscription_manager_1 = require("./subscription-manager");
var EVENT_TICKS = process.env.NODE_ENV === 'production' ? { min: 25, max: 35 } : { min: 3, max: 5 };
var EventManager = /** @class */ (function () {
    function EventManager() {
    }
    EventManager.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this.subscriptionManager.subscribeToChannel(interfaces_1.Channel.PlayerEvent, function (_a) {
                    var playerNames = _a.playerNames, gainedStats = _a.gainedStats;
                    playerNames.forEach(function (playerName) {
                        var player = _this.playerManager.getPlayer(playerName);
                        if (!player)
                            return;
                        if (gainedStats[interfaces_1.Stat.XP])
                            player.gainXP(gainedStats[interfaces_1.Stat.XP], false);
                        if (gainedStats[interfaces_1.Stat.GOLD])
                            player.gainGold(gainedStats[interfaces_1.Stat.GOLD], false);
                    });
                });
                return [2 /*return*/];
            });
        });
    };
    EventManager.prototype.emitStatGainsToPlayers = function (playerNames, gainedStats) {
        this.subscriptionManager.emitToChannel(interfaces_1.Channel.PlayerEvent, { playerNames: playerNames, gainedStats: gainedStats });
    };
    EventManager.prototype.tryToDoEventFor = function (player) {
        if (player.eventSteps > 0) {
            player.eventSteps--;
            return;
        }
        player.eventSteps = this.rng.chance.integer(EVENT_TICKS);
        var events = Object.keys(Events);
        var weights = events.map(function (x) {
            if (x === 'PartyLeave' && player.$party)
                return 15;
            return Events[x].WEIGHT;
        });
        var chosenEventName = this.rng.chance.weighted(events, weights);
        this.doEventFor(player, chosenEventName);
    };
    EventManager.prototype.doEventFor = function (player, eventName, opts) {
        if (opts === void 0) { opts = {}; }
        if (!Events[eventName]) {
            this.logger.error("EventManager", "Event type " + eventName + " is invalid.");
            return;
        }
        player.increaseStatistic("Character/Events", 1);
        player.increaseStatistic("Event/" + eventName + "/Times", 1);
        var event = new Events[eventName]();
        event.operateOn(player, opts);
    };
    EventManager.prototype.successMessage = function (player, message) {
        this.playerManager.emitToPlayer(player.name, interfaces_1.ServerEventName.GameMessage, { message: message, type: 'success' });
    };
    EventManager.prototype.errorMessage = function (player, message) {
        this.playerManager.emitToPlayer(player.name, interfaces_1.ServerEventName.GameMessage, { message: message, type: 'danger' });
    };
    EventManager.prototype.doChoiceFor = function (player, choice, decision) {
        var event = new Events[choice.event]();
        return event.doChoice(this, player, choice, decision);
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", rng_service_1.RNGService)
    ], EventManager.prototype, "rng", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", player_manager_1.PlayerManager)
    ], EventManager.prototype, "playerManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", subscription_manager_1.SubscriptionManager)
    ], EventManager.prototype, "subscriptionManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", logger_1.Logger)
    ], EventManager.prototype, "logger", void 0);
    EventManager = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], EventManager);
    return EventManager;
}());
exports.EventManager = EventManager;
//# sourceMappingURL=event-manager.js.map