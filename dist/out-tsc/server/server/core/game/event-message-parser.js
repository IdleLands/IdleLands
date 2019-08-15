"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typescript_ioc_1 = require("typescript-ioc");
var lodash_1 = require("lodash");
var asset_manager_1 = require("./asset-manager");
var rng_service_1 = require("./rng-service");
var player_manager_1 = require("./player-manager");
var logger_1 = require("../logger");
var party_manager_1 = require("./party-manager");
var world_1 = require("./world");
var EventVariableCache = /** @class */ (function () {
    function EventVariableCache() {
        this.cache = {};
    }
    EventVariableCache.prototype.get = function (domain, funct, num) {
        if (isNaN(num))
            throw new Error('Cache:get num cannot be NaN');
        return lodash_1.get(this.cache, domain + "." + funct + "." + num);
    };
    EventVariableCache.prototype.set = function (domain, funct, num, val) {
        if (isNaN(num))
            throw new Error('Cache:set num cannot be NaN');
        lodash_1.set(this.cache, domain + "." + funct + "." + num, val);
    };
    return EventVariableCache;
}());
var EventMessageParser = /** @class */ (function () {
    function EventMessageParser() {
    }
    EventMessageParser.prototype.dict = function (props) {
        var funct = props[0].funct;
        var normalizedFunct = funct.toLowerCase();
        var isPlural = false;
        if (normalizedFunct === 'nouns') {
            isPlural = true;
            normalizedFunct = 'noun';
        }
        var canLowercase = normalizedFunct !== 'deity';
        var chosenItem = lodash_1.sample(this.assetManager.allStringAssets[normalizedFunct]) || this.placeholder();
        if (canLowercase) {
            chosenItem = normalizedFunct === funct ? chosenItem.toLowerCase() : lodash_1.capitalize(chosenItem);
        }
        if (normalizedFunct === 'noun' && !isPlural) {
            chosenItem = chosenItem.substring(0, chosenItem.length - 1); // supposedly, all nouns are plural
        }
        return chosenItem;
    };
    EventMessageParser.prototype.chance = function (props) {
        var _a = props[0], funct = _a.funct, args = _a.args;
        if (!this.rng.chance[funct])
            return this.placeholder();
        return this.rng.chance[funct](args);
    };
    EventMessageParser.prototype.placeholder = function () {
        return lodash_1.sample(this.assetManager.allStringAssets.placeholder);
    };
    EventMessageParser.prototype.combatParty = function (props, cache, partyData) {
        var _a = props[0], funct = _a.funct, cacheNum = _a.cacheNum;
        if (funct === 'member') {
            return partyData.players[cacheNum] ? partyData.players[cacheNum] : this.placeholder();
        }
        return this.placeholder();
    };
    EventMessageParser.prototype.combat = function (props, cache, combatData) {
        var _a = props[0], funct = _a.funct, cacheNum = _a.cacheNum;
        if (props[1]) {
            return this.combatParty([props[1]], cache, combatData.parties[cacheNum]);
        }
        if (funct === 'party') {
            return combatData.parties[cacheNum].name;
        }
        return this.placeholder();
    };
    EventMessageParser.prototype.town = function () {
        return lodash_1.sample(['Norkos', 'Maeles', 'Vocalnus', 'Raburro', 'Homlet', 'Frigri', 'Astral', 'Desert', 'Tree']) + ' Town';
    };
    EventMessageParser.prototype.map = function () {
        var map = lodash_1.sample(this.world.mapNames);
        if (!map)
            return this.placeholder();
        return map;
    };
    EventMessageParser.prototype.pet = function () {
        var player = lodash_1.sample(this.playerManager.allPlayers);
        if (!player)
            return this.placeholder();
        return lodash_1.sample(Object.values(player.$pets.$petsData.allPets)).name;
    };
    EventMessageParser.prototype.activePet = function () {
        var player = lodash_1.sample(this.playerManager.allPlayers);
        if (!player)
            return this.placeholder();
        return player.$pets.$activePet.name;
    };
    // TODO: implement this
    EventMessageParser.prototype.guild = function () {
        return this.placeholder();
    };
    EventMessageParser.prototype.party = function () {
        var party = lodash_1.sample(this.partyManager.partyNames);
        return party ? party : this.placeholder();
    };
    EventMessageParser.prototype.item = function () {
        var player = lodash_1.sample(this.playerManager.allPlayers);
        var item = lodash_1.sample(lodash_1.values(player.$inventoryData.equipment));
        return item ? item.fullName() : this.placeholder();
    };
    EventMessageParser.prototype.class = function () {
        return lodash_1.sample(this.assetManager.allStringAssets.class);
    };
    // TODO: make it so you can get all but a particular player
    EventMessageParser.prototype.player = function () {
        return lodash_1.sample(this.playerManager.allPlayers).fullName();
    };
    EventMessageParser.prototype.monster = function () {
        return lodash_1.sample(this.assetManager.allObjectAssets.monster).name;
    };
    EventMessageParser.prototype.ingredient = function () {
        var type = lodash_1.sample(['veg', 'meat', 'bread']);
        return lodash_1.sample(this.assetManager.allObjectAssets[type]).name;
    };
    EventMessageParser.prototype.ownedPet = function (player) {
        return lodash_1.sample(Object.values(player.$pets.$petsData.allPets)).name;
    };
    // TODO: implement this
    EventMessageParser.prototype.ownedGuild = function (player) {
        return this.placeholder();
    };
    // TODO: implement this
    EventMessageParser.prototype.ownedGuildMember = function (player) {
        return this.placeholder();
    };
    EventMessageParser.prototype.random = function (props, cache) {
        var _a = props[0], domain = _a.domain, funct = _a.funct, cacheNum = _a.cacheNum;
        var got = cache.get(domain, funct, cacheNum);
        if (got)
            return got;
        var res = this[funct]();
        cache.set(domain, funct, cacheNum, res);
        return res;
    };
    EventMessageParser.prototype.transformVarProps = function (props, cache, eventData) {
        var _a = props[0], domain = _a.domain, funct = _a.funct, cacheNum = _a.cacheNum;
        var retVal = null;
        try {
            var prevCacheData = cache.get(domain, funct, cacheNum);
            if (prevCacheData && funct !== 'party')
                return prevCacheData;
            retVal = "\u00AB" + this[domain](props, cache, eventData) + "\u00BB";
            if (funct !== 'party')
                cache.set(domain, funct, cacheNum, retVal);
        }
        catch (e) {
            this.logger.error('EventVariableManager', e, { props: props, cache: cache });
        }
        return retVal;
    };
    EventMessageParser.prototype.getVarProps = function (string) {
        var _this = this;
        var terms = string.split(' ');
        var varProps = [];
        terms.forEach(function (term) {
            var _a = term.split('#'), props = _a[0], cacheNum = _a[1];
            var _b = props.split(':', 2), domain = _b[0], funct = _b[1];
            var args = props.substring(1 + funct.length + props.indexOf(funct)).trim().split('\'').join('"');
            try {
                varProps.push({
                    domain: domain,
                    funct: funct,
                    cacheNum: cacheNum ? +cacheNum : 0,
                    args: args ? JSON.parse(args) : null
                });
            }
            catch (e) {
                _this.logger.error('MessageCreator', e, { string: string });
            }
        });
        return varProps;
    };
    EventMessageParser.prototype.handleVariables = function (string, eventData) {
        var _this = this;
        if (eventData === void 0) { eventData = {}; }
        var cache = new EventVariableCache();
        return string.replace(/\$([a-zA-Z\:#0-9 {}_,']+)\$/g, function (match, p1) {
            var str = _this.getVarProps(p1);
            var modStr = _this.transformVarProps(str, cache, eventData);
            return modStr;
        });
    };
    EventMessageParser.prototype.genderPronoun = function (gender, replace) {
        switch (replace) {
            case '%hisher': {
                switch (gender) {
                    case 'male': return 'his';
                    case 'veteran male': return 'his';
                    case 'female': return 'her';
                    case 'veteran female': return 'her';
                    default: return 'their';
                }
            }
            case '%hishers': {
                switch (gender) {
                    case 'male': return 'his';
                    case 'veteran male': return 'his';
                    case 'female': return 'hers';
                    case 'veteran female': return 'hers';
                    default: return 'theirs';
                }
            }
            case '%himher': {
                switch (gender) {
                    case 'male': return 'him';
                    case 'veteran male': return 'him';
                    case 'female': return 'her';
                    case 'veteran female': return 'her';
                    default: return 'them';
                }
            }
            case '%she':
            case '%heshe': {
                switch (gender) {
                    case 'male': return 'he';
                    case 'veteran male': return 'he';
                    case 'female': return 'she';
                    case 'veteran female': return 'she';
                    default: return 'they';
                }
            }
        }
    };
    EventMessageParser.prototype.stringFormat = function (string, player, extra) {
        var _this = this;
        if (extra === void 0) { extra = {}; }
        if (!player)
            return string;
        string = string.trim();
        if (extra.item)
            extra.item = "\u00AB" + extra.item + "\u00BB";
        if (extra.partyName)
            extra.partyName = "\u00AB" + extra.partyName + "\u00BB";
        if (extra.spellName)
            extra.spellName = "\u00AB" + extra.spellName + "\u00BB";
        if (extra.weaponName)
            extra.weaponName = "\u00AB" + extra.weaponName + "\u00BB";
        if (extra.targetName)
            extra.targetName = "\u00AB" + extra.targetName + "\u00BB";
        if (extra.casterName)
            extra.casterName = "\u00AB" + extra.casterName + "\u00BB";
        if (extra.treasure)
            extra.treasure = "\u00AB" + extra.treasure + "\u00BB";
        if (extra.deflectItem)
            extra.deflectItem = "\u00AB" + extra.deflectItem + "\u00BB";
        if (extra.collectible)
            extra.collectible = "\u00AB" + extra.collectible + "\u00BB";
        Object.keys(extra).forEach(function (key) {
            string = string.split("%" + key).join(lodash_1.isNumber(extra[key]) ? extra[key].toLocaleString() : extra[key]);
        });
        string = this.handleVariables(string, extra._eventData);
        var splitJoins = [
            { split: '%player', join: function () { return "\u00AB" + player.fullName() + "\u00BB"; } },
            { split: '%pet', join: function () { return "\u00AB" + _this.ownedPet(player) + "\u00BB"; } },
            { split: '%guildMember', join: function () { return "\u00AB" + _this.ownedGuildMember(player) + "\u00BB"; } },
            { split: '%guild', join: function () { return "\u00AB" + _this.ownedGuild(player) + "\u00BB"; } }
        ];
        ['hishers', 'hisher', 'himher', 'she', 'heshe'].forEach(function (pronoun) {
            splitJoins.push({
                split: "%" + pronoun,
                join: function () { return _this.genderPronoun(player.gender, "%" + pronoun); }
            });
            splitJoins.push({
                split: "%" + lodash_1.capitalize(pronoun),
                join: function () { return lodash_1.capitalize(_this.genderPronoun(player.gender, "%" + pronoun)); }
            });
        });
        splitJoins.forEach(function (sj) {
            if (!lodash_1.includes(string, sj.split))
                return;
            string = string.split(sj.split).join(sj.join());
        });
        return string;
    };
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", player_manager_1.PlayerManager)
    ], EventMessageParser.prototype, "playerManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", party_manager_1.PartyManager)
    ], EventMessageParser.prototype, "partyManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", asset_manager_1.AssetManager)
    ], EventMessageParser.prototype, "assetManager", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", world_1.World)
    ], EventMessageParser.prototype, "world", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", rng_service_1.RNGService)
    ], EventMessageParser.prototype, "rng", void 0);
    tslib_1.__decorate([
        typescript_ioc_1.Inject,
        tslib_1.__metadata("design:type", logger_1.Logger)
    ], EventMessageParser.prototype, "logger", void 0);
    EventMessageParser = tslib_1.__decorate([
        typescript_ioc_1.AutoWired,
        typescript_ioc_1.Singleton
    ], EventMessageParser);
    return EventMessageParser;
}());
exports.EventMessageParser = EventMessageParser;
//# sourceMappingURL=event-message-parser.js.map