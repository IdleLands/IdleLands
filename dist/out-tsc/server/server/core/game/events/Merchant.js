"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var models_1 = require("../../../../shared/models");
var interfaces_1 = require("../../../../shared/interfaces");
var Merchant = /** @class */ (function (_super) {
    tslib_1.__extends(Merchant, _super);
    function Merchant() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Merchant.prototype.doChoice = function (eventManager, player, choice, valueChosen) {
        var item = new models_1.Item();
        item.init(choice.extraData.item);
        var isEnchant = choice.extraData.item.type === 'enchant';
        var cost = choice.extraData.cost;
        switch (valueChosen) {
            case 'Yes': {
                if (player.gold < cost) {
                    eventManager.errorMessage(player, 'You cannot currently afford this.');
                    return false;
                }
                player.spendGold(cost);
                if (isEnchant) {
                    player.increaseStatistic("Event/Enchant/Buy", 1);
                    eventManager.doEventFor(player, interfaces_1.EventName.Enchant);
                    eventManager.successMessage(player, "You bought an enchantment.");
                }
                else {
                    player.equip(item, false);
                    eventManager.successMessage(player, "You bought \"" + item.name + "\" and equipped it.");
                }
                return true;
            }
            case 'No': {
                return true;
            }
            case 'Compare': {
                if (isEnchant) {
                    eventManager.errorMessage(player, 'Cannot compare with an enchantment. Stop hacking.');
                    return false;
                }
                player.emit(interfaces_1.ServerEventName.ItemCompare, {
                    choiceId: choice.id,
                    newItem: item,
                    currentItem: player.$inventory.itemInEquipmentSlot(item.type)
                });
                return false;
            }
            case 'Inventory': {
                if (player.gold < cost || isEnchant) {
                    eventManager.errorMessage(player, 'You cannot currently afford this.');
                    return false;
                }
                player.spendGold(cost);
                player.alwaysTryAddToInventory(item);
                eventManager.successMessage(player, "You bought \"" + item.name + "\" and sent it to your inventory.");
                return true;
            }
        }
    };
    Merchant.prototype.operateOn = function (player) {
        var item = null;
        var cost = 0;
        var choices = ['Yes', 'No'];
        var pickableChoices = ['Yes', 'No'];
        if (this.rng.likelihood(10)) {
            player.increaseStatistic("Event/Merchant/Enchant", 1);
            item = { name: 'Enchantment', score: 1, type: 'enchant', fullName: function () { return 'enchantment'; } };
            var baseCostFivePercent = Math.floor(player.gold * 0.05);
            cost = this.rng.numberInRange(baseCostFivePercent * 2, baseCostFivePercent * 3);
        }
        else {
            player.increaseStatistic("Event/Merchant/Item", 1);
            choices = ['Yes', 'No', 'Compare', 'Inventory'];
            pickableChoices = ['Yes', 'No', 'Inventory'];
            item = this.itemGenerator.generateItemForPlayer(player, { qualityBoost: 1 });
            if (!item) {
                player.increaseStatistic("Event/Merchant/Nothing", 1);
                return;
            }
            cost = item.score * 7;
        }
        var choice = this.getChoice({
            desc: "\n        Would you like to buy \"" + item.name + "\" (Score: " + item.score.toLocaleString() + ", Type: " + item.type + ") for " + cost.toLocaleString() + " gold?\n      ",
            choices: choices,
            defaultChoice: player.getDefaultChoice(pickableChoices),
            extraData: {
                item: item,
                cost: cost
            }
        });
        player.$choices.addChoice(player, choice);
        var eventText = this.eventText(interfaces_1.EventMessageType.Merchant, player, { item: item.fullName(), shopGold: cost });
        this.emitMessage([player], eventText, interfaces_1.AdventureLogEventType.Item);
    };
    Merchant.WEIGHT = 45;
    return Merchant;
}(Event_1.Event));
exports.Merchant = Merchant;
//# sourceMappingURL=Merchant.js.map