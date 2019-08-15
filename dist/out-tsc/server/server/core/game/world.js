"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var lodash_1 = require("lodash");
var tile_data_1 = require("../static/tile-data");
var Map = /** @class */ (function () {
    function Map(map, data) {
        this.map = map;
        this.data = data;
    }
    Object.defineProperty(Map.prototype, "height", {
        get: function () {
            return this.map.height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Map.prototype, "width", {
        get: function () {
            return this.map.width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Map.prototype, "jsonMap", {
        get: function () {
            return this.map;
        },
        enumerable: true,
        configurable: true
    });
    Map.prototype.getTile = function (x, y) {
        var tilePosition = (y * this.map.width) + x;
        return {
            terrain: tile_data_1.GidMap[this.map.layers[0].data[tilePosition]] || 'Void',
            blocked: tile_data_1.Blockers[this.map.layers[1].data[tilePosition]],
            blocker: tile_data_1.GidMap[this.map.layers[1].data[tilePosition]],
            region: lodash_1.get(this.data.regions, [x, y]) || 'Wilderness',
            object: lodash_1.get(this.data.objects, [x, y])
        };
    };
    return Map;
}());
var World = /** @class */ (function () {
    function World() {
        this.maps = {};
    }
    Object.defineProperty(World.prototype, "mapNames", {
        get: function () {
            return Object.keys(this.maps);
        },
        enumerable: true,
        configurable: true
    });
    World.prototype.init = function (_a) {
        var _this = this;
        var maps = _a.maps, mapInfo = _a.mapInfo;
        Object.keys(maps).forEach(function (mapName) {
            _this.maps[mapName] = new Map(maps[mapName], mapInfo[mapName]);
        });
    };
    World.prototype.getMap = function (map) {
        return this.maps[map];
    };
    World = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], World);
    return World;
}());
exports.World = World;
//# sourceMappingURL=world.js.map