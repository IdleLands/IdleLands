"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var interfaces_1 = require("../../interfaces");
var skillcomponents_1 = require("../skillcomponents");
/**
 * These abilities are locked to 5* pets per their attribute.
 */
exports.AttributeSkillMap = (_a = {},
    _a[interfaces_1.PetAttribute.Alchemist] = [
        { weight: 1,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] > 30; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, -30)
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllEnemies), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.Description('%source threw a stat-confusion potion at %target!')
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllEnemies), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.STR, function (caster, target) { return -target.stats[interfaces_1.Stat.STR] * 0.2; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllEnemies), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.INT, function (caster, target) { return -target.stats[interfaces_1.Stat.INT] * 0.2; })
                ]
            ] }
    ],
    _a[interfaces_1.PetAttribute.Blessed] = [
        // revive
        { weight: 1,
            canUse: function (caster, combat) { return skillcomponents_1.NumberOfTargets(skillcomponents_1.Targetting.DeadAlly, caster, combat) > 0; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.DeadAlly), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(100),
                    skillcomponents_1.Description('%source revived %target from their untimely demise!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster, target) { return Math.max(1, target.maxStats[interfaces_1.Stat.HP] / 100); })
                ]
            ] },
    ],
    _a[interfaces_1.PetAttribute.Cursed] = [
        // life force bomb
        { weight: 1,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.HP] > 10; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster) { return -caster.stats[interfaces_1.Stat.HP] * 0.3; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(80),
                    skillcomponents_1.Description('%source channeled a massive life force bomb at %target and dealt %value damage!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster) { return -caster.stats[interfaces_1.Stat.HP] * 0.7; })
                ]
            ] },
    ],
    _a[interfaces_1.PetAttribute.Ferocious] = [
        { weight: 1,
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy),
                    skillcomponents_1.SameTarget([
                        skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                        skillcomponents_1.Description('%source bit %target with poison fangs and dealt %value damage!'),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.DEX] * 2.0; }, function (caster) { return caster.stats[interfaces_1.Stat.DEX] * 2.5; }))
                    ], [
                        skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90), skillcomponents_1.Delay(1), skillcomponents_1.Duration(5),
                        skillcomponents_1.Description('%target took %value damage from %source\'s poison!'),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.DEX] * 0.5; }, function (caster) { return caster.stats[interfaces_1.Stat.DEX] * 0.8; }))
                    ])
                ]
            ] },
    ],
    _a[interfaces_1.PetAttribute.Fateful] = [
        { weight: 1, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.Description('%source cried out in terror!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, -1)
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.AllEnemies), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Delay(1), skillcomponents_1.Duration(2), skillcomponents_1.Accuracy(90),
                    skillcomponents_1.Description('%source cried out in terror at %target and dealt %value damage!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster, target) { return -target.maxStats[interfaces_1.Stat.HP] / 10; })
                ]
            ] },
    ],
    _a[interfaces_1.PetAttribute.Golden] = [
        { weight: 4,
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleAlly),
                    skillcomponents_1.SameTarget([
                        skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(100),
                        skillcomponents_1.Description('%source fed a golden leaf to %target which healed %value health!'),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.CON] * 4.0; }, function (caster) { return caster.stats[interfaces_1.Stat.CON] * 5.5; }, true))
                    ], [
                        skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(100),
                        skillcomponents_1.StatMod(interfaces_1.Stat.CON, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.CON] * 2.5; }, function (caster) { return caster.stats[interfaces_1.Stat.CON] * 3.5; }))
                    ])
                ]
            ] },
    ],
    _a[interfaces_1.PetAttribute.Surging] = [
        // frostbite
        { weight: 1,
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy),
                    skillcomponents_1.SameTarget([
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.Description('%source shot a lance of energy through %target and dealt %value damage!'),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.INT] * 3.5; }, function (caster) { return caster.stats[interfaces_1.Stat.INT] * 4.0; }))
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.DEX, function (caster, target) { return target.maxStats[interfaces_1.Stat.DEX] / 10; })
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.AGI, function (caster, target) { return target.maxStats[interfaces_1.Stat.AGI] / 10; })
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.INT, function (caster, target) { return target.maxStats[interfaces_1.Stat.INT] / 10; })
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.STR, function (caster, target) { return target.maxStats[interfaces_1.Stat.STR] / 10; })
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.LUK, function (caster, target) { return target.maxStats[interfaces_1.Stat.LUK] / 10; })
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.CON, function (caster, target) { return target.maxStats[interfaces_1.Stat.CON] / 10; })
                    ])
                ]
            ] },
    ],
    _a[interfaces_1.PetAttribute.Trueseer] = [
        { weight: 1, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleAlly),
                    skillcomponents_1.SameTarget([
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.STR, function (caster, target) { return target.maxStats[interfaces_1.Stat.STR] / 10; }),
                        skillcomponents_1.Description('%source saw the future STR of %target and helped by boosting it by %value!'),
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.INT, function (caster, target) { return target.maxStats[interfaces_1.Stat.INT] / 10; }),
                        skillcomponents_1.Description('%source saw the future INT of %target and helped by boosting it by %value!'),
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.AGI, function (caster, target) { return target.maxStats[interfaces_1.Stat.AGI] / 10; }),
                        skillcomponents_1.Description('%source saw the future AGI of %target and helped by boosting it by %value!'),
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.DEX, function (caster, target) { return target.maxStats[interfaces_1.Stat.DEX] / 10; }),
                        skillcomponents_1.Description('%source saw the future DEX of %target and helped by boosting it by %value!'),
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.CON, function (caster, target) { return target.maxStats[interfaces_1.Stat.CON] / 10; }),
                        skillcomponents_1.Description('%source saw the future CON of %target and helped by boosting it by %value!'),
                    ], [
                        skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.LUK, function (caster, target) { return target.maxStats[interfaces_1.Stat.LUK] / 10; }),
                        skillcomponents_1.Description('%source saw the future LUK of %target and helped by boosting it by %value!'),
                    ])
                ]
            ] },
    ],
    _a);
//# sourceMappingURL=attribute.js.map