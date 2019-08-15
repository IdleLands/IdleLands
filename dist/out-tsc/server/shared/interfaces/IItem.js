"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ItemSlot;
(function (ItemSlot) {
    ItemSlot["Body"] = "body";
    ItemSlot["Charm"] = "charm";
    ItemSlot["Feet"] = "feet";
    ItemSlot["Finger"] = "finger";
    ItemSlot["Hands"] = "hands";
    ItemSlot["Head"] = "head";
    ItemSlot["Legs"] = "legs";
    ItemSlot["Neck"] = "neck";
    ItemSlot["Mainhand"] = "mainhand";
    ItemSlot["Offhand"] = "offhand";
    ItemSlot["Providence"] = "providence";
    ItemSlot["Soul"] = "soul";
    ItemSlot["Trinket"] = "trinket";
})(ItemSlot = exports.ItemSlot || (exports.ItemSlot = {}));
var ItemClass;
(function (ItemClass) {
    ItemClass["Newbie"] = "newbie";
    ItemClass["Basic"] = "basic";
    ItemClass["Pro"] = "pro";
    ItemClass["Idle"] = "idle";
    ItemClass["Godly"] = "godly";
    ItemClass["Goatly"] = "goatly";
    ItemClass["Omega"] = "omega";
    ItemClass["Guardian"] = "guardian";
})(ItemClass = exports.ItemClass || (exports.ItemClass = {}));
exports.GenerateableItemSlot = Object
    .keys(ItemSlot)
    .map(function (slot) { return ItemSlot[slot]; })
    .filter(function (x) { return x !== ItemSlot.Providence && x !== ItemSlot.Soul && x !== ItemSlot.Trinket; });
var TeleportItemLocation;
(function (TeleportItemLocation) {
    TeleportItemLocation["AstralTown"] = "Astral Town";
    TeleportItemLocation["FrigriTown"] = "Frigri Town";
    TeleportItemLocation["HomletTown"] = "Homlet Town";
    TeleportItemLocation["MaelesTown"] = "Maeles Town";
    TeleportItemLocation["NorkosTown"] = "Norkos Town";
    TeleportItemLocation["RaburroTown"] = "Raburro Town";
    TeleportItemLocation["VocalnusTown"] = "Vocalnus Town";
    TeleportItemLocation["DesertTown"] = "Desert Town";
    TeleportItemLocation["TreeTown"] = "Tree Town";
})(TeleportItemLocation = exports.TeleportItemLocation || (exports.TeleportItemLocation = {}));
//# sourceMappingURL=IItem.js.map