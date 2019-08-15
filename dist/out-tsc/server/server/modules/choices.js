"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var models_1 = require("../../shared/models");
var interfaces_1 = require("../../shared/interfaces");
var MakeChoiceEvent = /** @class */ (function (_super) {
    tslib_1.__extends(MakeChoiceEvent, _super);
    function MakeChoiceEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.ChoiceMake;
        _this.description = 'Make a choice.';
        _this.args = 'choiceId, valueChosen';
        return _this;
    }
    MakeChoiceEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { choiceId: '', valueChosen: '' } : _a, choiceId = _b.choiceId, valueChosen = _b.valueChosen;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, choice, foundChoice;
            return tslib_1.__generator(this, function (_c) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                choice = player.$choices.getChoice(choiceId);
                if (!choice)
                    return [2 /*return*/, this.gameError('Could not find choice.')];
                foundChoice = choice.choices.indexOf(valueChosen);
                if (foundChoice === -1)
                    return [2 /*return*/, this.gameError('Invalid decision for choice.')];
                player.doChoice(choice, foundChoice);
                this.game.updatePlayer(player);
                return [2 /*return*/];
            });
        });
    };
    return MakeChoiceEvent;
}(models_1.ServerSocketEvent));
exports.MakeChoiceEvent = MakeChoiceEvent;
//# sourceMappingURL=choices.js.map