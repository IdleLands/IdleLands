"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var lodash_1 = require("lodash");
var rng_service_1 = require("../rng-service");
var event_message_parser_1 = require("../event-message-parser");
var models_1 = require("../../../../shared/models");
var asset_manager_1 = require("../asset-manager");
var interfaces_1 = require("../../../../shared/interfaces");
var player_manager_1 = require("../player-manager");
var subscription_manager_1 = require("../subscription-manager");
var item_generator_1 = require("../item-generator");
var profession_helper_1 = require("../profession-helper");
var party_helper_1 = require("../party-helper");
var Event = /** @class */ (function () {
    function Event() {
        this.statTiers = {
            t1: [interfaces_1.Stat.AGI, interfaces_1.Stat.DEX],
            t2: [interfaces_1.Stat.STR, interfaces_1.Stat.INT, interfaces_1.Stat.CON],
            t3: [interfaces_1.Stat.LUK],
            t4: [interfaces_1.Stat.GOLD, interfaces_1.Stat.XP]
        };
    }
    Event.prototype.doChoice = function (eventManager, player, choice, valueChosen) {
        return true;
    };
    Event.prototype._parseText = function (message, player, extra) {
        return this.messageParser.stringFormat(message, player, extra);
    };
    Event.prototype.eventText = function (eventType, player, extra) {
        return this._parseText(this.rng.pickone(this.assetManager.allStringAssets[eventType]), player, extra);
    };
    Event.prototype.pickStat = function () {
        return this.rng.pickone([interfaces_1.Stat.AGI, interfaces_1.Stat.CON, interfaces_1.Stat.DEX, interfaces_1.Stat.INT, interfaces_1.Stat.STR, interfaces_1.Stat.LUK]);
    };
    Event.prototype.pickTinkerStat = function () {
        return this.rng.pickone([interfaces_1.Stat.XP, interfaces_1.Stat.HP, interfaces_1.Stat.GOLD]);
    };
    Event.prototype.validItems = function (player) {
        return lodash_1.compact(interfaces_1.GenerateableItemSlot.map(function (slot) { return player.$inventory.itemInEquipmentSlot(slot); }));
    };
    Event.prototype.pickValidItem = function (player) {
        return this.rng.pickone(this.validItems(player));
    };
    Event.prototype.pickValidEnchantItem = function (player) {
        return this.rng.pickone(this.validItems(player).filter(function (i) { return i.isCurrentlyEnchantable(player); }));
    };
    Event.prototype.pickValidBlessItem = function (player) {
        return this.rng.pickone(this.validItems(player).filter(function (i) { return i.isUnderBoostablePercent(player); }));
    };
    Event.prototype.emitMessage = function (players, message, type, extraData) {
        if (extraData === void 0) { extraData = {}; }
        this.emitMessageToNames(players.map(function (x) { return x.name; }), message, type, extraData);
    };
    Event.prototype.emitMessageToNames = function (playerNames, message, type, extraData) {
        if (extraData === void 0) { extraData = {}; }
        var messageData = tslib_1.__assign({ when: Date.now(), type: type,
            message: message }, extraData);
        this.subscriptionManager.emitToChannel(interfaces_1.Channel.PlayerAdventureLog, { playerNames: playerNames, data: messageData });
    };
    Event.prototype.getChoice = function (choiceOpts) {
        var choice = new models_1.Choice();
        choiceOpts.event = this.constructor.name;
        choice.init(choiceOpts);
        return choice;
    };
    Event.WEIGHT = 0;
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", rng_service_1.RNGService)
    ], Event.prototype, "rng", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", asset_manager_1.AssetManager)
    ], Event.prototype, "assetManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", event_message_parser_1.EventMessageParser)
    ], Event.prototype, "messageParser", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", player_manager_1.PlayerManager)
    ], Event.prototype, "playerManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", party_helper_1.PartyHelper)
    ], Event.prototype, "partyHelper", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", item_generator_1.ItemGenerator)
    ], Event.prototype, "itemGenerator", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", subscription_manager_1.SubscriptionManager)
    ], Event.prototype, "subscriptionManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", profession_helper_1.ProfessionHelper)
    ], Event.prototype, "professionHelper", void 0);
    return Event;
}());
exports.Event = Event;
//# sourceMappingURL=Event.js.map