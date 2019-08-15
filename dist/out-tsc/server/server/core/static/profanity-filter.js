"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var censor_sensor_1 = require("censor-sensor");
var censorSensor = new censor_sensor_1.CensorSensor();
exports.censorSensor = censorSensor;
censorSensor.disableTier(2);
censorSensor.disableTier(3);
censorSensor.disableTier(4);
//# sourceMappingURL=profanity-filter.js.map