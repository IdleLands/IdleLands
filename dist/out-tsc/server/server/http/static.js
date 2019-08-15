"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var express = require("express");
var path = require("path");
var ServerAPICall_1 = require("../../shared/models/ServerAPICall");
var StaticAPICall = /** @class */ (function (_super) {
    tslib_1.__extends(StaticAPICall, _super);
    function StaticAPICall() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    StaticAPICall.init = function (app, game) {
        app.use('/static', express.static(path.join(__dirname, '../../../assets/maps/img')));
    };
    StaticAPICall.desc = 'Static file serving.';
    StaticAPICall.params = '';
    return StaticAPICall;
}(ServerAPICall_1.ServerAPICall));
exports.StaticAPICall = StaticAPICall;
//# sourceMappingURL=static.js.map