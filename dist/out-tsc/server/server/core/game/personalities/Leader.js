"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Leader = /** @class */ (function (_super) {
    tslib_1.__extends(Leader, _super);
    function Leader() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Leader.description = 'You will lead parties, but will not join one.';
    Leader.statMultipliers = {};
    Leader.toggleOff = ['Follower'];
    return Leader;
}(interfaces_1.Personality));
exports.Leader = Leader;
//# sourceMappingURL=Leader.js.map