"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _a;
var interfaces_1 = require("../../../../shared/interfaces");
var Intelligent = /** @class */ (function (_super) {
    tslib_1.__extends(Intelligent, _super);
    function Intelligent() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Intelligent.description = 'Whenever you find an item that has a INT that exceeds your own item, you equip it automatically. INT + 5%.';
    Intelligent.statMultipliers = (_a = {}, _a[interfaces_1.Stat.INT] = 1.05, _a);
    Intelligent.toggleOff = ['Lucky', 'Strong', 'Fortuitous', 'Dextrous', 'Agile'];
    return Intelligent;
}(interfaces_1.Personality));
exports.Intelligent = Intelligent;
//# sourceMappingURL=Intelligent.js.map