
// unsure why I have to reference them exactly, otherwise Statistics is undefined
import { Choices } from '../../../shared/models/entity/Choices.entity';
import { Inventory } from '../../../shared/models/entity/Inventory.entity';
import { Statistics } from '../../../shared/models/entity/Statistics.entity';
import { Personalities } from '../../../shared/models/entity/Personalities.entity';

export const SHARED_FIELDS = [
  { proto: Choices, name: 'choices' },
  { proto: Inventory, name: 'inventory' },
  { proto: Personalities, name: 'personalities' },
  { proto: Statistics, name: 'statistics' }
];
