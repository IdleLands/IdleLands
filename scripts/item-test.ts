import { Game } from '../src/server/core/game/game';
import { ItemClass, GenerateableItemSlot } from '../src/shared/interfaces';

const init = async () => {
  const game = new Game();
  await game.init(null, 0);

  const slots = Object.values(GenerateableItemSlot);
  const ranks = Object.values(ItemClass);

  const upfgs = [];

  slots.forEach(slot => {
    ranks.forEach(rank => {
      if(rank === ItemClass.Guardian) return;

      const item = game.itemGenerator.generateItem({
        forceType: slot,
        forceClass: rank
      });

      console.log();
      console.log(slot, rank, item);

      if(item.name === 'Unfortunately Poorly Generated Item') {
        upfgs.push(`${slot}-${rank}`);
      }
    });
  });

  console.log('UPGIs: ', upfgs);

  process.exit(0);
};

init();
