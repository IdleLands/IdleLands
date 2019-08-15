"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var models_1 = require("../../shared/models");
var interfaces_1 = require("../../shared/interfaces");
var GateRollEvent = /** @class */ (function (_super) {
    tslib_1.__extends(GateRollEvent, _super);
    function GateRollEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.AstralGateRoll;
        _this.description = 'Roll an Astral Gate event.';
        _this.args = 'astralGateName, numRolls';
        return _this;
    }
    GateRollEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { astralGateName: '', numRolls: 0 } : _a, astralGateName = _b.astralGateName, numRolls = _b.numRolls;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, rollRewards;
            return tslib_1.__generator(this, function (_c) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                if (numRolls !== 1 && numRolls !== 10)
                    return [2 /*return*/, this.gameError('Invalid number of rolls specified.')];
                rollRewards = player.$premium.doGachaRoll(player, astralGateName, numRolls);
                if (!rollRewards)
                    return [2 /*return*/, this.gameError('You do not have enough currency to do that roll!')];
                this.emit(interfaces_1.ServerEventName.AstralGateRewards, { rewards: rollRewards });
                this.game.updatePlayer(player);
                return [2 /*return*/];
            });
        });
    };
    return GateRollEvent;
}(models_1.ServerSocketEvent));
exports.GateRollEvent = GateRollEvent;
//# sourceMappingURL=gacha.js.map