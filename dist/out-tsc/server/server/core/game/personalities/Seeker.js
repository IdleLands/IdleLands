"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _a;
var interfaces_1 = require("../../../../shared/interfaces");
var Seeker = /** @class */ (function (_super) {
    tslib_1.__extends(Seeker, _super);
    function Seeker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Seeker.description = 'Gain 15% more XP at the cost of 15% GOLD.';
    Seeker.statMultipliers = (_a = {}, _a[interfaces_1.Stat.XP] = 1.15, _a[interfaces_1.Stat.GOLD] = 0.85, _a);
    Seeker.toggleOff = ['Greedy'];
    return Seeker;
}(interfaces_1.Personality));
exports.Seeker = Seeker;
//# sourceMappingURL=Seeker.js.map