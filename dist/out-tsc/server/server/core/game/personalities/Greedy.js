"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _a;
var interfaces_1 = require("../../../../shared/interfaces");
var Greedy = /** @class */ (function (_super) {
    tslib_1.__extends(Greedy, _super);
    function Greedy() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Greedy.description = 'Gain 15% more GOLD at the cost of 15% XP.';
    Greedy.statMultipliers = (_a = {}, _a[interfaces_1.Stat.XP] = 0.85, _a[interfaces_1.Stat.GOLD] = 1.15, _a);
    Greedy.toggleOff = ['Seeker'];
    return Greedy;
}(interfaces_1.Personality));
exports.Greedy = Greedy;
//# sourceMappingURL=Greedy.js.map