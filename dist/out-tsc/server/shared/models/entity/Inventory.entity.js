"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var lodash_1 = require("lodash");
var PlayerOwned_1 = require("./PlayerOwned");
var Item_1 = require("../Item");
var Inventory = /** @class */ (function (_super) {
    tslib_1.__extends(Inventory, _super);
    function Inventory() {
        var _this = _super.call(this) || this;
        if (!_this.equipment)
            _this.equipment = {};
        if (!_this.items)
            _this.items = [];
        if (!_this.teleportScrolls)
            _this.teleportScrolls = {};
        if (!_this.buffScrolls)
            _this.buffScrolls = [];
        return _this;
    }
    Object.defineProperty(Inventory.prototype, "$inventoryData", {
        get: function () {
            return {
                equipment: this.equipment,
                items: this.items,
                size: this.size,
                teleportScrolls: this.teleportScrolls,
                buffScrolls: this.buffScrolls
            };
        },
        enumerable: true,
        configurable: true
    });
    // basic functions
    Inventory.prototype.calcSize = function (player) {
        return player.$statistics.get('Game/Premium/Upgrade/InventorySize');
    };
    Inventory.prototype.init = function (player) {
        var _this = this;
        this.updateSize(player);
        this.items = this.items.map(function (item) {
            var itemRef = new Item_1.Item();
            itemRef.init(item);
            return itemRef;
        });
        Object.keys(this.equipment).forEach(function (itemSlot) {
            if (!_this.equipment[itemSlot] || !_this.equipment[itemSlot].name) {
                _this.equipment[itemSlot] = null;
                return;
            }
            var itemRef = new Item_1.Item();
            itemRef.init(_this.equipment[itemSlot]);
            _this.equipment[itemSlot] = itemRef;
        });
        this.buffScrolls = this.buffScrolls.filter(function (x) { return x.expiresAt > Date.now(); });
    };
    Inventory.prototype.updateSize = function (player) {
        this.size = this.calcSize(player);
    };
    Inventory.prototype.isNeedingNewbieItems = function () {
        return Object.keys(this.equipment).length === 0;
    };
    Inventory.prototype.totalItemScore = function () {
        return lodash_1.sumBy(Object.values(this.equipment), function (item) { return item ? item.score : 0; });
    };
    // equipment-related functions
    Inventory.prototype.itemInEquipmentSlot = function (slot) {
        return this.equipment[slot];
    };
    Inventory.prototype.equipItem = function (item) {
        if (!item)
            return;
        if (!item.type)
            throw new Error("Item " + JSON.stringify(item) + " has no type so it cannot be equipped.");
        this.equipment = this.equipment || {};
        this.equipment[item.type] = item;
    };
    Inventory.prototype.unequipItem = function (item) {
        if (!item)
            return;
        var itemExisting = this.itemInEquipmentSlot(item.type);
        if (item !== itemExisting)
            throw new Error("Could not unequip " + item.name + " since it is not equipped.");
        this.equipment[item.type] = null;
    };
    // inventory-related functions
    Inventory.prototype.canAddItemsToInventory = function () {
        return this.items.length < this.size;
    };
    Inventory.prototype.addItemToInventory = function (item) {
        if (!this.canAddItemsToInventory())
            return;
        this.items = this.items || [];
        this.items.push(item);
    };
    Inventory.prototype.removeItemFromInventory = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        lodash_1.pull.apply(void 0, [this.items].concat(items));
    };
    Inventory.prototype.getItemFromInventory = function (itemId) {
        return lodash_1.find(this.items, { id: itemId });
    };
    Inventory.prototype.itemsFromInventory = function () {
        return this.items;
    };
    Inventory.prototype.unlockedItems = function () {
        return this.items.filter(function (item) { return !item.locked; });
    };
    Inventory.prototype.clearInventory = function () {
        this.items = [];
    };
    Inventory.prototype.addTeleportScroll = function (scroll) {
        this.teleportScrolls[scroll] = this.teleportScrolls[scroll] || 0;
        this.teleportScrolls[scroll]++;
    };
    Inventory.prototype.useTeleportScroll = function (player, scroll) {
        if (this.teleportScrolls[scroll] <= 0 || player.region === scroll)
            return false;
        player.$$game.movementHelper.doTeleport(player, { toLoc: scroll });
        player.increaseStatistic('Item/Use/TeleportScroll', 1);
        this.teleportScrolls[scroll]--;
        return true;
    };
    Inventory.prototype.addBuffScroll = function (scroll) {
        this.buffScrolls.push(scroll);
    };
    Inventory.prototype.useBuffScroll = function (player, scrollId) {
        var scroll = lodash_1.find(this.buffScrolls, { id: scrollId });
        if (!scroll || scroll.expiresAt < Date.now())
            return false;
        player.addBuff({
            booster: true,
            name: scroll.name,
            statistic: 'Character/Ticks',
            duration: Math.max(720, (720 * player.$statistics.get('Game/Premium/Upgrade/BuffScrollDuration'))),
            stats: scroll.stats
        });
        player.increaseStatistic('Item/Use/BuffScroll', 1);
        lodash_1.pull(this.buffScrolls, scroll);
        return true;
    };
    tslib_1.__decorate([
        typeorm_1.ObjectIdColumn(),
        tslib_1.__metadata("design:type", String)
    ], Inventory.prototype, "_id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Inventory.prototype, "equipment", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Array)
    ], Inventory.prototype, "items", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], Inventory.prototype, "size", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Object)
    ], Inventory.prototype, "teleportScrolls", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Array)
    ], Inventory.prototype, "buffScrolls", void 0);
    Inventory = tslib_1.__decorate([
        typeorm_1.Entity(),
        tslib_1.__metadata("design:paramtypes", [])
    ], Inventory);
    return Inventory;
}(PlayerOwned_1.PlayerOwned));
exports.Inventory = Inventory;
//# sourceMappingURL=Inventory.entity.js.map