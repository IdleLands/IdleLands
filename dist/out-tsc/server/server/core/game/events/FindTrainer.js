"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var interfaces_1 = require("../../../../shared/interfaces");
var FindTrainer = /** @class */ (function (_super) {
    tslib_1.__extends(FindTrainer, _super);
    function FindTrainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FindTrainer.prototype.doChoice = function (eventManager, player, choice, valueChosen) {
        if (valueChosen === 'No')
            return true;
        var professionName = choice.extraData.professionName;
        if (player.profession === professionName)
            return true;
        var profession = this.professionHelper.getProfession(professionName);
        if (!profession)
            return true;
        player.changeProfession(profession);
        player.increaseStatistic("Profession/" + professionName + "/Become", 1);
        player.increaseStatistic("Character/ProfessionChanges", 1);
        return true;
    };
    FindTrainer.prototype.operateOn = function (player, opts) {
        if (opts === void 0) { opts = { professionName: '' }; }
        var checkProf = this.professionHelper.hasProfession(opts.professionName);
        if (!checkProf || opts.professionName === player.profession) {
            player.increaseStatistic("Event/FindTrainer/AlreadyClass", 1);
            this.emitMessage([player], "You met with " + opts.trainerName + ", but you were unable to learn anything new.", interfaces_1.AdventureLogEventType.Profession);
            return;
        }
        var existingChoices = Object.values(player.$choicesData.choices);
        var hasMatchingItem = existingChoices.some(function (x) {
            if (!x.extraData || !x.extraData.professionName)
                return;
            return x.extraData.professionName;
        });
        if (hasMatchingItem)
            return;
        this.emitMessage([player], "You met with " + opts.trainerName + "!", interfaces_1.AdventureLogEventType.Profession);
        var choice = this.getChoice({
            desc: "\n        Would you like to be a " + opts.professionName + "?\n      ",
            choices: ['Yes', 'No'],
            defaultChoice: player.getDefaultChoice(['Yes', 'No']),
            extraData: {
                professionName: opts.professionName
            }
        });
        player.$choices.addChoice(player, choice);
    };
    FindTrainer.WEIGHT = 0;
    return FindTrainer;
}(Event_1.Event));
exports.FindTrainer = FindTrainer;
//# sourceMappingURL=FindTrainer.js.map