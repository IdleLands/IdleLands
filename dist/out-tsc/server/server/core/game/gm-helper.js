"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var database_manager_1 = require("./database-manager");
var subscription_manager_1 = require("./subscription-manager");
var models_1 = require("../../../shared/models");
var interfaces_1 = require("../../../shared/interfaces");
var chat_helper_1 = require("./chat-helper");
var player_manager_1 = require("./player-manager");
var festival_manager_1 = require("./festival-manager");
var GMHelper = /** @class */ (function () {
    function GMHelper() {
    }
    GMHelper.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.db.loadSettings()];
                    case 1:
                        _a.settings = _b.sent();
                        if (!this.settings) {
                            this.settings = new models_1.GameSettings();
                            this.save();
                        }
                        this.settings.init();
                        this.subscribeToSettingsChanges();
                        return [2 /*return*/];
                }
            });
        });
    };
    GMHelper.prototype.subscribeToSettingsChanges = function () {
        var _this = this;
        this.subscriptionManager.subscribeToChannel(interfaces_1.Channel.GameSettings, function (_a) {
            var operation = _a.operation, args = _a.args;
            switch (operation) {
                case interfaces_1.ModerationAction.SetMOTD: {
                    _this.setMOTD(args);
                    break;
                }
                case interfaces_1.ModerationAction.ChangeModTier: {
                    _this.changeModTier(args);
                    break;
                }
                case interfaces_1.ModerationAction.StartFestival: {
                    break;
                }
                case interfaces_1.ModerationAction.ToggleMute: {
                    _this.mute(args);
                    break;
                }
            }
        });
    };
    // motd
    GMHelper.prototype.initiateSetMOTD = function (newMOTD) {
        newMOTD = newMOTD || '';
        if (newMOTD) {
            this.chat.sendMessageFromClient({
                message: newMOTD,
                playerName: '☆System'
            });
        }
        this.subscriptionManager.emitToChannel(interfaces_1.Channel.GameSettings, {
            operation: interfaces_1.ModerationAction.SetMOTD, args: { newMOTD: newMOTD }
        });
    };
    GMHelper.prototype.setMOTD = function (_a) {
        var newMOTD = _a.newMOTD;
        this.settings.motd = newMOTD;
        this.save();
    };
    // mute
    GMHelper.prototype.initiateMute = function (playerName, duration) {
        this.subscriptionManager.emitToChannel(interfaces_1.Channel.GameSettings, {
            operation: interfaces_1.ModerationAction.ToggleMute, args: { playerName: playerName, duration: duration }
        });
    };
    GMHelper.prototype.mute = function (_a) {
        var playerName = _a.playerName, duration = _a.duration;
        var player = this.playerManager.getPlayer(playerName);
        if (!player)
            return;
        if (player.modTier)
            return;
        // unmute
        if (duration < 0) {
            player.mutedUntil = 0;
            player.messageCooldown = 0;
            // mute extension
        }
        else if (player.mutedUntil) {
            player.mutedUntil += (1000 * 60 * duration);
            // vanilla mute
        }
        else {
            player.mutedUntil = Date.now() + (1000 * 60 * duration);
        }
        this.playerManager.updatePlayer(player, interfaces_1.PlayerChannelOperation.SpecificUpdate);
    };
    // change mod tier
    GMHelper.prototype.initiateChangeModTier = function (playerName, newTier) {
        this.subscriptionManager.emitToChannel(interfaces_1.Channel.GameSettings, {
            operation: interfaces_1.ModerationAction.ChangeModTier, args: { playerName: playerName, newTier: newTier }
        });
    };
    GMHelper.prototype.changeModTier = function (_a) {
        var playerName = _a.playerName, newTier = _a.newTier;
        var player = this.playerManager.getPlayer(playerName);
        if (!player)
            return;
        player.modTier = newTier;
        this.playerManager.updatePlayer(player, interfaces_1.PlayerChannelOperation.SpecificUpdate);
    };
    // create festival
    GMHelper.prototype.createFestival = function (player, festival) {
        this.festivalManager.startGMFestival(player, festival);
    };
    GMHelper.prototype.save = function () {
        this.db.saveSettings(this.settings);
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", database_manager_1.DatabaseManager)
    ], GMHelper.prototype, "db", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", chat_helper_1.ChatHelper)
    ], GMHelper.prototype, "chat", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", festival_manager_1.FestivalManager)
    ], GMHelper.prototype, "festivalManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", player_manager_1.PlayerManager)
    ], GMHelper.prototype, "playerManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", subscription_manager_1.SubscriptionManager)
    ], GMHelper.prototype, "subscriptionManager", void 0);
    GMHelper = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], GMHelper);
    return GMHelper;
}());
exports.GMHelper = GMHelper;
//# sourceMappingURL=gm-helper.js.map