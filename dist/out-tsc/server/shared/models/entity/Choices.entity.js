"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var lodash_1 = require("lodash");
var PlayerOwned_1 = require("./PlayerOwned");
var Choice_1 = require("../Choice");
var Choices = /** @class */ (function (_super) {
    tslib_1.__extends(Choices, _super);
    function Choices() {
        var _this = _super.call(this) || this;
        if (!_this.choices)
            _this.choices = {};
        return _this;
    }
    Object.defineProperty(Choices.prototype, "$choicesData", {
        get: function () {
            return { choices: this.choices, size: this.size };
        },
        enumerable: true,
        configurable: true
    });
    // basic functions
    Choices.prototype.calcSize = function (player) {
        return player.$statistics.get('Game/Premium/Upgrade/ChoiceLogSize');
    };
    Choices.prototype.removeChoicesOfId = function (id) {
        var _this = this;
        Object.keys(this.choices).forEach(function (key) {
            if (id !== key)
                return;
            delete _this.choices[key];
        });
    };
    Choices.prototype.init = function (player) {
        var _this = this;
        if (lodash_1.isArray(this.choices)) {
            var newChoices_1 = {};
            this.choices.forEach(function (choice) {
                newChoices_1[choice.foundAt] = choice;
            });
            this.choices = newChoices_1;
        }
        this.updateSize(player);
        Object.keys(this.choices).forEach(function (choiceKey) {
            var choice = _this.choices[choiceKey];
            var choiceRef = new Choice_1.Choice();
            choiceRef.init(choice);
            return choiceRef;
        });
        this.removeChoicesOfId('PartyLeave');
    };
    Choices.prototype.updateSize = function (player) {
        this.size = this.calcSize(player);
    };
    Choices.prototype.removeAllChoices = function () {
        this.choices = {};
    };
    Choices.prototype.removeChoice = function (choice) {
        delete this.choices[choice.foundAt];
    };
    Choices.prototype.getChoice = function (choiceId) {
        return lodash_1.find(this.choices, { id: choiceId });
    };
    Choices.prototype.addChoice = function (player, choice) {
        this.choices[choice.foundAt] = choice;
        var allChoiceKeys = Object.keys(this.choices);
        if (allChoiceKeys.length > this.size) {
            var poppedChoice = this.choices[allChoiceKeys[0]];
            player.increaseStatistic("Character/Choose/Ignore", 1);
            this.makeDecision(player, poppedChoice, poppedChoice.choices.indexOf(poppedChoice.defaultChoice));
        }
    };
    Choices.prototype.makeDecision = function (player, choice, decisionSlot, doRemove) {
        if (doRemove === void 0) { doRemove = true; }
        player.increaseStatistic("Character/Choose/Choice/" + choice.choices[decisionSlot], 1);
        player.increaseStatistic("Character/Choose/Total", 1);
        if (player.$personalities.isActive('Affirmer')) {
            player.increaseStatistic("Character/Choose/Personality/Affirmer", 1);
        }
        if (player.$personalities.isActive('Denier')) {
            player.increaseStatistic("Character/Choose/Personality/Denier", 1);
        }
        if (player.$personalities.isActive('Indecisive')) {
            player.increaseStatistic("Character/Choose/Personality/Indecisive", 1);
        }
        if (doRemove)
            this.removeChoice(choice);
    };
    tslib_1.__decorate([
        typeorm_1.ObjectIdColumn(),
        tslib_1.__metadata("design:type", String)
    ], Choices.prototype, "_id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Choices.prototype, "choices", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Choices.prototype, "size", void 0);
    Choices = tslib_1.__decorate([
        typeorm_1.Entity(),
        tslib_1.__metadata("design:paramtypes", [])
    ], Choices);
    return Choices;
}(PlayerOwned_1.PlayerOwned));
exports.Choices = Choices;
//# sourceMappingURL=Choices.entity.js.map