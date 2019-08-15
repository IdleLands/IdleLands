"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var models_1 = require("../../shared/models");
var interfaces_1 = require("../../shared/interfaces");
var PremiumUpgradeEvent = /** @class */ (function (_super) {
    tslib_1.__extends(PremiumUpgradeEvent, _super);
    function PremiumUpgradeEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PremiumUpgrade;
        _this.description = 'Buy a premium upgrade using ILP.';
        _this.args = 'upgradeName';
        return _this;
    }
    PremiumUpgradeEvent.prototype.callback = function (_a) {
        var upgradeName = (_a === void 0 ? { upgradeName: '' } : _a).upgradeName;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, didUpgrade;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                didUpgrade = player.$premium.buyUpgrade(upgradeName);
                if (!didUpgrade)
                    return [2 /*return*/, this.gameError('You do not have enough ILP to buy that upgrade.')];
                player.syncPremium();
                this.gameMessage('Successfully upgraded yourself!');
                this.game.updatePlayer(player);
                return [2 /*return*/];
            });
        });
    };
    return PremiumUpgradeEvent;
}(models_1.ServerSocketEvent));
exports.PremiumUpgradeEvent = PremiumUpgradeEvent;
var PremiumFestivalEvent = /** @class */ (function (_super) {
    tslib_1.__extends(PremiumFestivalEvent, _super);
    function PremiumFestivalEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PremiumFestival;
        _this.description = 'Buy a premium festival using ILP.';
        _this.args = 'festivalType, duration';
        return _this;
    }
    PremiumFestivalEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { festivalType: '', duration: 0 } : _a, festivalType = _b.festivalType, duration = _b.duration;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, didBuy;
            return tslib_1.__generator(this, function (_c) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                didBuy = player.$premium.buyFestival(player, festivalType, duration);
                if (!didBuy)
                    return [2 /*return*/, this.gameError('You do not have enough ILP to buy that festival, or you have one going already.')];
                player.syncPremium();
                this.gameMessage('Successfully bought a festival!');
                this.game.updatePlayer(player);
                return [2 /*return*/];
            });
        });
    };
    return PremiumFestivalEvent;
}(models_1.ServerSocketEvent));
exports.PremiumFestivalEvent = PremiumFestivalEvent;
var PremiumOtherEvent = /** @class */ (function (_super) {
    tslib_1.__extends(PremiumOtherEvent, _super);
    function PremiumOtherEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PremiumOther;
        _this.description = 'Buy an "other" premium item using ILP.';
        _this.args = 'other';
        return _this;
    }
    PremiumOtherEvent.prototype.callback = function (_a) {
        var other = (_a === void 0 ? { other: '' } : _a).other;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, didBuy;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                didBuy = player.$premium.buyOther(player, other);
                if (!didBuy)
                    return [2 /*return*/, this.gameError('You do not have enough ILP to buy that, or an error occurred.')];
                player.syncPremium();
                this.gameMessage('Successfully bought that thing!');
                this.game.updatePlayer(player);
                return [2 /*return*/];
            });
        });
    };
    return PremiumOtherEvent;
}(models_1.ServerSocketEvent));
exports.PremiumOtherEvent = PremiumOtherEvent;
//# sourceMappingURL=premium.js.map