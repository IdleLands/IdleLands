"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var lodash_1 = require("lodash");
var interfaces_1 = require("../../shared/interfaces");
var models_1 = require("../../shared/models");
var ChangeGenderEvent = /** @class */ (function (_super) {
    tslib_1.__extends(ChangeGenderEvent, _super);
    function ChangeGenderEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.CharacterGender;
        _this.description = 'Change your characters gender.';
        _this.args = 'newGender';
        return _this;
    }
    ChangeGenderEvent.prototype.callback = function (_a) {
        var newGender = (_a === void 0 ? { newGender: '' } : _a).newGender;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, possibleGenders;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                possibleGenders = player.availableGenders;
                if (!lodash_1.includes(possibleGenders, newGender))
                    return [2 /*return*/, this.gameError('Invalid gender specified')];
                player.changeGender(newGender);
                this.game.updatePlayer(player);
                this.gameSuccess("Gender is now \"" + newGender + "\"");
                return [2 /*return*/];
            });
        });
    };
    return ChangeGenderEvent;
}(models_1.ServerSocketEvent));
exports.ChangeGenderEvent = ChangeGenderEvent;
var ChangeTitleEvent = /** @class */ (function (_super) {
    tslib_1.__extends(ChangeTitleEvent, _super);
    function ChangeTitleEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.CharacterTitle;
        _this.description = 'Change your characters title.';
        _this.args = 'newTitle';
        return _this;
    }
    ChangeTitleEvent.prototype.callback = function (_a) {
        var newTitle = (_a === void 0 ? { newTitle: '' } : _a).newTitle;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, possibleTitles;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                possibleTitles = player.availableTitles;
                if (!newTitle) {
                    player.title = '';
                    this.game.updatePlayer(player);
                    this.gameSuccess("Title is now unset.");
                    return [2 /*return*/];
                }
                if (!lodash_1.includes(possibleTitles, newTitle))
                    return [2 /*return*/, this.gameError('Invalid title specified')];
                player.changeTitle(newTitle);
                this.game.updatePlayer(player);
                this.gameSuccess("Title is now \"" + newTitle + "\"");
                return [2 /*return*/];
            });
        });
    };
    return ChangeTitleEvent;
}(models_1.ServerSocketEvent));
exports.ChangeTitleEvent = ChangeTitleEvent;
var AscendEvent = /** @class */ (function (_super) {
    tslib_1.__extends(AscendEvent, _super);
    function AscendEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.CharacterAscend;
        _this.description = 'Ascend.';
        _this.args = '';
        return _this;
    }
    AscendEvent.prototype.callback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player;
            return tslib_1.__generator(this, function (_a) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                if (player.canLevelUp())
                    return [2 /*return*/, this.gameError('You are not currently able to ascend.')];
                player.ascend();
                this.game.updatePlayer(player);
                this.gameSuccess("You have ascended!");
                return [2 /*return*/];
            });
        });
    };
    return AscendEvent;
}(models_1.ServerSocketEvent));
exports.AscendEvent = AscendEvent;
var OOCAbilityEvent = /** @class */ (function (_super) {
    tslib_1.__extends(OOCAbilityEvent, _super);
    function OOCAbilityEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.CharacterOOCAction;
        _this.description = 'Execute your classes OOC action.';
        _this.args = '';
        return _this;
    }
    OOCAbilityEvent.prototype.callback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, msg;
            return tslib_1.__generator(this, function (_a) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                if (player.stamina.total < player.$profession.oocAbilityCost)
                    return [2 /*return*/, this.gameError('You do not have enough stamina!')];
                msg = player.oocAction();
                this.gameMessage(msg);
                this.game.updatePlayer(player);
                return [2 /*return*/];
            });
        });
    };
    return OOCAbilityEvent;
}(models_1.ServerSocketEvent));
exports.OOCAbilityEvent = OOCAbilityEvent;
var DivineDirectionEvent = /** @class */ (function (_super) {
    tslib_1.__extends(DivineDirectionEvent, _super);
    function DivineDirectionEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.CharacterDivineDirection;
        _this.description = 'Set the Divine Direction of your character.';
        _this.args = 'x, y';
        return _this;
    }
    DivineDirectionEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { x: 0, y: 0 } : _a, x = _b.x, y = _b.y;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player;
            return tslib_1.__generator(this, function (_c) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                player.setDivineDirection(x, y);
                this.game.updatePlayer(player);
                return [2 /*return*/];
            });
        });
    };
    return DivineDirectionEvent;
}(models_1.ServerSocketEvent));
exports.DivineDirectionEvent = DivineDirectionEvent;
var LeavePartyEvent = /** @class */ (function (_super) {
    tslib_1.__extends(LeavePartyEvent, _super);
    function LeavePartyEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.CharacterLeaveParty;
        _this.description = 'Leave your party.';
        _this.args = '';
        return _this;
    }
    LeavePartyEvent.prototype.callback = function (_a) {
        var _b = _a === void 0 ? { x: 0, y: 0 } : _a, x = _b.x, y = _b.y;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player;
            return tslib_1.__generator(this, function (_c) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                if (!player.$party)
                    return [2 /*return*/, this.gameError('You are not in a party.')];
                this.game.partyHelper.playerLeave(player);
                this.gameMessage('You left your party!');
                return [2 /*return*/];
            });
        });
    };
    return LeavePartyEvent;
}(models_1.ServerSocketEvent));
exports.LeavePartyEvent = LeavePartyEvent;
var ChangeDiscordTagEvent = /** @class */ (function (_super) {
    tslib_1.__extends(ChangeDiscordTagEvent, _super);
    function ChangeDiscordTagEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.CharacterDiscordTag;
        _this.description = 'Change your characters associated discord tag.';
        _this.args = 'discordTag';
        return _this;
    }
    ChangeDiscordTagEvent.prototype.callback = function (_a) {
        var discordTag = (_a === void 0 ? { discordTag: '' } : _a).discordTag;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, newPremium, msg;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        player = this.player;
                        if (!player)
                            return [2 /*return*/, this.notConnected()];
                        if (!discordTag) {
                            player.discordTag = '';
                            player.$statistics.set('Game/Contributor/ContributorTier', interfaces_1.ContributorTier.None);
                            player.$premium.setTier(interfaces_1.PremiumTier.None);
                            player.syncPremium();
                            return [2 /*return*/, this.gameMessage('Unset your Discord tag! Your Premium benefits have been reset.')];
                        }
                        if (!(player.discordTag && discordTag !== player.discordTag)) return [3 /*break*/, 2];
                        if (!this.game.discordManager.isTagInDiscord(discordTag))
                            return [2 /*return*/, this.gameError('That user is not in Discord!')];
                        return [4 /*yield*/, this.game.databaseManager.findPlayerWithDiscordTag(discordTag)];
                    case 1:
                        if (_b.sent())
                            return [2 /*return*/, this.gameError('That Discord tag is already taken!')];
                        _b.label = 2;
                    case 2:
                        player.discordTag = discordTag;
                        newPremium = interfaces_1.PremiumTier.None;
                        if (this.game.discordManager.hasRole(discordTag, 'Patron'))
                            newPremium = interfaces_1.PremiumTier.Subscriber;
                        if (this.game.discordManager.hasRole(discordTag, 'Patron Saint'))
                            newPremium = interfaces_1.PremiumTier.Subscriber2;
                        player.$premium.setTier(newPremium);
                        msg = "You updated your discord tag!";
                        if (newPremium > 0) {
                            msg = msg + " Thanks for your support!";
                        }
                        if (this.game.discordManager.hasRole(discordTag, 'Collaborator')) {
                            player.$statistics.set('Game/Contributor/ContributorTier', interfaces_1.ContributorTier.Contributor);
                        }
                        player.syncPremium();
                        this.gameMessage(msg);
                        this.game.updatePlayer(player);
                        return [2 /*return*/];
                }
            });
        });
    };
    return ChangeDiscordTagEvent;
}(models_1.ServerSocketEvent));
exports.ChangeDiscordTagEvent = ChangeDiscordTagEvent;
var ChangeIdleLands3CharacterEvent = /** @class */ (function (_super) {
    tslib_1.__extends(ChangeIdleLands3CharacterEvent, _super);
    function ChangeIdleLands3CharacterEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.CharacterChangeIdlelands3;
        _this.description = 'Change your characters associated IdleLands 3 character.';
        _this.args = 'il3CharName';
        return _this;
    }
    ChangeIdleLands3CharacterEvent.prototype.callback = function (_a) {
        var il3CharName = (_a === void 0 ? { il3CharName: '' } : _a).il3CharName;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player, stats;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        player = this.player;
                        if (!player)
                            return [2 /*return*/, this.notConnected()];
                        if (!il3CharName) {
                            player.il3CharName = '';
                            player.syncIL3({});
                            return [2 /*return*/, this.gameMessage('Unset your IL3 Character! Your synced benefits have been reset.')];
                        }
                        if (!(player.il3CharName && il3CharName !== player.il3CharName)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.game.databaseManager.findPlayerWithIL3Name(il3CharName)];
                    case 1:
                        if (_b.sent())
                            return [2 /*return*/, this.gameError('That IL3 Character is already taken!')];
                        _b.label = 2;
                    case 2:
                        player.il3CharName = il3CharName;
                        return [4 /*yield*/, this.game.il3Linker.getIL3Stats(il3CharName)];
                    case 3:
                        stats = _b.sent();
                        player.syncIL3(stats || {});
                        this.gameMessage('You updated your IL3 Character!');
                        this.game.updatePlayer(player);
                        return [2 /*return*/];
                }
            });
        });
    };
    return ChangeIdleLands3CharacterEvent;
}(models_1.ServerSocketEvent));
exports.ChangeIdleLands3CharacterEvent = ChangeIdleLands3CharacterEvent;
//# sourceMappingURL=character.js.map