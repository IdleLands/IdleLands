"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var models_1 = require("../../../../shared/models");
var interfaces_1 = require("../../../../shared/interfaces");
var FindItem = /** @class */ (function (_super) {
    tslib_1.__extends(FindItem, _super);
    function FindItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FindItem.prototype.doChoice = function (eventManager, player, choice, valueChosen) {
        var item = new models_1.Item();
        item.init(choice.extraData.item);
        switch (valueChosen) {
            case 'Yes': {
                player.equip(item, false);
                eventManager.successMessage(player, "You equipped the \"" + item.fullName() + "\" successfully.");
                return true;
            }
            case 'No': {
                player.alwaysTryAddToInventory(item);
                eventManager.successMessage(player, "You sent the \"" + item.fullName() + "\" to your inventory.");
                return true;
            }
            case 'Compare': {
                player.emit(interfaces_1.ServerEventName.ItemCompare, {
                    choiceId: choice.id,
                    newItem: item,
                    currentItem: player.$inventory.itemInEquipmentSlot(item.type)
                });
                return false;
            }
            case 'Sell': {
                var value = player.sellItem(item);
                eventManager.successMessage(player, "You sold the \"" + item.fullName() + "\" for " + value.toLocaleString() + " gold.");
                return true;
            }
        }
    };
    FindItem.prototype.operateOn = function (player, opts) {
        if (opts === void 0) { opts = { item: null, fromPet: false, fromGuardian: false, fromPillage: false, fromChest: false }; }
        var item = opts.item || this.itemGenerator.generateItemForPlayer(player);
        if (!item) {
            player.increaseStatistic("Event/FindItem/Nothing", 1);
            return;
        }
        if (opts.item) {
            var existingChoices = Object.values(player.$choicesData.choices);
            var hasMatchingItem = existingChoices.some(function (x) {
                if (!x.extraData || !x.extraData.item)
                    return;
                return x.extraData.item.name === opts.item.name;
            });
            if (hasMatchingItem) {
                player.increaseStatistic("Event/FindItem/Duplicate", 1);
                return;
            }
        }
        var choice = this.getChoice({
            desc: "Would you like to equip \"" + item.name + "\" (Score: " + item.score.toLocaleString() + ", Type: " + item.type + ")?",
            choices: ['Yes', 'No', 'Compare', 'Sell'],
            defaultChoice: player.getDefaultChoice(['Yes', 'No', 'Sell']),
            extraData: {
                item: item
            }
        });
        var autoEquipPersonalities = [
            { name: 'Strong', stat: interfaces_1.Stat.STR },
            { name: 'Intelligent', stat: interfaces_1.Stat.INT },
            { name: 'Fortuitous', stat: interfaces_1.Stat.CON },
            { name: 'Dextrous', stat: interfaces_1.Stat.DEX },
            { name: 'Agile', stat: interfaces_1.Stat.AGI },
            { name: 'Lucky', stat: interfaces_1.Stat.LUK }
        ];
        var didAutoEquip = autoEquipPersonalities.some(function (_a) {
            var name = _a.name, stat = _a.stat;
            if (!player.$personalities.isActive(name))
                return false;
            var currentItem = player.$inventory.itemInEquipmentSlot(item.type);
            if (!currentItem)
                return true;
            if (!item.stats[stat])
                return false;
            if (item.stats[stat] <= currentItem.stats[stat])
                return false;
            return true;
        });
        if (didAutoEquip) {
            this.doChoice(player.$$game.eventManager, player, choice, 'Yes');
        }
        else {
            player.$choices.addChoice(player, choice);
        }
        var chestText = opts.fromChest
            ? this._parseText("%player found %item in a treasure chest!", player, { item: item.fullName() })
            : '';
        var guardianText = opts.fromGuardian
            ? this._parseText("%player found %item on the carcass of a Realm Guardian!", player, { item: item.fullName() })
            : '';
        var pillageText = opts.fromPillage
            ? this._parseText("%player pillaged %item from a nearby town!", player, { item: item.fullName() })
            : '';
        var petText = opts.fromPet
            ? this._parseText(player.$pets.$activePet.name + " found %item while digging around!", player, { item: item.fullName() })
            : '';
        var eventText = chestText
            || guardianText
            || pillageText
            || petText
            || this.eventText(interfaces_1.EventMessageType.FindItem, player, { item: item.fullName() });
        this.emitMessage([player], eventText, interfaces_1.AdventureLogEventType.Item);
    };
    FindItem.WEIGHT = 30;
    return FindItem;
}(Event_1.Event));
exports.FindItem = FindItem;
//# sourceMappingURL=FindItem.js.map