"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var uuid = require("uuid/v4");
var Choice = /** @class */ (function () {
    function Choice() {
    }
    Choice.prototype.init = function (opts) {
        lodash_1.extend(this, opts);
        if (!this.id)
            this.id = uuid();
        if (!this.foundAt)
            this.foundAt = Date.now();
    };
    return Choice;
}());
exports.Choice = Choice;
//# sourceMappingURL=Choice.js.map