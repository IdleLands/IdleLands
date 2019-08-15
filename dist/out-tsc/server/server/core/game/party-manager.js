"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var interfaces_1 = require("../../../shared/interfaces");
var subscription_manager_1 = require("./subscription-manager");
var PartyManager = /** @class */ (function () {
    function PartyManager() {
        this.parties = {};
    }
    Object.defineProperty(PartyManager.prototype, "partyNames", {
        get: function () {
            return Object.keys(this.parties);
        },
        enumerable: true,
        configurable: true
    });
    PartyManager.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            return tslib_1.__generator(this, function (_a) {
                this.subscribeToPartyMods();
                return [2 /*return*/];
            });
        });
    };
    PartyManager.prototype.subscribeToPartyMods = function () {
        var _this = this;
        this.subscriptionManager.subscribeToChannel(interfaces_1.Channel.Party, function (_a) {
            var party = _a.party, operation = _a.operation;
            switch (operation) {
                case interfaces_1.PartyChannelOperation.Add: {
                    _this.parties[party.name] = party;
                    break;
                }
                case interfaces_1.PartyChannelOperation.Update: {
                    _this.parties[party.name] = party;
                    break;
                }
                case interfaces_1.PartyChannelOperation.Remove: {
                    delete _this.parties[party.name];
                    break;
                }
            }
        });
    };
    PartyManager.prototype.getParty = function (partyName) {
        return this.parties[partyName];
    };
    PartyManager.prototype.addParty = function (party) {
        this.subscriptionManager.emitToChannel(interfaces_1.Channel.Party, { party: party, operation: interfaces_1.PartyChannelOperation.Add });
    };
    PartyManager.prototype.removeParty = function (party) {
        this.subscriptionManager.emitToChannel(interfaces_1.Channel.Party, { party: party, operation: interfaces_1.PartyChannelOperation.Remove });
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", subscription_manager_1.SubscriptionManager)
    ], PartyManager.prototype, "subscriptionManager", void 0);
    PartyManager = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], PartyManager);
    return PartyManager;
}());
exports.PartyManager = PartyManager;
//# sourceMappingURL=party-manager.js.map