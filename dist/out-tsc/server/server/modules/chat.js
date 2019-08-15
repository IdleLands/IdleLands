"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var models_1 = require("../../shared/models");
var interfaces_1 = require("../../shared/interfaces");
var SyncPlayersEvent = /** @class */ (function (_super) {
    tslib_1.__extends(SyncPlayersEvent, _super);
    function SyncPlayersEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.ChatPlayerListSync;
        _this.description = 'Get all currently connected players.';
        _this.args = '';
        return _this;
    }
    SyncPlayersEvent.prototype.callback = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player;
            return tslib_1.__generator(this, function (_a) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                this.emit(interfaces_1.ServerEventName.ChatPlayerListSync, this.game.playerManager.allSimplePlayers);
                return [2 /*return*/];
            });
        });
    };
    return SyncPlayersEvent;
}(models_1.ServerSocketEvent));
exports.SyncPlayersEvent = SyncPlayersEvent;
var ChatMessageEvent = /** @class */ (function (_super) {
    tslib_1.__extends(ChatMessageEvent, _super);
    function ChatMessageEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.event = interfaces_1.ServerEventName.ChatMessage;
        _this.description = 'Send a chat message to the game.';
        _this.args = 'message';
        return _this;
    }
    ChatMessageEvent.prototype.callback = function (_a) {
        var message = (_a === void 0 ? { message: '' } : _a).message;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var player;
            return tslib_1.__generator(this, function (_b) {
                player = this.player;
                if (!player)
                    return [2 /*return*/, this.notConnected()];
                // only non-mods can be muted
                if (!player.modTier) {
                    // if they're currently muted
                    if (player.mutedUntil > Date.now()) {
                        return [2 /*return*/, this.gameError("You're muted, friendo. Come back at " + new Date(player.mutedUntil).toLocaleString())];
                    }
                    // reset it
                    if (player.mutedUntil) {
                        player.messageCooldown = 0;
                        player.mutedUntil = 0;
                    }
                    // if player has a last message sent
                    if (player.lastMessageSent) {
                        // and they just sent one 500ms or less from the last one, increase their cooldown
                        if (player.lastMessageSent + 500 > Date.now()) {
                            player.messageCooldown = player.messageCooldown || 0;
                            player.messageCooldown++;
                            // otherwise, lower their cooldown
                        }
                        else {
                            player.messageCooldown = player.messageCooldown || 0;
                            player.messageCooldown = Math.max(player.messageCooldown, 0);
                        }
                    }
                    // reset message sent time
                    player.lastMessageSent = Date.now();
                    // if they have more than 3 strikes, they're out
                    if (player.messageCooldown > 3) {
                        player.mutedUntil = Date.now() + 1000 * 60 * 15;
                    }
                }
                this.game.chatHelper.sendMessageFromClient({
                    timestamp: Date.now(),
                    message: message,
                    realPlayerName: player.name,
                    playerName: "" + player.name + (player.title ? ", the " + player.title : ''),
                    playerLevel: player.level.total,
                    playerAscension: player.ascensionLevel
                });
                return [2 /*return*/];
            });
        });
    };
    return ChatMessageEvent;
}(models_1.ServerSocketEvent));
exports.ChatMessageEvent = ChatMessageEvent;
//# sourceMappingURL=chat.js.map