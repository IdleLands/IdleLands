
import { ICombatSkillCombinator } from '../../interfaces';
import * as Components from '../skillcomponents';
import { Targetting } from '../skillcomponents';

export const Attack: ICombatSkillCombinator[] = [
  Components.Description('%player attacked %target for %damage damage!'),
  Components.Targets(Targetting.SingleEnemy),
  Components.EffectsPerTarget(1),
  Components.Accuracy(90)
];
