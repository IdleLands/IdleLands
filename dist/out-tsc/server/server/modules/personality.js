"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../shared/interfaces");
var models_1 = require("../../shared/models");
var TogglePersonalityEvent = /** @class */ (function (_super) {
    tslib_1.__extends(TogglePersonalityEvent, _super);
    function TogglePersonalityEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.TogglePersonality;
        _this.description = 'Toggle a personality.';
        _this.args = 'personalityName';
        return _this;
    }
    TogglePersonalityEvent.prototype.callback = function (_a) {
        var personalityName = (_a === void 0 ? { personalityName: '' } : _a).personalityName;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, didSucceed;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                didSucceed = player.togglePersonality(personalityName);
                if (!didSucceed)
                    return [2 /*return*/, this.gameError('You are unable to toggle that personality.')];
                this.game.updatePlayer(player);
                this.gameSuccess("Toggled personality \"" + personalityName + "\"!");
                return [2 /*return*/];
            });
        });
    };
    return TogglePersonalityEvent;
}(models_1.ServerSocketEvent));
exports.TogglePersonalityEvent = TogglePersonalityEvent;
//# sourceMappingURL=personality.js.map