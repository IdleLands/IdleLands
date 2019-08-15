"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _a;
var interfaces_1 = require("../../../../shared/interfaces");
var Lucky = /** @class */ (function (_super) {
    tslib_1.__extends(Lucky, _super);
    function Lucky() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Lucky.description = 'Whenever you find an item that has a LUK that exceeds your own item, you equip it automatically. LUK + 5%.';
    Lucky.statMultipliers = (_a = {}, _a[interfaces_1.Stat.LUK] = 1.05, _a);
    Lucky.toggleOff = ['Intelligent', 'Strong', 'Fortuitous', 'Dextrous', 'Agile'];
    return Lucky;
}(interfaces_1.Personality));
exports.Lucky = Lucky;
//# sourceMappingURL=Lucky.js.map