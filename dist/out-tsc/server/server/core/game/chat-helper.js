"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var interfaces_1 = require("../../../shared/interfaces");
var subscription_manager_1 = require("./subscription-manager");
var profanity_filter_1 = require("../static/profanity-filter");
var ChatHelper = /** @class */ (function () {
    function ChatHelper() {
        this.onMessageCallback = function (msg) { };
    }
    ChatHelper.prototype.sortMessage = function (message) {
        if (!message.timestamp)
            message.timestamp = Date.now();
    };
    ChatHelper.prototype.init = function (onMessageCallback) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.onMessageCallback = onMessageCallback;
                return [2 /*return*/];
            });
        });
    };
    ChatHelper.prototype.sendMessageFromClient = function (message) {
        this.sortMessage(message);
        message.message = profanity_filter_1.censorSensor.cleanProfanity(message.message);
        this.sendMessageToDiscord(message);
        this.sendMessageToGame(message);
    };
    ChatHelper.prototype.sendMessageToGame = function (message) {
        this.sortMessage(message);
        this.subscriptionManager.emitToClients(interfaces_1.Channel.PlayerChat, { message: message });
    };
    ChatHelper.prototype.sendMessageToDiscord = function (message) {
        this.sortMessage(message);
        if (!message.playerLevel && !message.playerAscension) {
            this.onMessageCallback("<" + message.playerName + "> " + message.message);
            return;
        }
        this.onMessageCallback("<" + message.playerName + " " + (message.playerAscension || 0) + "\u2605" + message.playerLevel + "> " + message.message);
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", subscription_manager_1.SubscriptionManager)
    ], ChatHelper.prototype, "subscriptionManager", void 0);
    ChatHelper = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], ChatHelper);
    return ChatHelper;
}());
exports.ChatHelper = ChatHelper;
//# sourceMappingURL=chat-helper.js.map