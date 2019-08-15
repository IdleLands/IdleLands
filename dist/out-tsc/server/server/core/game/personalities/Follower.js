"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Follower = /** @class */ (function (_super) {
    tslib_1.__extends(Follower, _super);
    function Follower() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Follower.description = 'You will join parties, but will not lead one.';
    Follower.statMultipliers = {};
    Follower.toggleOff = ['Leader'];
    return Follower;
}(interfaces_1.Personality));
exports.Follower = Follower;
//# sourceMappingURL=Follower.js.map