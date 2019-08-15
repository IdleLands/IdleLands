"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var _a;
var interfaces_1 = require("../../../../shared/interfaces");
var Strong = /** @class */ (function (_super) {
    tslib_1.__extends(Strong, _super);
    function Strong() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Strong.description = 'Whenever you find an item that has a STR that exceeds your own item, you equip it automatically. STR + 5%.';
    Strong.statMultipliers = (_a = {}, _a[interfaces_1.Stat.STR] = 1.05, _a);
    Strong.toggleOff = ['Intelligent', 'Lucky', 'Fortuitous', 'Dextrous', 'Agile'];
    return Strong;
}(interfaces_1.Personality));
exports.Strong = Strong;
//# sourceMappingURL=Strong.js.map