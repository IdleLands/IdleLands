"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _a;
var interfaces_1 = require("../../interfaces");
var all_1 = require("./all");
var skillcomponents_1 = require("../skillcomponents");
/**
 * These abilities are locked to pets of a certain attribute.
 */
exports.AffinitySkillMap = (_a = {},
    _a[interfaces_1.PetAffinity.None] = [
        { weight: 1, skills: [all_1.Attack()] }
    ],
    _a[interfaces_1.PetAffinity.Attacker] = [
        { weight: 7, skills: [all_1.Attack()] },
        // double attack
        { weight: 3, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(2), skillcomponents_1.Accuracy(75),
                    skillcomponents_1.Description('%source attacked %target for %value damage!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (attacker) { return attacker.stats[interfaces_1.Stat.STR] * 0.1; }, function (attacker) { return attacker.stats[interfaces_1.Stat.STR] * 0.9; }))
                ]
            ] },
        // wild swing
        { weight: 1, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(25),
                    skillcomponents_1.StatMod(interfaces_1.Stat.LUK, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.STR] * 3; }, function (caster) { return caster.stats[interfaces_1.Stat.STR] * 5; })),
                    skillcomponents_1.Description('%source threw a wild swing at %target which dealt %value damage!'),
                ]
            ] },
    ],
    _a[interfaces_1.PetAffinity.Buffer] = [
        { weight: 10, skills: [all_1.Attack()] },
        // fortify dex/agi/con
        { weight: 1, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleAlly), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.AGI, function (caster, target) { return target.maxStats[interfaces_1.Stat.AGI] / 20; }),
                    skillcomponents_1.Description('%source boosted %target\'s AGI by %value!'),
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleAlly), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.DEX, function (caster, target) { return target.maxStats[interfaces_1.Stat.DEX] / 20; }),
                    skillcomponents_1.Description('%source boosted %target\'s DEX by %value!'),
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleAlly), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.CON, function (caster, target) { return target.maxStats[interfaces_1.Stat.CON] / 20; }),
                    skillcomponents_1.Description('%source boosted %target\'s CON by %value!'),
                ]
            ] },
        // fortify int/str/luk
        { weight: 1, skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleAlly), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.STR, function (caster, target) { return target.maxStats[interfaces_1.Stat.STR] / 20; }),
                    skillcomponents_1.Description('%source boosted %target\'s STR by %value!'),
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleAlly), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.INT, function (caster, target) { return target.maxStats[interfaces_1.Stat.INT] / 20; }),
                    skillcomponents_1.Description('%source boosted %target\'s INT by %value!'),
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleAlly), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.LUK, function (caster, target) { return target.maxStats[interfaces_1.Stat.LUK] / 20; }),
                    skillcomponents_1.Description('%source boosted %target\'s LUK by %value!'),
                ]
            ] },
    ],
    _a[interfaces_1.PetAffinity.Caster] = [
        { weight: 10, skills: [all_1.Attack()] },
        // firestorm
        { weight: 5,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.SPECIAL] >= caster.maxStats[interfaces_1.Stat.SPECIAL] / 10; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, function (caster) { return -caster.maxStats[interfaces_1.Stat.SPECIAL] / 10; })
                ]
            ].concat(Array(3).fill([
                skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(85),
                skillcomponents_1.Description('%source flung a fire pebble at %target and dealt %value damage!'),
                skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.INT] * 0.5; }, function (caster) { return caster.stats[interfaces_1.Stat.INT] * 0.7; }))
            ])) },
        // drain
        { weight: 3,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.HP] >= caster.maxStats[interfaces_1.Stat.HP] / 20; },
            skills: function (combat, caster) {
                // 1+ because otherwise if it does (min, max) and they're both 0 it throws
                var min = caster.stats[interfaces_1.Stat.INT] * 0.1;
                var damage = combat.chance.integer({
                    min: min,
                    max: Math.max(min + 1, (caster.stats[interfaces_1.Stat.INT] * 0.5))
                });
                return [
                    [
                        skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, damage)
                    ],
                    [
                        skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                        skillcomponents_1.Description('%source drained %target of %value of their health!'),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, function () { return -damage; })
                    ]
                ];
            } },
    ],
    _a[interfaces_1.PetAffinity.Defender] = [
        { weight: 10, skills: [all_1.Attack()] },
        // darkside
        { weight: 3,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.HP] > 10; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster) { return -caster.stats[interfaces_1.Stat.HP] * 0.1; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                    skillcomponents_1.Description('%source unleashed their dark side on %target and dealt %value damage!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster) { return -caster.stats[interfaces_1.Stat.HP] * 0.3; })
                ]
            ] },
        // relentless assault
        { weight: 1,
            canUse: function (caster) { return caster.stats[interfaces_1.Stat.HP] > 10; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster) { return -caster.stats[interfaces_1.Stat.HP] * 0.3; })
                ]
            ].concat(Array(10).fill([
                skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(50),
                skillcomponents_1.Description('%source unleashed a relentless assault on %target and dealt %value damage!'),
                skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return (caster.stats[interfaces_1.Stat.CON] + caster.stats[interfaces_1.Stat.STR]) * 0.05; }, function (caster) { return (caster.stats[interfaces_1.Stat.CON] + caster.stats[interfaces_1.Stat.STR]) * 0.1; }))
            ])) },
    ],
    _a[interfaces_1.PetAffinity.Healer] = [
        { weight: 10, skills: [all_1.Attack()] },
        // heal
        { weight: 5,
            canUse: function (caster, combat) { return caster.stats[interfaces_1.Stat.SPECIAL] >= caster.maxStats[interfaces_1.Stat.SPECIAL] / 10
                && skillcomponents_1.NumberOfTargets(skillcomponents_1.Targetting.InjuredAlly, caster, combat) > 0; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, function (caster) { return -caster.stats[interfaces_1.Stat.SPECIAL] / 10; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.InjuredAlly), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                    skillcomponents_1.Description('%source surrounded %target with a holy aura and healed %value health!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.INT] * 2.0; }, function (caster) { return caster.stats[interfaces_1.Stat.INT] * 3.0; }, true))
                ]
            ] },
        // revive
        { weight: 1,
            canUse: function (caster, combat) { return caster.stats[interfaces_1.Stat.SPECIAL] >= caster.maxStats[interfaces_1.Stat.SPECIAL] / 20
                && skillcomponents_1.NumberOfTargets(skillcomponents_1.Targetting.DeadAlly, caster, combat) > 0; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.SPECIAL, function (caster) { return -caster.stats[interfaces_1.Stat.SPECIAL] / 20; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.DeadAlly), skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(100),
                    skillcomponents_1.Description('%source revived %target from their untimely demise!'),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster, target) { return Math.max(1, target.maxStats[interfaces_1.Stat.HP] / 20); })
                ]
            ] },
    ],
    _a[interfaces_1.PetAffinity.Hunter] = [
        { weight: 10, skills: [all_1.Attack()] },
        // fire burn
        { weight: 4,
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy),
                    skillcomponents_1.SameTarget([
                        skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                        skillcomponents_1.Description('%source forced %target to eat a burnt lettuce head which dealt %value damage!'),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.STR] * 0.7; }, function (caster) { return caster.stats[interfaces_1.Stat.STR] * 1.3; }))
                    ], [
                        skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90), skillcomponents_1.Delay(1), skillcomponents_1.Duration(skillcomponents_1.RandomNumber(1, 3)),
                        skillcomponents_1.Description('%target took %value heartburn damage from %source\'s burnt lettuce head!'),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster, target) { return target.stats[interfaces_1.Stat.CON] * 0.3; }, function (caster, target) { return target.stats[interfaces_1.Stat.CON] * 0.4; }))
                    ])
                ]
            ] },
        // poison bite
        { weight: 2,
            canUse: function (caster, combat) { return caster.stats[interfaces_1.Stat.HP] >= caster.stats[interfaces_1.Stat.HP] / 10; },
            skills: [
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.Self), skillcomponents_1.EffectsPerTarget(1),
                    skillcomponents_1.StatMod(interfaces_1.Stat.HP, function (caster, combat) { return -caster.stats[interfaces_1.Stat.HP] / 10; })
                ],
                [
                    skillcomponents_1.Targets(skillcomponents_1.Targetting.SingleEnemy),
                    skillcomponents_1.SameTarget([
                        skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90),
                        skillcomponents_1.Description('%source bit %target with poison fangs and dealt %value damage!'),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.DEX] * 1.0; }, function (caster) { return caster.stats[interfaces_1.Stat.DEX] * 2.0; }))
                    ], [
                        skillcomponents_1.EffectsPerTarget(1), skillcomponents_1.Accuracy(90), skillcomponents_1.Delay(1), skillcomponents_1.Duration(5),
                        skillcomponents_1.Description('%target took %value damage from %source\'s poison bite!'),
                        skillcomponents_1.StatMod(interfaces_1.Stat.HP, skillcomponents_1.RandomNumber(function (caster) { return caster.stats[interfaces_1.Stat.DEX] * 0.4; }, function (caster) { return caster.stats[interfaces_1.Stat.DEX] * 0.6; }))
                    ])
                ]
            ] },
    ],
    _a);
//# sourceMappingURL=affinity.js.map