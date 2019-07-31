
import { ICombatSkillCombinator, PetAttribute } from '../../interfaces';

/**
 * These abilities are locked to 5* pets per their attribute.
 */
export const AttributeSkillMap: { [key in PetAttribute]: Array<{ weight: number, skills: ICombatSkillCombinator[][] }> } = {
  [PetAttribute.Alchemist]: [
  ],
  [PetAttribute.Blessed]: [
  ],
  [PetAttribute.Cursed]: [
  ],
  [PetAttribute.Fateful]: [
  ],
  [PetAttribute.Golden]: [
  ],
  [PetAttribute.Surging]: [
  ],
  [PetAttribute.Trueseer]: [
  ]
};
