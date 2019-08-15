"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ServerAPICall_1 = require("../../shared/models/ServerAPICall");
var MapAPICall = /** @class */ (function (_super) {
    tslib_1.__extends(MapAPICall, _super);
    function MapAPICall() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MapAPICall.init = function (app, game) {
        var _this = this;
        app.get('/map', function (req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var jsonMap;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, game.world.getMap(req.query.map)];
                    case 1:
                        jsonMap = (_a.sent()).jsonMap;
                        res.json(jsonMap);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    MapAPICall.desc = 'Get map data for a given map';
    MapAPICall.params = 'map';
    return MapAPICall;
}(ServerAPICall_1.ServerAPICall));
exports.MapAPICall = MapAPICall;
//# sourceMappingURL=map.js.map