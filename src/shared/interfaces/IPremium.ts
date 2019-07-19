
export enum PermanentUpgrade {

  // the permanent inventory size boost for buying this pet
  InventorySizeBoost = 'inventorySizeBoost',

  // the permanent soul storage size boost for buying this pet
  BuffScrollDuration = 'buffScrollDurationBoost',

  // the permanent adventure log size boost for buying this pet
  AdventureLogSizeBoost = 'adventureLogSizeBoost',

  // the permanent choice log size boost for buying this pet
  ChoiceLogSizeBoost = 'choiceLogSizeBoost',

  // the permanent enchant cap boost for buying this pet
  EnchantCapBoost = 'enchantCapBoost',

  // the permanent item stat cap % boost for buying this pet
  ItemStatCapBoost = 'itemStatCapBoost'

}

export enum PremiumTier {
  None = 0,
  Donator = 1,
  Subscriber = 2,
  Moderator = 5,
  Contributor = 5,
  GM = 10
}

export const PremiumScale = {
  [PermanentUpgrade.AdventureLogSizeBoost]: 5,
  [PermanentUpgrade.ChoiceLogSizeBoost]: 10,
  [PermanentUpgrade.EnchantCapBoost]: 100,
  [PermanentUpgrade.InventorySizeBoost]: 50,
  [PermanentUpgrade.BuffScrollDuration]: 150,
  [PermanentUpgrade.ItemStatCapBoost]: 25
};
