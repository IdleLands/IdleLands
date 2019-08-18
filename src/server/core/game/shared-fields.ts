
// unsure why I have to reference them exactly, otherwise Statistics is undefined
import { Achievements } from '../../../shared/models/entity/Achievements.entity';
import { Collectibles } from '../../../shared/models/entity/Collectibles.entity';
import { Choices } from '../../../shared/models/entity/Choices.entity';
import { Inventory } from '../../../shared/models/entity/Inventory.entity';
import { Statistics } from '../../../shared/models/entity/Statistics.entity';
import { Personalities } from '../../../shared/models/entity/Personalities.entity';
import { Pets } from '../../../shared/models/entity/Pets.entity';
import { Premium } from '../../../shared/models/entity/Premium.entity';
import { Quests } from '../../../shared/models/entity/Quests.entity';

export const SHARED_FIELDS = [
  { proto: Achievements, name: 'achievements' },
  { proto: Collectibles, name: 'collectibles' },
  { proto: Choices, name: 'choices' },
  { proto: Inventory, name: 'inventory' },
  { proto: Personalities, name: 'personalities' },
  { proto: Statistics, name: 'statistics' },
  { proto: Pets, name: 'pets' },
  { proto: Premium, name: 'premium' },
  { proto: Quests, name: 'quests' }
];
