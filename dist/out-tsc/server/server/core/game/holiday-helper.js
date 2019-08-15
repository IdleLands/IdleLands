"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var Holiday;
(function (Holiday) {
    Holiday["Valentine"] = "valentine";
    Holiday["Leprechaun"] = "leprechaun";
    Holiday["Eggs"] = "eggs";
    Holiday["Anniversary"] = "anniversary";
    Holiday["Fireworks"] = "fireworks";
    Holiday["School"] = "school";
    Holiday["Hallows"] = "hallows";
    Holiday["Turkeys"] = "turkeys";
    Holiday["Winter"] = "winter";
})(Holiday = exports.Holiday || (exports.Holiday = {}));
var HolidayHelper = /** @class */ (function () {
    function HolidayHelper() {
        this.holidays = {
            valentine: {
                start: new Date('Feb 1'),
                end: new Date('Feb 28')
            },
            leprechaun: {
                start: new Date('Mar 1'),
                end: new Date('Mar 31')
            },
            eggs: {
                start: new Date('Apr 1'),
                end: new Date('Apr 30')
            },
            anniversary: {
                start: new Date('Jun 1'),
                end: new Date('Jun 30')
            },
            fireworks: {
                start: new Date('Jul 1'),
                end: new Date('Jul 31')
            },
            school: {
                start: new Date('Sep 1'),
                end: new Date('Sep 30')
            },
            hallows: {
                start: new Date('Oct 1'),
                end: new Date('Oct 31')
            },
            turkeys: {
                start: new Date('Nov 1'),
                end: new Date('Nov 31')
            },
            winter: {
                start: new Date('Dec 1'),
                end: new Date('Dec 31')
            }
        };
    }
    HolidayHelper.prototype.isHoliday = function (holiday) {
        var holidayRef = this.holidays[holiday];
        if (!holidayRef)
            return false;
        var start = holidayRef.start, end = holidayRef.end;
        var today = new Date();
        return today.getMonth() >= start.getMonth()
            && today.getDate() >= start.getDate()
            && today.getMonth() <= end.getMonth()
            && today.getDate() <= end.getDate();
    };
    HolidayHelper = tslib_1.__decorate([
        typescript_ioc_1.Singleton,
        typescript_ioc_1.AutoWired
    ], HolidayHelper);
    return HolidayHelper;
}());
exports.HolidayHelper = HolidayHelper;
//# sourceMappingURL=holiday-helper.js.map