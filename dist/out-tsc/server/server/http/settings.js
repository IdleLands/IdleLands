"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var ServerAPICall_1 = require("../../shared/models/ServerAPICall");
var SettingsAPICall = /** @class */ (function (_super) {
    tslib_1.__extends(SettingsAPICall, _super);
    function SettingsAPICall() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SettingsAPICall.init = function (app, game) {
        var _this = this;
        app.get('/settings', function (req, res) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var settings, e_1;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        settings = {};
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, game.databaseManager.loadSettings()];
                    case 2:
                        settings = (_a.sent());
                        delete settings._id;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4:
                        res.json(settings);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    SettingsAPICall.desc = 'Get the current game settings for the game';
    SettingsAPICall.params = '';
    return SettingsAPICall;
}(ServerAPICall_1.ServerAPICall));
exports.SettingsAPICall = SettingsAPICall;
//# sourceMappingURL=settings.js.map