"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var interfaces_1 = require("../../../shared/interfaces");
var subscription_manager_1 = require("./subscription-manager");
var player_manager_1 = require("./player-manager");
var BuffManager = /** @class */ (function () {
    function BuffManager() {
    }
    BuffManager.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.subscribeToBuffs();
                return [2 /*return*/];
            });
        });
    };
    BuffManager.prototype.subscribeToBuffs = function () {
        var _this = this;
        this.subscriptionManager.subscribeToChannel(interfaces_1.Channel.PlayerBuff, function (_a) {
            var memberNames = _a.memberNames, buff = _a.buff, cure = _a.cure;
            memberNames.forEach(function (memberName) {
                var player = _this.playerManager.getPlayer(memberName);
                if (!player)
                    return;
                if (buff) {
                    player.addBuff(buff);
                }
                if (cure) {
                    player.cureInjury();
                }
            });
        });
    };
    BuffManager.prototype.shareBuff = function (player, buff) {
        if (!player.$party)
            return;
        this.subscriptionManager.emitToChannel(interfaces_1.Channel.PlayerBuff, {
            memberNames: player.$party.members.filter(function (x) { return x !== player.name; }),
            buff: buff
        });
    };
    BuffManager.prototype.cureInjury = function (player) {
        if (!player.$party)
            return;
        this.subscriptionManager.emitToChannel(interfaces_1.Channel.PlayerBuff, {
            memberNames: player.$party.members.filter(function (x) { return x !== player.name; }),
            cure: true
        });
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", player_manager_1.PlayerManager)
    ], BuffManager.prototype, "playerManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", subscription_manager_1.SubscriptionManager)
    ], BuffManager.prototype, "subscriptionManager", void 0);
    BuffManager = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], BuffManager);
    return BuffManager;
}());
exports.BuffManager = BuffManager;
//# sourceMappingURL=buff-manager.js.map