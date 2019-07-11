
export enum ServerEventName {
  GameMessage = 'gamemessage',

  AuthSignIn = 'auth:signin',
  AuthSignOut = 'auth:signout',
  AuthRegister = 'auth:register',
  AuthDelete = 'auth:delete',
  AuthNeedsName = 'auth:needsname',
  AuthSyncAccount = 'auth:syncaccount',
  AuthUnsyncAccount = 'auth:unsyncaccount',
  PlayGame = 'auth:playgame',

  CharacterFirstTime = 'character:firsttime',
  CharacterSync = 'character:sync',
  CharacterPatch = 'character:patch',

  CharacterGender = 'character:gender',
  CharacterTitle = 'character:title',
  CharacterAscend = 'character:ascend',
  CharacterOOCAction = 'character:oocaction',
  CharacterDivineDirection = 'character:divinedirection',
  CharacterLeaveParty = 'character:leaveparty',

  ChatPlayerListSync = 'chat:playersync',
  ChatMessage = 'chat:message',

  ItemEquip = 'item:equip',
  ItemUnequip = 'item:unequip',
  ItemSell = 'item:sell',
  ItemLock = 'item:lock',
  ItemUnlock = 'item:unlock',
  ItemSellAll = 'item:sellall',
  ItemCompare = 'item:compare',

  PetOOCAction = 'pet:oocaction',
  PetUpgrade = 'pet:upgrade',
  PetBuy = 'pet:buy',
  PetSwap = 'pet:swap',
  PetEquip = 'pet:equip',
  PetUnequip = 'pet:unequip',

  ChoiceMake = 'choice:make',

  AdventureLogAdd = 'adventurelog:add',

  TogglePersonality = 'personality:toggle'
}

export enum PlayerChannelOperation {

  // used when a player is added to the game
  Add,

  // used any time position etc changes
  Update,

  // used when level, gender, class, title, or ascension changes
  SpecificUpdate,

  // used when a player is removed from the game
  Remove
}

export enum PartyChannelOperation {

  // used when a party is added
  Add,

  // used when a party is modified
  Update,

  // used when a party is removed
  Remove
}

export interface ServerEvent {
  event: string;
  description: string;
  args: string;

  callback: (args) => void;
}
