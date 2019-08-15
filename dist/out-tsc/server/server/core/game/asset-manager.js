"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var lodash_1 = require("lodash");
var AssetManager = /** @class */ (function () {
    function AssetManager() {
    }
    Object.defineProperty(AssetManager.prototype, "allObjectAssets", {
        get: function () {
            return this.objectAssets;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetManager.prototype, "allStringAssets", {
        get: function () {
            return this.stringAssets;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetManager.prototype, "allPetAssets", {
        get: function () {
            return this.petAssets;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetManager.prototype, "allBossAssets", {
        get: function () {
            return this.bossAssets;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetManager.prototype, "allTreasureAssets", {
        get: function () {
            return this.treasureAssets;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetManager.prototype, "allMapAssets", {
        get: function () {
            return { maps: this.mapAssets, mapInfo: this.mapInfoAssets };
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AssetManager.prototype, "allTeleports", {
        get: function () {
            return this.teleports;
        },
        enumerable: true,
        configurable: true
    });
    AssetManager.prototype.init = function (assets) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var stringAssets, objectAssets, mapAssets, petAssets, bossAssets, treasureAssets, mapInformation, teleports;
            return tslib_1.__generator(this, function (_a) {
                stringAssets = assets.stringAssets, objectAssets = assets.objectAssets, mapAssets = assets.mapAssets, petAssets = assets.petAssets, bossAssets = assets.bossAssets, treasureAssets = assets.treasureAssets, mapInformation = assets.mapInformation, teleports = assets.teleports;
                this.stringAssets = stringAssets;
                this.objectAssets = objectAssets;
                this.mapAssets = mapAssets;
                this.petAssets = petAssets;
                this.bossAssets = bossAssets;
                this.treasureAssets = treasureAssets;
                this.mapInfoAssets = mapInformation;
                this.teleports = teleports;
                return [2 /*return*/];
            });
        });
    };
    AssetManager.prototype.stringFromGrammar = function (grammar) {
        var _this = this;
        if (!grammar)
            return '';
        return grammar.split(' ').map(function (piece) {
            if (!lodash_1.includes(piece, '%'))
                return piece;
            return lodash_1.sample(_this.stringAssets[piece.split('%')[1]]);
        })
            .join(' ');
    };
    AssetManager.prototype.injury = function () {
        return lodash_1.sample(this.stringAssets.injury);
    };
    AssetManager.prototype.witch = function () {
        var grammar = lodash_1.sample(this.stringAssets.providenceGrammar);
        return this.stringFromGrammar(grammar);
    };
    AssetManager.prototype.scroll = function () {
        var grammar = lodash_1.sample(this.stringAssets.scrollGrammar);
        return this.stringFromGrammar(grammar);
    };
    AssetManager.prototype.providence = function () {
        var grammar = lodash_1.sample(this.stringAssets.providenceGrammar);
        return this.stringFromGrammar(grammar);
    };
    AssetManager.prototype.battle = function () {
        var grammar = lodash_1.sample(this.stringAssets.battleGrammar);
        return this.stringFromGrammar(grammar);
    };
    AssetManager.prototype.party = function () {
        var grammar = lodash_1.sample(this.stringAssets.partyGrammar);
        return this.stringFromGrammar(grammar);
    };
    AssetManager = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], AssetManager);
    return AssetManager;
}());
exports.AssetManager = AssetManager;
//# sourceMappingURL=asset-manager.js.map