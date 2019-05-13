
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

  CharacterSync = 'character:sync',
  CharacterPatch = 'character:patch',

  CharacterGender = 'character:gender',
  CharacterTitle = 'character:title',
  CharacterAscend = 'character:ascend',
  CharacterOOCAction = 'character:oocaction',
  CharacterDivineDirection = 'character:divinedirection',

  ItemEquip = 'item:equip',
  ItemUnequip = 'item:unequip',
  ItemSell = 'item:sell',
  ItemLock = 'item:lock',
  ItemUnlock = 'item:unlock',
  ItemSellAll = 'item:sellall',
  ItemCompare = 'item:compare',

  ChoiceMake = 'choice:make',

  AdventureLogAdd = 'adventurelog:add',

  TogglePersonality = 'personality:toggle'
}

export enum PlayerChannelOperation {
  Add,
  Remove
}

export interface ServerEvent {
  event: string;
  description: string;
  args: string;

  callback: (args) => void;
}
