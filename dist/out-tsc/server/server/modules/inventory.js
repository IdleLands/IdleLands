"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../shared/interfaces");
var models_1 = require("../../shared/models");
var UnequipItemEvent = /** @class */ (function (_super) {
    tslib_1.__extends(UnequipItemEvent, _super);
    function UnequipItemEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.ItemUnequip;
        _this.description = 'Unequip an item from your inventory.';
        _this.args = 'itemSlot';
        return _this;
    }
    UnequipItemEvent.prototype.callback = function (_a) {
        var itemSlot = (_a === void 0 ? { itemSlot: '' } : _a).itemSlot;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, item, didSucceed;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                item = player.$inventory.itemInEquipmentSlot(itemSlot);
                if (!item)
                    return [2 /*return*/, this.gameError('You do not have an item in that slot.')];
                didSucceed = player.unequip(item, true);
                if (!didSucceed)
                    return [2 /*return*/, this.gameError('Your inventory is full.')];
                this.game.updatePlayer(player);
                this.gameSuccess("Unequipped " + item.name + "!");
                return [2 /*return*/];
            });
        });
    };
    return UnequipItemEvent;
}(models_1.ServerSocketEvent));
exports.UnequipItemEvent = UnequipItemEvent;
var EquipItemEvent = /** @class */ (function (_super) {
    tslib_1.__extends(EquipItemEvent, _super);
    function EquipItemEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.ItemEquip;
        _this.description = 'Equip an item from your inventory.';
        _this.args = 'itemId';
        return _this;
    }
    EquipItemEvent.prototype.callback = function (_a) {
        var itemId = (_a === void 0 ? { itemId: '' } : _a).itemId;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, foundItem, didSucceed;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                foundItem = player.$inventory.getItemFromInventory(itemId);
                if (!foundItem)
                    return [2 /*return*/, this.gameError('Could not find that item in your inventory.')];
                player.$inventory.removeItemFromInventory(foundItem);
                didSucceed = player.equip(foundItem);
                if (!didSucceed) {
                    player.$inventory.addItemToInventory(foundItem);
                    return [2 /*return*/, this.gameError('Could not equip that item.')];
                }
                this.game.updatePlayer(player);
                this.gameSuccess("Equipped " + foundItem.name + "!");
                return [2 /*return*/];
            });
        });
    };
    return EquipItemEvent;
}(models_1.ServerSocketEvent));
exports.EquipItemEvent = EquipItemEvent;
var SellItemEvent = /** @class */ (function (_super) {
    tslib_1.__extends(SellItemEvent, _super);
    function SellItemEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.ItemSell;
        _this.description = 'Sell an item in your inventory.';
        _this.args = 'itemId';
        return _this;
    }
    SellItemEvent.prototype.callback = function (_a) {
        var itemId = (_a === void 0 ? { itemId: '' } : _a).itemId;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, foundItem, value;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                foundItem = player.$inventory.getItemFromInventory(itemId);
                if (!foundItem)
                    return [2 /*return*/, this.gameError('Could not find that item in your inventory.')];
                if (foundItem.locked)
                    return [2 /*return*/, this.gameError('Item is currently locked. Unlock it to sell it.')];
                value = player.sellItem(foundItem);
                player.$inventory.removeItemFromInventory(foundItem);
                this.game.updatePlayer(player);
                this.gameSuccess("Sold " + foundItem.name + " for " + value.toLocaleString() + " gold!");
                return [2 /*return*/];
            });
        });
    };
    return SellItemEvent;
}(models_1.ServerSocketEvent));
exports.SellItemEvent = SellItemEvent;
var LockItemEvent = /** @class */ (function (_super) {
    tslib_1.__extends(LockItemEvent, _super);
    function LockItemEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.ItemLock;
        _this.description = 'Lock an item in your inventory.';
        _this.args = 'itemId?, itemSlot?';
        return _this;
    }
    LockItemEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { itemId: '', itemSlot: '' } : _a, itemId = _b.itemId, itemSlot = _b.itemSlot;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, foundItem;
            return tslib_1.__generator(this, function (_c) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                if (!itemId && !itemSlot)
                    return [2 /*return*/, this.gameError('Need to specify either itemId or itemSlot')];
                foundItem = null;
                if (itemId) {
                    foundItem = player.$inventory.getItemFromInventory(itemId);
                    if (!foundItem)
                        return [2 /*return*/, this.gameError('Could not find that item in your inventory.')];
                }
                else if (itemSlot) {
                    foundItem = player.$inventory.itemInEquipmentSlot(itemSlot);
                    if (!foundItem)
                        return [2 /*return*/, this.gameError('There is nothing equipped in that slot.')];
                }
                foundItem.locked = true;
                this.game.updatePlayer(player);
                this.gameSuccess("Locked " + foundItem.name + "! It will not be automatically sold or salvaged.");
                return [2 /*return*/];
            });
        });
    };
    return LockItemEvent;
}(models_1.ServerSocketEvent));
exports.LockItemEvent = LockItemEvent;
var UnlockItemEvent = /** @class */ (function (_super) {
    tslib_1.__extends(UnlockItemEvent, _super);
    function UnlockItemEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.ItemUnlock;
        _this.description = 'Unlock an item in your inventory.';
        _this.args = 'itemId?, itemSlot?';
        return _this;
    }
    UnlockItemEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { itemId: '', itemSlot: '' } : _a, itemId = _b.itemId, itemSlot = _b.itemSlot;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, foundItem;
            return tslib_1.__generator(this, function (_c) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                if (!itemId && !itemSlot)
                    return [2 /*return*/, this.gameError('Need to specify either itemId or itemSlot')];
                foundItem = null;
                if (itemId) {
                    foundItem = player.$inventory.getItemFromInventory(itemId);
                    if (!foundItem)
                        return [2 /*return*/, this.gameError('Could not find that item in your inventory.')];
                }
                else if (itemSlot) {
                    foundItem = player.$inventory.itemInEquipmentSlot(itemSlot);
                    if (!foundItem)
                        return [2 /*return*/, this.gameError('There is nothing equipped in that slot.')];
                }
                foundItem.locked = false;
                this.game.updatePlayer(player);
                this.gameSuccess("Unlocked " + foundItem.name + "! It may be automatically sold or salvaged.");
                return [2 /*return*/];
            });
        });
    };
    return UnlockItemEvent;
}(models_1.ServerSocketEvent));
exports.UnlockItemEvent = UnlockItemEvent;
var SellAllEvent = /** @class */ (function (_super) {
    tslib_1.__extends(SellAllEvent, _super);
    function SellAllEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.ItemSellAll;
        _this.description = 'Sell all items in your inventory.';
        _this.args = '';
        return _this;
    }
    SellAllEvent.prototype.callback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a, player, numItems, totalValue, items, removeItems;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                numItems = 0;
                totalValue = 0;
                items = player.$inventory.itemsFromInventory();
                removeItems = [];
                items.forEach(function (item) {
                    if (item.locked)
                        return;
                    var value = player.sellItem(item);
                    removeItems.push(item);
                    numItems++;
                    totalValue += value;
                });
                (_a = player.$inventory).removeItemFromInventory.apply(_a, removeItems);
                this.game.updatePlayer(player);
                this.gameSuccess("Sold " + numItems + " item(s) for " + totalValue.toLocaleString() + " gold!");
                return [2 /*return*/];
            });
        });
    };
    return SellAllEvent;
}(models_1.ServerSocketEvent));
exports.SellAllEvent = SellAllEvent;
var UseTeleportScrollEvent = /** @class */ (function (_super) {
    tslib_1.__extends(UseTeleportScrollEvent, _super);
    function UseTeleportScrollEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.ItemTeleportScroll;
        _this.description = 'Use a teleport scroll in your inventory.';
        _this.args = 'scroll';
        return _this;
    }
    UseTeleportScrollEvent.prototype.callback = function (_a) {
        var scroll = (_a === void 0 ? { scroll: '' } : _a).scroll;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, didWork;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                didWork = player.$inventory.useTeleportScroll(player, scroll);
                if (!didWork)
                    return [2 /*return*/, this.gameError('Could not teleport. You might already be in that region or your scroll count might be 0!')];
                this.game.updatePlayer(player);
                this.gameSuccess("You teleported to " + scroll + "!");
                return [2 /*return*/];
            });
        });
    };
    return UseTeleportScrollEvent;
}(models_1.ServerSocketEvent));
exports.UseTeleportScrollEvent = UseTeleportScrollEvent;
var UseBuffScrollEvent = /** @class */ (function (_super) {
    tslib_1.__extends(UseBuffScrollEvent, _super);
    function UseBuffScrollEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.ItemBuffScroll;
        _this.description = 'Use a booster scroll in your inventory.';
        _this.args = 'scrollId';
        return _this;
    }
    UseBuffScrollEvent.prototype.callback = function (_a) {
        var scrollId = (_a === void 0 ? { scrollId: '' } : _a).scrollId;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, didWork;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                didWork = player.$inventory.useBuffScroll(player, scrollId);
                if (!didWork)
                    return [2 /*return*/, this.gameError('Could not use scroll. It might not be there or is expired!')];
                this.game.updatePlayer(player);
                this.gameSuccess("You used the scroll!");
                return [2 /*return*/];
            });
        });
    };
    return UseBuffScrollEvent;
}(models_1.ServerSocketEvent));
exports.UseBuffScrollEvent = UseBuffScrollEvent;
//# sourceMappingURL=inventory.js.map