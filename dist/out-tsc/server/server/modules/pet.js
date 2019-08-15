"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var models_1 = require("../../shared/models");
var interfaces_1 = require("../../shared/interfaces");
var PetOOCAbilityEvent = /** @class */ (function (_super) {
    tslib_1.__extends(PetOOCAbilityEvent, _super);
    function PetOOCAbilityEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PetOOCAction;
        _this.description = 'Execute your pets OOC action.';
        _this.args = '';
        return _this;
    }
    PetOOCAbilityEvent.prototype.callback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, msg;
            return tslib_1.__generator(this, function (_a) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                if (player.stamina.total < player.$pets.$activePet.$attribute.oocAbilityCost)
                    return [2 /*return*/, this.gameError('You do not have enough stamina!')];
                msg = player.petOOCAction();
                this.gameMessage(msg);
                this.game.updatePlayer(player);
                return [2 /*return*/];
            });
        });
    };
    return PetOOCAbilityEvent;
}(models_1.ServerSocketEvent));
exports.PetOOCAbilityEvent = PetOOCAbilityEvent;
var PetUpgradeEvent = /** @class */ (function (_super) {
    tslib_1.__extends(PetUpgradeEvent, _super);
    function PetUpgradeEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PetUpgrade;
        _this.description = 'Upgrade one of your pets qualities.';
        _this.args = 'petUpgrade';
        return _this;
    }
    PetUpgradeEvent.prototype.callback = function (_a) {
        var petUpgrade = (_a === void 0 ? { petUpgrade: '' } : _a).petUpgrade;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, upgrade;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                upgrade = player.$pets.$activePet.$nextUpgrade[petUpgrade];
                if (!upgrade)
                    return [2 /*return*/, this.gameError('That upgrade level does not exist!')];
                if (player.gold < upgrade.c)
                    return [2 /*return*/, this.gameError('You do not have enough gold to do that upgrade!')];
                if (upgrade.a && player.$pets.$activePet.rating < upgrade.a)
                    return [2 /*return*/, this.gameError('Your pet is not ascended enough for that upgrade!')];
                player.$pets.upgradePet(player, petUpgrade);
                this.gameMessage('Upgraded your pet!');
                this.game.updatePlayer(player);
                return [2 /*return*/];
            });
        });
    };
    return PetUpgradeEvent;
}(models_1.ServerSocketEvent));
exports.PetUpgradeEvent = PetUpgradeEvent;
var BuyPetEvent = /** @class */ (function (_super) {
    tslib_1.__extends(BuyPetEvent, _super);
    function BuyPetEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PetBuy;
        _this.description = 'Buy a new pet.';
        _this.args = 'petType';
        return _this;
    }
    BuyPetEvent.prototype.callback = function (_a) {
        var petType = (_a === void 0 ? { petType: '' } : _a).petType;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, buyPet;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                buyPet = player.$pets.$petsData.buyablePets[petType];
                if (!buyPet)
                    return [2 /*return*/, this.gameError('That pet is not for sale!')];
                if (player.gold < buyPet)
                    return [2 /*return*/, this.gameError('You do not have enough gold to do that upgrade!')];
                player.$pets.buyPet(player, petType);
                this.gameMessage("Bought a new " + petType + "!");
                this.game.updatePlayer(player);
                return [2 /*return*/];
            });
        });
    };
    return BuyPetEvent;
}(models_1.ServerSocketEvent));
exports.BuyPetEvent = BuyPetEvent;
var SwapPetEvent = /** @class */ (function (_super) {
    tslib_1.__extends(SwapPetEvent, _super);
    function SwapPetEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PetSwap;
        _this.description = 'Swap to a different pet.';
        _this.args = 'petType';
        return _this;
    }
    SwapPetEvent.prototype.callback = function (_a) {
        var petType = (_a === void 0 ? { petType: '' } : _a).petType;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, hasPet;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                hasPet = player.$pets.$petsData.allPets[petType];
                if (!hasPet)
                    return [2 /*return*/, this.gameError('You do not have that kind of pet available.')];
                player.$pets.setActivePet(petType);
                this.game.updatePlayer(player);
                return [2 /*return*/];
            });
        });
    };
    return SwapPetEvent;
}(models_1.ServerSocketEvent));
exports.SwapPetEvent = SwapPetEvent;
var PetEquipItemEvent = /** @class */ (function (_super) {
    tslib_1.__extends(PetEquipItemEvent, _super);
    function PetEquipItemEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PetEquip;
        _this.description = 'Equip an item from your inventory to your pet.';
        _this.args = 'itemId, unequipId?, unequipSlot';
        return _this;
    }
    PetEquipItemEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { itemId: '', unequipId: '', unequipSlot: '' } : _a, itemId = _b.itemId, unequipId = _b.unequipId, unequipSlot = _b.unequipSlot;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, invHasSpace, item, didUnequip, foundItem, didSucceed;
            return tslib_1.__generator(this, function (_c) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                if (unequipId && unequipSlot) {
                    invHasSpace = player.$inventory.canAddItemsToInventory();
                    if (!invHasSpace)
                        return [2 /*return*/, this.gameError('Your inventory is full.')];
                    item = player.$pets.$activePet.findEquippedItemById(unequipSlot, unequipId);
                    if (!item)
                        return [2 /*return*/, this.gameError('That item is not equipped to your pet.')];
                    didUnequip = player.$pets.$activePet.unequip(item);
                    if (!didUnequip)
                        return [2 /*return*/, this.gameError('You could not unequip that item.')];
                    player.$inventory.addItemToInventory(item);
                }
                foundItem = player.$inventory.getItemFromInventory(itemId);
                if (!foundItem)
                    return [2 /*return*/, this.gameError('Could not find that item in your inventory.')];
                didSucceed = player.$pets.$activePet.equip(foundItem);
                if (!didSucceed)
                    return [2 /*return*/, this.gameError('Could not equip that item.')];
                player.$inventory.removeItemFromInventory(foundItem);
                this.game.updatePlayer(player);
                this.gameSuccess("Equipped " + foundItem.name + " to your pet!");
                return [2 /*return*/];
            });
        });
    };
    return PetEquipItemEvent;
}(models_1.ServerSocketEvent));
exports.PetEquipItemEvent = PetEquipItemEvent;
var PetUnequipItemEvent = /** @class */ (function (_super) {
    tslib_1.__extends(PetUnequipItemEvent, _super);
    function PetUnequipItemEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PetUnequip;
        _this.description = 'Unequip an item from your pet.';
        _this.args = 'itemSlot, itemId';
        return _this;
    }
    PetUnequipItemEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { itemSlot: '', itemId: '' } : _a, itemSlot = _b.itemSlot, itemId = _b.itemId;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, invHasSpace, item, didSucceed;
            return tslib_1.__generator(this, function (_c) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                invHasSpace = player.$inventory.canAddItemsToInventory();
                if (!invHasSpace)
                    return [2 /*return*/, this.gameError('Your inventory is full.')];
                item = player.$pets.$activePet.findEquippedItemById(itemSlot, itemId);
                if (!item)
                    return [2 /*return*/, this.gameError('That item is not equipped to your pet.')];
                didSucceed = player.$pets.$activePet.unequip(item);
                if (!didSucceed)
                    return [2 /*return*/, this.gameError('You could not unequip that item.')];
                player.$inventory.addItemToInventory(item);
                this.game.updatePlayer(player);
                this.gameSuccess("Unequipped " + item.name + " from your pet!");
                return [2 /*return*/];
            });
        });
    };
    return PetUnequipItemEvent;
}(models_1.ServerSocketEvent));
exports.PetUnequipItemEvent = PetUnequipItemEvent;
var PetAscendEvent = /** @class */ (function (_super) {
    tslib_1.__extends(PetAscendEvent, _super);
    function PetAscendEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PetAscend;
        _this.description = 'Ascend your pet.';
        _this.args = '';
        return _this;
    }
    PetAscendEvent.prototype.callback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, didSucceed;
            return tslib_1.__generator(this, function (_a) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                didSucceed = player.$pets.ascend(player);
                if (!didSucceed)
                    return [2 /*return*/, this.gameError('Could not ascend.')];
                this.game.updatePlayer(player);
                this.gameSuccess("Your pet has ascended!");
                return [2 /*return*/];
            });
        });
    };
    return PetAscendEvent;
}(models_1.ServerSocketEvent));
exports.PetAscendEvent = PetAscendEvent;
var PetAdventureEmbarkEvent = /** @class */ (function (_super) {
    tslib_1.__extends(PetAdventureEmbarkEvent, _super);
    function PetAdventureEmbarkEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PetAdventureEmbark;
        _this.description = 'Send your pets on an adventure.';
        _this.args = 'adventureId, petIds';
        return _this;
    }
    PetAdventureEmbarkEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { adventureId: '', petIds: [] } : _a, adventureId = _b.adventureId, petIds = _b.petIds;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, didSucceed;
            return tslib_1.__generator(this, function (_c) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                didSucceed = player.$pets.embarkOnPetMission(player, adventureId, petIds);
                if (!didSucceed)
                    return [2 /*return*/, this.gameError('Could not embark on that mission.')];
                this.game.updatePlayer(player);
                this.gameSuccess("You've sent your pets off on another wacky adventure!");
                return [2 /*return*/];
            });
        });
    };
    return PetAdventureEmbarkEvent;
}(models_1.ServerSocketEvent));
exports.PetAdventureEmbarkEvent = PetAdventureEmbarkEvent;
var PetAdventureCollectEvent = /** @class */ (function (_super) {
    tslib_1.__extends(PetAdventureCollectEvent, _super);
    function PetAdventureCollectEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PetAdventureFinish;
        _this.description = 'Collect your pets and rewards from an adventure.';
        _this.args = 'adventureId';
        return _this;
    }
    PetAdventureCollectEvent.prototype.callback = function (_a) {
        var adventureId = (_a === void 0 ? { adventureId: '' } : _a).adventureId;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, rewards;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                rewards = player.$pets.cashInMission(player, adventureId);
                if (!rewards)
                    return [2 /*return*/, this.gameError('Could not collect from that mission.')];
                this.emit(interfaces_1.ServerEventName.PetAdventureRewards, rewards);
                this.game.updatePlayer(player);
                this.gameSuccess("You've collected your rewards and pets from their adventure!");
                return [2 /*return*/];
            });
        });
    };
    return PetAdventureCollectEvent;
}(models_1.ServerSocketEvent));
exports.PetAdventureCollectEvent = PetAdventureCollectEvent;
var PetGoldTakeEvent = /** @class */ (function (_super) {
    tslib_1.__extends(PetGoldTakeEvent, _super);
    function PetGoldTakeEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PetGoldAction;
        _this.description = 'Take gold from your pet.';
        _this.args = '';
        return _this;
    }
    PetGoldTakeEvent.prototype.callback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, pet, gold;
            return tslib_1.__generator(this, function (_a) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                pet = player.$pets.$activePet;
                gold = pet.gold.total;
                if (gold === 0)
                    return [2 /*return*/, this.gameError('Your pet does not have any gold, you monster!')];
                player.gainGold(gold, false);
                pet.gold.set(0);
                this.gameMessage("You took " + gold.toLocaleString() + " gold from your pet.");
                this.game.updatePlayer(player);
                return [2 /*return*/];
            });
        });
    };
    return PetGoldTakeEvent;
}(models_1.ServerSocketEvent));
exports.PetGoldTakeEvent = PetGoldTakeEvent;
var PetRerollGenderEvent = /** @class */ (function (_super) {
    tslib_1.__extends(PetRerollGenderEvent, _super);
    function PetRerollGenderEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PetRerollGender;
        _this.description = 'Reroll your pets gender.';
        _this.args = '';
        return _this;
    }
    PetRerollGenderEvent.prototype.callback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, pet, gold, newGender;
            return tslib_1.__generator(this, function (_a) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                pet = player.$pets.$activePet;
                gold = player.gold;
                if (gold < 10000)
                    return [2 /*return*/, this.gameError('You do not have enough gold.')];
                player.spendGold(10000);
                newGender = lodash_1.sample(player.availableGenders);
                pet.gender = newGender;
                this.gameMessage("Your pets gender is now " + pet.gender + ".");
                this.game.updatePlayer(player);
                return [2 /*return*/];
            });
        });
    };
    return PetRerollGenderEvent;
}(models_1.ServerSocketEvent));
exports.PetRerollGenderEvent = PetRerollGenderEvent;
var PetRerollNameEvent = /** @class */ (function (_super) {
    tslib_1.__extends(PetRerollNameEvent, _super);
    function PetRerollNameEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PetRerollName;
        _this.description = 'Reroll your pets name.';
        _this.args = '';
        return _this;
    }
    PetRerollNameEvent.prototype.callback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, pet, gold, newName;
            return tslib_1.__generator(this, function (_a) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                pet = player.$pets.$activePet;
                gold = player.gold;
                if (gold < 50000)
                    return [2 /*return*/, this.gameError('You do not have enough gold.')];
                player.spendGold(50000);
                newName = player.$$game.petHelper.randomName();
                pet.name = newName;
                this.gameMessage("Your pets name is now " + pet.name + ".");
                this.game.updatePlayer(player);
                return [2 /*return*/];
            });
        });
    };
    return PetRerollNameEvent;
}(models_1.ServerSocketEvent));
exports.PetRerollNameEvent = PetRerollNameEvent;
var PetRerollAffinityEvent = /** @class */ (function (_super) {
    tslib_1.__extends(PetRerollAffinityEvent, _super);
    function PetRerollAffinityEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PetRerollAffinity;
        _this.description = 'Reroll your pets affinity.';
        _this.args = '';
        return _this;
    }
    PetRerollAffinityEvent.prototype.callback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, pet, gold, newAff;
            return tslib_1.__generator(this, function (_a) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                pet = player.$pets.$activePet;
                gold = player.gold;
                if (pet.affinity === interfaces_1.PetAffinity.None)
                    return [2 /*return*/, this.gameError('You cannot reroll non-combat pets!')];
                if (gold < 100000)
                    return [2 /*return*/, this.gameError('You do not have enough gold.')];
                player.spendGold(100000);
                newAff = lodash_1.sample(Object.values(interfaces_1.PetAffinity).filter(function (x) { return x !== interfaces_1.PetAffinity.None; }));
                pet.affinity = newAff;
                player.$$game.petHelper.syncPetAffinity(pet);
                this.gameMessage("Your pets affinity is now " + pet.affinity + ".");
                this.game.updatePlayer(player);
                return [2 /*return*/];
            });
        });
    };
    return PetRerollAffinityEvent;
}(models_1.ServerSocketEvent));
exports.PetRerollAffinityEvent = PetRerollAffinityEvent;
var PetRerollAttributeEvent = /** @class */ (function (_super) {
    tslib_1.__extends(PetRerollAttributeEvent, _super);
    function PetRerollAttributeEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.PetRerollAttribute;
        _this.description = 'Reroll your pets attribute.';
        _this.args = '';
        return _this;
    }
    PetRerollAttributeEvent.prototype.callback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, pet, gold, attrs, newAttr;
            return tslib_1.__generator(this, function (_a) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                pet = player.$pets.$activePet;
                gold = player.gold;
                attrs = player.$achievements.getPetAttributes();
                if (attrs.length === 1)
                    return [2 /*return*/, this.gameError('You do not have any alternate attributes unlocked yet!')];
                if (gold < 75000)
                    return [2 /*return*/, this.gameError('You do not have enough gold.')];
                player.spendGold(75000);
                newAttr = lodash_1.sample(attrs);
                pet.attribute = newAttr;
                player.$$game.petHelper.syncPetAttribute(pet);
                this.gameMessage("Your pets attribute is now " + pet.attribute + ".");
                this.game.updatePlayer(player);
                return [2 /*return*/];
            });
        });
    };
    return PetRerollAttributeEvent;
}(models_1.ServerSocketEvent));
exports.PetRerollAttributeEvent = PetRerollAttributeEvent;
//# sourceMappingURL=pet.js.map