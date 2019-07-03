import { Singleton, AutoWired } from 'typescript-ioc';
import { PetAttribute, Stat, IPet, IPlayer, IPetProto, PermanentPetUpgrade } from '../../../shared/interfaces';

@Singleton
@AutoWired
export class PetHelper {

  buyPet(forPlayer: IPlayer, petProto: IPetProto): IPet {
    // create pet
    // sync base stats to pet
    // sync player premium stats based on pet
    return null;
  }

  createPet(forPlayer: IPlayer, petProto: IPetProto): IPet {
    // set gender based on player gender (randomly)
    // set attribute randomly (if unspecified)
    // set affinity randomly (if unspecified)
    return null;
  }

  syncBasePetStats(pet: IPet): void {
    // compare base soul vs type soul
  }

  getSoulStatsForAttribute(attribute: PetAttribute): { [key in Stat]?: number } {
    return {};
  }

  getPermanentUpgradesForPet(pet: IPetProto): { [key in PermanentPetUpgrade]?: number } {
    return null;
  }

}
