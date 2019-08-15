"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Event_1 = require("./Event");
var lodash_1 = require("lodash");
var models_1 = require("../../../../shared/models");
var interfaces_1 = require("../../../../shared/interfaces");
var FindTreasure = /** @class */ (function (_super) {
    tslib_1.__extends(FindTreasure, _super);
    function FindTreasure() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FindTreasure.prototype.operateOn = function (player, opts) {
        if (opts === void 0) { opts = { treasureName: '' }; }
        player.increaseStatistic('Treasure/Total/Touch', 1);
        var curTimer = player.cooldowns[opts.treasureName];
        if (Date.now() < curTimer) {
            player.increaseStatistic('Treasure/Total/Empty', 1);
            /*
            this.emitMessage([player],
              `You could not loot ${opts.treasureName} because it was empty! Check back at %timestamp.`,
              AdventureLogEventType.Explore,
              { timestamp: curTimer });
              */
            return;
        }
        // 30 minute cooldown
        player.cooldowns[opts.treasureName] = Date.now() + (30 * 60 * 1000);
        var _a = this.assetManager.allTreasureAssets, chests = _a.chests, items = _a.items;
        player.increaseStatistic("Treasure/Chest/" + opts.treasureName, 1);
        var treasureItems = chests[opts.treasureName].items;
        var allItemInstances = treasureItems.map(function (itemName) {
            var item = new models_1.Item();
            var baseItem = items[itemName];
            baseItem.name = itemName;
            baseItem.itemClass = interfaces_1.ItemClass.Guardian;
            item.init(baseItem);
            return item;
        });
        var specificItem = lodash_1.sample(allItemInstances);
        player.increaseStatistic('Treasure/Total/ItemsFound', 1);
        player.$$game.eventManager.doEventFor(player, interfaces_1.EventName.FindItem, { fromChest: true, item: specificItem });
    };
    FindTreasure.WEIGHT = 0;
    return FindTreasure;
}(Event_1.Event));
exports.FindTreasure = FindTreasure;
//# sourceMappingURL=FindTreasure.js.map