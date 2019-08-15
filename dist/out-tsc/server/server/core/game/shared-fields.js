"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// unsure why I have to reference them exactly, otherwise Statistics is undefined
var Achievements_entity_1 = require("../../../shared/models/entity/Achievements.entity");
var Collectibles_entity_1 = require("../../../shared/models/entity/Collectibles.entity");
var Choices_entity_1 = require("../../../shared/models/entity/Choices.entity");
var Inventory_entity_1 = require("../../../shared/models/entity/Inventory.entity");
var Statistics_entity_1 = require("../../../shared/models/entity/Statistics.entity");
var Personalities_entity_1 = require("../../../shared/models/entity/Personalities.entity");
var Pets_entity_1 = require("../../../shared/models/entity/Pets.entity");
var Premium_entity_1 = require("../../../shared/models/entity/Premium.entity");
exports.SHARED_FIELDS = [
    { proto: Achievements_entity_1.Achievements, name: 'achievements' },
    { proto: Collectibles_entity_1.Collectibles, name: 'collectibles' },
    { proto: Choices_entity_1.Choices, name: 'choices' },
    { proto: Inventory_entity_1.Inventory, name: 'inventory' },
    { proto: Personalities_entity_1.Personalities, name: 'personalities' },
    { proto: Statistics_entity_1.Statistics, name: 'statistics' },
    { proto: Pets_entity_1.Pets, name: 'pets' },
    { proto: Premium_entity_1.Premium, name: 'premium' }
];
//# sourceMappingURL=shared-fields.js.map