"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var asset_manager_1 = require("./asset-manager");
var party_manager_1 = require("./party-manager");
var player_manager_1 = require("./player-manager");
var PartyHelper = /** @class */ (function () {
    function PartyHelper() {
    }
    PartyHelper.prototype.generateName = function () {
        return this.assetManager.party();
    };
    PartyHelper.prototype.teleportNear = function (player, target) {
        player.x = target.x;
        player.y = target.y;
        player.map = target.map;
    };
    PartyHelper.prototype.createParty = function () {
        var party = { name: '', members: [] };
        do {
            party.name = this.generateName();
        } while (this.partyManager.getParty(party.name));
        return party;
    };
    PartyHelper.prototype.getParty = function (partyName) {
        return this.partyManager.getParty(partyName);
    };
    PartyHelper.prototype.shareParty = function (party) {
        this.partyManager.addParty(party);
    };
    PartyHelper.prototype.removeParty = function (party) {
        this.partyManager.removeParty(party);
    };
    // player join party
    PartyHelper.prototype.playerJoin = function (party, player) {
        player.$party = party;
        party.members.push(player.name);
        player.increaseStatistic('Event/Party/Join', 1);
        if (party.members[0] !== player.name && player.$personalities.has('Telesheep')) {
            var leader = this.playerManager.getPlayer(party.members[0]);
            player.setPos(leader.x, leader.y, leader.map, leader.region);
        }
    };
    PartyHelper.prototype.playerLeave = function (player) {
        var party = player.$party;
        if (!party)
            return;
        this.disband(party);
    };
    PartyHelper.prototype.disband = function (party) {
        var _this = this;
        party.members.forEach(function (memberName) {
            var playerRef = _this.playerManager.getPlayer(memberName);
            if (!playerRef)
                return;
            var leaveChoice = playerRef.$choices.getChoice('PartyLeave');
            if (leaveChoice)
                playerRef.$choices.removeChoice(leaveChoice);
            playerRef.increaseStatistic('Event/Party/Leave', 1);
            playerRef.$party = null;
        });
        this.removeParty(party);
    };
    PartyHelper.prototype.getPartyLeader = function (party) {
        return this.playerManager.getPlayer(party.members[0]);
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", asset_manager_1.AssetManager)
    ], PartyHelper.prototype, "assetManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", player_manager_1.PlayerManager)
    ], PartyHelper.prototype, "playerManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", party_manager_1.PartyManager)
    ], PartyHelper.prototype, "partyManager", void 0);
    PartyHelper = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], PartyHelper);
    return PartyHelper;
}());
exports.PartyHelper = PartyHelper;
//# sourceMappingURL=party-helper.js.map