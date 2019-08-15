"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var signals_1 = require("signals");
var interfaces_1 = require("../../../shared/interfaces");
var SubscriptionManager = /** @class */ (function () {
    function SubscriptionManager() {
        this.channels = {};
        this.signals = {};
    }
    SubscriptionManager.prototype.init = function (scServer) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                this.scServer = scServer;
                Object.keys(interfaces_1.Channel).forEach(function (chan) {
                    var channel = scServer.exchange.subscribe(chan);
                    _this.channels[interfaces_1.Channel[chan]] = channel;
                    var signal = new signals_1.Signal();
                    _this.signals[interfaces_1.Channel[chan]] = signal;
                    channel.watch(function (data) { return signal.dispatch(data); });
                });
                return [2 /*return*/];
            });
        });
    };
    SubscriptionManager.prototype.emitToChannel = function (chan, data) {
        this.channels[chan].publish(data);
    };
    SubscriptionManager.prototype.emitToClients = function (chan, data) {
        this.scServer.exchange.publish(chan, data);
    };
    SubscriptionManager.prototype.subscribeToChannel = function (chan, cb) {
        this.signals[chan].add(cb);
    };
    SubscriptionManager = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], SubscriptionManager);
    return SubscriptionManager;
}());
exports.SubscriptionManager = SubscriptionManager;
//# sourceMappingURL=subscription-manager.js.map