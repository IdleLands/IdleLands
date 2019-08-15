"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ServerAPICall_1 = require("../../shared/models/ServerAPICall");
var FestivalsAPICall = /** @class */ (function (_super) {
    tslib_1.__extends(FestivalsAPICall, _super);
    function FestivalsAPICall() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FestivalsAPICall.init = function (app, game) {
        var _this = this;
        app.get('/festivals', function (req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var festivals, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        festivals = [];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, game.databaseManager.loadFestivals()];
                    case 2:
                        festivals = (_a.sent()).festivals;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        res.json({ festivals: festivals });
                        return [2 /*return*/];
                }
            });
        }); });
    };
    FestivalsAPICall.desc = 'Get the current festivals running in game';
    FestivalsAPICall.params = '';
    return FestivalsAPICall;
}(ServerAPICall_1.ServerAPICall));
exports.FestivalsAPICall = FestivalsAPICall;
//# sourceMappingURL=festivals.js.map