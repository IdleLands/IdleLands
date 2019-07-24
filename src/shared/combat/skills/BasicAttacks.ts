
import { ICombatSkillCombinator } from '../../interfaces';
import * as Components from '../skillcomponents';

export const Attack: ICombatSkillCombinator[] = [
  Components.Description('%player attacked %target for %damage damage!')
];
