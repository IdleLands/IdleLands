"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var mongodb_1 = require("mongodb");
var IL3Linker = /** @class */ (function () {
    function IL3Linker() {
    }
    IL3Linker.prototype.getIL3Stats = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var url, client, achColl, achievements, achievementR, il3;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = process.env.IDLELANDS3_MONGODB_URI;
                        if (!url)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, mongodb_1.MongoClient.connect(url)];
                    case 1:
                        client = _a.sent();
                        achColl = client.db('idlelands').collection('achievements');
                        return [4 /*yield*/, achColl.findOne({ _id: name })];
                    case 2:
                        achievements = _a.sent();
                        client.close();
                        if (!achievements || !achievements.achievements)
                            return [2 /*return*/, null];
                        achievementR = achievements.achievements;
                        il3 = {
                            Ancient: false,
                            Donator: false,
                            Contributor: false,
                            Ascensions: 0,
                            Wolfmaster: false,
                            Spiritualist: false,
                            Anniversary: 0
                        };
                        if (achievementR.Ancient)
                            il3.Ancient = true;
                        if (achievementR.Donator)
                            il3.Donator = true;
                        if (achievementR.Contributor)
                            il3.Contributor = true;
                        if (achievementR.Ascended)
                            il3.Ascensions = achievementR.Ascended ? achievementR.Ascended.tier : 0;
                        if (achievementR.Wolfmaster)
                            il3.Wolfmaster = true;
                        if (achievementR.Spiritualist)
                            il3.Spiritualist = true;
                        if (achievementR.Anniversary)
                            il3.Anniversary = achievementR.Anniversary ? achievementR.Anniversary.tier : 0;
                        return [2 /*return*/, il3];
                }
            });
        });
    };
    IL3Linker = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], IL3Linker);
    return IL3Linker;
}());
exports.IL3Linker = IL3Linker;
//# sourceMappingURL=il3-linker.js.map