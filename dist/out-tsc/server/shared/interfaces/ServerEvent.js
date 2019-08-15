"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ServerEventName;
(function (ServerEventName) {
    ServerEventName["GameMessage"] = "gamemessage";
    ServerEventName["AuthSignIn"] = "auth:signin";
    ServerEventName["AuthSignOut"] = "auth:signout";
    ServerEventName["AuthRegister"] = "auth:register";
    ServerEventName["AuthDelete"] = "auth:delete";
    ServerEventName["AuthNeedsName"] = "auth:needsname";
    ServerEventName["AuthSyncAccount"] = "auth:syncaccount";
    ServerEventName["AuthUnsyncAccount"] = "auth:unsyncaccount";
    ServerEventName["PlayGame"] = "auth:playgame";
    ServerEventName["CharacterFirstTime"] = "character:firsttime";
    ServerEventName["CharacterSync"] = "character:sync";
    ServerEventName["CharacterPatch"] = "character:patch";
    ServerEventName["CharacterGender"] = "character:gender";
    ServerEventName["CharacterTitle"] = "character:title";
    ServerEventName["CharacterAscend"] = "character:ascend";
    ServerEventName["CharacterOOCAction"] = "character:oocaction";
    ServerEventName["CharacterDivineDirection"] = "character:divinedirection";
    ServerEventName["CharacterLeaveParty"] = "character:leaveparty";
    ServerEventName["CharacterDiscordTag"] = "character:changediscordtag";
    ServerEventName["CharacterChangeIdlelands3"] = "character:changeidlelands3";
    ServerEventName["ChatPlayerListSync"] = "chat:playersync";
    ServerEventName["ChatMessage"] = "chat:message";
    ServerEventName["ItemEquip"] = "item:equip";
    ServerEventName["ItemUnequip"] = "item:unequip";
    ServerEventName["ItemSell"] = "item:sell";
    ServerEventName["ItemLock"] = "item:lock";
    ServerEventName["ItemUnlock"] = "item:unlock";
    ServerEventName["ItemSellAll"] = "item:sellall";
    ServerEventName["ItemCompare"] = "item:compare";
    ServerEventName["ItemTeleportScroll"] = "item:teleportscroll";
    ServerEventName["ItemBuffScroll"] = "item:buffscroll";
    ServerEventName["PetOOCAction"] = "pet:oocaction";
    ServerEventName["PetUpgrade"] = "pet:upgrade";
    ServerEventName["PetBuy"] = "pet:buy";
    ServerEventName["PetSwap"] = "pet:swap";
    ServerEventName["PetEquip"] = "pet:equip";
    ServerEventName["PetUnequip"] = "pet:unequip";
    ServerEventName["PetAscend"] = "pet:ascend";
    ServerEventName["PetGoldAction"] = "pet:takegold";
    ServerEventName["PetRerollName"] = "pet:rerollname";
    ServerEventName["PetRerollAttribute"] = "pet:rerollattribute";
    ServerEventName["PetRerollAffinity"] = "pet:rerollaffinity";
    ServerEventName["PetRerollGender"] = "pet:rerollgender";
    ServerEventName["PetAdventureEmbark"] = "pet:adventure:embark";
    ServerEventName["PetAdventureFinish"] = "pet:adventure:finish";
    ServerEventName["PetAdventureRewards"] = "pet:adventure:rewards";
    ServerEventName["AstralGateRoll"] = "astralgate:roll";
    ServerEventName["AstralGateRewards"] = "astralgate:rewards";
    ServerEventName["PremiumUpgrade"] = "premium:upgrade";
    ServerEventName["PremiumFestival"] = "premium:festival";
    ServerEventName["PremiumOther"] = "premium:other";
    ServerEventName["ChoiceMake"] = "choice:make";
    ServerEventName["AdventureLogAdd"] = "adventurelog:add";
    ServerEventName["TogglePersonality"] = "personality:toggle";
    ServerEventName["GMSetMOTD"] = "gm:setmotd";
    ServerEventName["GMChangeModTier"] = "gm:modtier";
    ServerEventName["GMStartFestival"] = "gm:startfestival";
    ServerEventName["GMToggleMute"] = "gm:togglemute";
    ServerEventName["GMSetStatistic"] = "gm:setstatistic";
    ServerEventName["GMSetName"] = "gm:setname";
    ServerEventName["GMSetLevel"] = "gm:setlevel";
    ServerEventName["GMGiveILP"] = "gm:giveilp";
    ServerEventName["GMGiveGold"] = "gm:givegold";
    ServerEventName["GMGiveItem"] = "gm:giveitem";
    ServerEventName["GMPortCharacterId"] = "gm:portcharacterid";
})(ServerEventName = exports.ServerEventName || (exports.ServerEventName = {}));
var PlayerChannelOperation;
(function (PlayerChannelOperation) {
    // used when a player is added to the game
    PlayerChannelOperation[PlayerChannelOperation["Add"] = 0] = "Add";
    // used any time position etc changes
    PlayerChannelOperation[PlayerChannelOperation["Update"] = 1] = "Update";
    // used when level, gender, class, title, or ascension changes
    PlayerChannelOperation[PlayerChannelOperation["SpecificUpdate"] = 2] = "SpecificUpdate";
    // used when a player is removed from the game
    PlayerChannelOperation[PlayerChannelOperation["Remove"] = 3] = "Remove";
})(PlayerChannelOperation = exports.PlayerChannelOperation || (exports.PlayerChannelOperation = {}));
var PartyChannelOperation;
(function (PartyChannelOperation) {
    // used when a party is added
    PartyChannelOperation[PartyChannelOperation["Add"] = 0] = "Add";
    // used when a party is modified
    PartyChannelOperation[PartyChannelOperation["Update"] = 1] = "Update";
    // used when a party is removed
    PartyChannelOperation[PartyChannelOperation["Remove"] = 2] = "Remove";
})(PartyChannelOperation = exports.PartyChannelOperation || (exports.PartyChannelOperation = {}));
//# sourceMappingURL=ServerEvent.js.map