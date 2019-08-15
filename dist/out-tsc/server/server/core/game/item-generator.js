"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var lodash_1 = require("lodash");
var asset_manager_1 = require("./asset-manager");
var models_1 = require("../../../shared/models");
var interfaces_1 = require("../../../shared/interfaces");
var rng_service_1 = require("./rng-service");
var logger_1 = require("../logger");
var ItemGenerator = /** @class */ (function () {
    function ItemGenerator() {
        var _a, _b, _c;
        this.prefixWeight = (_a = {},
            _a[interfaces_1.ItemClass.Newbie] = [
                [2, 10],
                [1, 100],
                [0, 10000]
            ],
            _a[interfaces_1.ItemClass.Basic] = [
                [2, 20],
                [1, 500],
                [0, 9000]
            ],
            _a[interfaces_1.ItemClass.Pro] = [
                [3, 1],
                [2, 30],
                [1, 600],
                [0, 8000]
            ],
            _a[interfaces_1.ItemClass.Idle] = [
                [3, 10],
                [2, 100],
                [1, 7000],
                [0, 5000]
            ],
            _a[interfaces_1.ItemClass.Godly] = [
                [3, 20],
                [2, 200],
                [1, 6000],
                [0, 3000]
            ],
            _a[interfaces_1.ItemClass.Goatly] = [
                [4, 1],
                [3, 50],
                [2, 1000],
                [1, 6000],
                [0, 3000]
            ],
            _a[interfaces_1.ItemClass.Omega] = [
                [5, 1],
                [4, 10],
                [3, 100],
                [2, 5000],
                [1, 1000],
                [0, 500]
            ],
            _a);
        this.suffixWeight = (_b = {},
            _b[interfaces_1.ItemClass.Newbie] = [
                [1, 100],
                [0, 10000]
            ],
            _b[interfaces_1.ItemClass.Basic] = [
                [1, 1000],
                [0, 10000]
            ],
            _b[interfaces_1.ItemClass.Pro] = [
                [1, 500],
                [0, 500]
            ],
            _b[interfaces_1.ItemClass.Idle] = [
                [2, 10],
                [1, 10000],
                [0, 5000]
            ],
            _b[interfaces_1.ItemClass.Godly] = [
                [2, 20],
                [1, 10000],
                [0, 3000]
            ],
            _b[interfaces_1.ItemClass.Goatly] = [
                [2, 30],
                [1, 10000],
                [0, 1000]
            ],
            _b[interfaces_1.ItemClass.Omega] = [
                [3, 1],
                [2, 20],
                [1, 10000],
                [0, 3000]
            ],
            _b);
        this.assetTiers = (_c = {},
            _c[interfaces_1.ItemClass.Newbie] = 0,
            _c[interfaces_1.ItemClass.Basic] = 150,
            _c[interfaces_1.ItemClass.Pro] = 500,
            _c[interfaces_1.ItemClass.Idle] = 1000,
            _c[interfaces_1.ItemClass.Godly] = 5000,
            _c[interfaces_1.ItemClass.Goatly] = 50000,
            _c[interfaces_1.ItemClass.Omega] = 100000,
            _c);
        this.levelTiers = [
            { itemClass: interfaces_1.ItemClass.Basic, levelReq: 10 },
            { itemClass: interfaces_1.ItemClass.Pro, levelReq: 50 },
            { itemClass: interfaces_1.ItemClass.Idle, levelReq: 100 },
            { itemClass: interfaces_1.ItemClass.Godly, levelReq: 500 },
            { itemClass: interfaces_1.ItemClass.Goatly, levelReq: 1000 },
            { itemClass: interfaces_1.ItemClass.Omega, levelReq: 5000 }
        ];
        this.allAssetScoreSorted = {};
    }
    ItemGenerator.prototype.init = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var relevantItemTypes;
            var _this = this;
            return tslib_1.__generator(this, function (_a) {
                relevantItemTypes = [
                    'body', 'charm', 'feet', 'finger', 'hands', 'head', 'legs', 'mainhand', 'neck', 'offhand',
                    'prefix', 'suffix'
                ];
                relevantItemTypes.forEach(function (type) {
                    _this.assetManager.allObjectAssets[type].forEach(function (asset) { return _this.sortAssetInScore(asset); });
                });
                return [2 /*return*/];
            });
        });
    };
    ItemGenerator.prototype.determineTierOfItemForScore = function (score) {
        var allClasses = [
            interfaces_1.ItemClass.Omega, interfaces_1.ItemClass.Goatly, interfaces_1.ItemClass.Godly,
            interfaces_1.ItemClass.Idle, interfaces_1.ItemClass.Pro, interfaces_1.ItemClass.Basic, interfaces_1.ItemClass.Newbie
        ];
        for (var i = 0; i < allClasses.length; i++) {
            if (score > this.assetTiers[allClasses[i]])
                return allClasses[i];
        }
        return interfaces_1.ItemClass.Newbie;
    };
    ItemGenerator.prototype.sortAssetInScore = function (asset) {
        this.allAssetScoreSorted[asset.type] = this.allAssetScoreSorted[asset.type] || {};
        var assetScore = models_1.Item.calcScoreForHash(asset);
        var tier = this.determineTierOfItemForScore(assetScore);
        this.allAssetScoreSorted[asset.type][tier] = this.allAssetScoreSorted[asset.type][tier] || [];
        this.allAssetScoreSorted[asset.type][tier].push(asset);
    };
    ItemGenerator.prototype.getAssetScoreSeries = function (scoreCat, scoreTier) {
        return lodash_1.get(this.allAssetScoreSorted, [scoreCat, scoreTier], []);
    };
    ItemGenerator.prototype.generateNewbieItems = function () {
        var itemNames = {
            body: ['Tattered Shirt', 'Spray Tan', 'Temporary Tattoos', 'Hero\'s Tunic', 'Grandma\'s Sweater'],
            feet: ['Cardboard Shoes', 'Wheelie Shoes', 'Sandals With Built-in Socks'],
            finger: ['Twisted Wire', 'Candy Ring', 'Hero Academy Graduation Ring'],
            hands: ['Pixelated Gloves', 'Winter Gloves', 'Mittens'],
            head: ['Miniature Top Hat', 'Fruit Hat', 'Beanie', 'Sunglasses'],
            legs: ['Leaf', 'Cargo Shorts', 'Comfy Shorts'],
            neck: ['Old Brooch', 'Candy Necklace', 'Keyboard Cat Tie'],
            mainhand: ['Empty and Broken Ale Bottle', 'Father\'s Sword', 'Butter Knife', 'Hero\'s Axe', 'Chocolate Drumstick', 'Aged Toothbrush'],
            offhand: ['Chunk of Rust', 'Shaking Fist', 'Upside-down Map', 'Sticker Book', 'Stolen Dagger'],
            charm: ['Ancient Bracelet', 'Family Photo', 'Third Place Bowling Trophy', 'Love Letter']
        };
        var r = function () { return lodash_1.random(-1, 2); };
        var equipment = [];
        Object.keys(itemNames).forEach(function (key) {
            var item = new models_1.Item();
            item.init({
                type: key,
                itemClass: interfaces_1.ItemClass.Newbie,
                name: lodash_1.sample(itemNames[key]),
                stats: { str: r(), con: r(), dex: r(), int: r(), agi: r(), luk: r(), xp: 2, gold: 1 }
            });
            equipment.push(item);
        });
        return equipment;
    };
    ItemGenerator.prototype.generateGuardianItem = function (player, name, type, proto) {
        var item = new models_1.Item();
        var stats = {};
        Object.values(interfaces_1.Stat).forEach(function (stat) {
            if (!proto.stats[stat])
                return;
            stats[stat] = proto.stats[stat];
        });
        item.init({
            name: name,
            type: type,
            itemClass: interfaces_1.ItemClass.Guardian,
            stats: stats,
            enchantLevel: proto.enchantLevel || 0
        });
        return item;
    };
    ItemGenerator.prototype.generateItemForPlayer = function (player, opts) {
        opts = lodash_1.extend({}, { forceType: '', allowNegative: false, qualityBoost: 0, generateLevel: player.level.total, forceClass: '' }, opts);
        return this.generateItem(opts);
    };
    ItemGenerator.prototype.generateItem = function (opts) {
        var _a, _b;
        opts = lodash_1.extend({}, { forceType: '', allowNegative: false, qualityBoost: 0, generateLevel: 1, forceClass: '' }, opts);
        if (!opts.generateLevel)
            opts.generateLevel = 0;
        if (!opts.forceType)
            opts.forceType = this.rng.pickone(interfaces_1.GenerateableItemSlot);
        opts.forceType = opts.forceType.toLowerCase();
        var item = new models_1.Item();
        var curLevel = opts.generateLevel;
        var possibleItemClasses = [interfaces_1.ItemClass.Newbie];
        // determine the item tier we want to generate
        this.levelTiers.forEach(function (_a) {
            var itemClass = _a.itemClass, levelReq = _a.levelReq;
            if (curLevel < levelReq)
                return;
            possibleItemClasses.push(itemClass);
        });
        // force boost quality if possible
        for (var i = 0; i < opts.qualityBoost; i++) {
            if (possibleItemClasses.length <= 1)
                continue;
            possibleItemClasses.shift();
        }
        var itemClassChosen = opts.forceClass || this.rng.pickone(possibleItemClasses);
        var name = '';
        var allStatAssets = [];
        var baseAsset = this.rng.pickone(this.getAssetScoreSeries(opts.forceType, itemClassChosen));
        if (!baseAsset) {
            this.logger.error(new Error("No asset available for " + opts.forceType + ":" + itemClassChosen));
            var itemRef = new models_1.Item();
            itemRef.init({
                name: 'Poorly Generated Error Item',
                type: opts.forceType,
                stats: { luk: -1 },
                itemClass: interfaces_1.ItemClass.Newbie
            });
            return itemRef;
        }
        name = baseAsset.name;
        allStatAssets.push(baseAsset);
        var prefixCount = (_a = this.rng.chance).weighted.apply(_a, lodash_1.zip.apply(void 0, this.prefixWeight[itemClassChosen]));
        var suffixCount = (_b = this.rng.chance).weighted.apply(_b, lodash_1.zip.apply(void 0, this.suffixWeight[itemClassChosen]));
        for (var p = 0; p < prefixCount; p++) {
            var prefix = this.rng.pickone(this.allAssetScoreSorted.prefix[itemClassChosen]);
            if (!prefix)
                continue;
            name = prefix.name + " " + name;
            allStatAssets.push(prefix);
        }
        for (var s = 0; s < suffixCount; s++) {
            var suffix = this.rng.pickone(this.allAssetScoreSorted.suffix[itemClassChosen]);
            if (!suffix)
                continue;
            name = name + " " + (s > 0 ? 'and the ' + suffix.name : 'of the ' + suffix.name);
            allStatAssets.push(suffix);
        }
        var allStats = allStatAssets.reduce(function (prev, cur) {
            interfaces_1.AllStats.forEach(function (stat) {
                if (!cur[stat])
                    return;
                prev[stat] = prev[stat] || 0;
                prev[stat] += cur[stat];
            });
            return prev;
        }, {});
        var calcItemClass = this.determineTierOfItemForScore(models_1.Item.calcScoreForHash(allStats));
        item.init({ name: name, type: opts.forceType, stats: allStats, itemClass: calcItemClass });
        if (item.score <= 0 && !opts.allowNegative)
            return null;
        return item;
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", logger_1.Logger)
    ], ItemGenerator.prototype, "logger", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", asset_manager_1.AssetManager)
    ], ItemGenerator.prototype, "assetManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", rng_service_1.RNGService)
    ], ItemGenerator.prototype, "rng", void 0);
    ItemGenerator = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], ItemGenerator);
    return ItemGenerator;
}());
exports.ItemGenerator = ItemGenerator;
//# sourceMappingURL=item-generator.js.map