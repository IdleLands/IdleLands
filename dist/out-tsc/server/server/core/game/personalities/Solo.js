"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("../../../../shared/interfaces");
var Solo = /** @class */ (function (_super) {
    tslib_1.__extends(Solo, _super);
    function Solo() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Solo.description = 'You will politely (or not-so-politely) decline all party invites.';
    Solo.statMultipliers = {};
    Solo.toggleOff = [];
    return Solo;
}(interfaces_1.Personality));
exports.Solo = Solo;
//# sourceMappingURL=Solo.js.map