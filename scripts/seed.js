
require('dotenv').config({ silent: true });

const { MongoClient } = require('mongodb');
const YAML = require('yamljs');
const fs = require('fs');
const _ = require('lodash');

const StringAssets = {};
const ObjectAssets = {};
const MapAssets = {};
const MapInformation = {};
const GlobalMapInformation = {};
const Pets = {};
const Teleports = {};
const Treasures = {};
const Bosses = {};

const replaceMultiSpaces = (string) => {
  return string.replace(/ {2,}/g, ' ');
};

class JSONParser {
  static _parseInitialArgs(string) {
    if(!string || _.includes(string, '#')) return [];
    string = replaceMultiSpaces(string);
    const split = string.split('"');
    return [split[1], split[2]];
  }

  static _parseParameters(baseObj = {}, parameters) {
    const paramData = _.map(parameters.split(' '), item => {
      const arr = item.split('=');
      const retVal = {};
      const testVal = +arr[1];

      if(!arr[0]) return {};

      let newVal = 0;
      if(_.isNaN(testVal) && _.isUndefined(arr[1])) {
        newVal = 1;
      } else if(_.includes(['class', 'gender', 'link', 'expiration', 'zone', 'type'], arr[0])) {
        newVal = arr[1];
      } else {
        newVal = testVal;
      }

      retVal[arr[0]] = newVal;
      return retVal;

    });

    return _.reduce(paramData, (cur, prev) => {
      return _.extend({}, cur, prev);
    }, baseObj);
  }

  static parseMonsterString(str) {
    if(!_.includes(str, 'level')) return;
    const [name, parameters] = this._parseInitialArgs(str);
    if(!parameters) return;

    const monsterData = this._parseParameters({ name }, parameters);
    return monsterData;
  }

  static parseNPCString(str) {
    const [name, parameters] = this._parseInitialArgs(str);
    const npcData = this._parseParameters({ name }, parameters);
    return npcData;
  }

  static parseItemString(str, type) {
    const [name, parameters] = this._parseInitialArgs(str);
    if(!parameters) return;

    const itemData = this._parseParameters({ name: name, type: type }, parameters);
    return itemData;
  }

  static parseFestivalString(str) {
    const [name, parameters] = this._parseInitialArgs(str);
    if(!parameters) return;

    const festData = this._parseParameters({ name: name }, parameters);
    return festData;
  }
}

const loadDirectory = (dir) => {
  const results = [];

  const list = fs.readdirSync(dir);
  _.each(list, basefilename => {
    const filename = `${dir}/${basefilename}`;
    results.push({ filename, type: basefilename.split('.')[0] });
  });

  return results;
};

const parseFile = (filename) => {
  const baseContents = replaceMultiSpaces(fs.readFileSync(filename, 'UTF-8')).split('\n');
  return _(baseContents).compact().value();
};

const profession = 'src/server/core/game/professions'
StringAssets.class = _.uniq(_.map(loadDirectory(`${__dirname}/../${profession}`), ({ filename }) => {
  if(_.includes(filename, 'index')) return;
  const split = filename.split('/');
  return split[split.length - 1].split('.')[0];
}).filter(Boolean));

_.each(['events', 'strings'], folder => {
  _.each(loadDirectory(`${__dirname}/../assets/content/${folder}`), ({ type, filename }) => {
    let realType = type;
    if(type === 'providenceNames') realType = 'providenceName';
    StringAssets[realType] = parseFile(filename);
  });
});

const parseTable = {
  items: JSONParser.parseItemString.bind(JSONParser),
  ingredients: JSONParser.parseItemString.bind(JSONParser),
  monsters: JSONParser.parseMonsterString.bind(JSONParser),
  npcs: JSONParser.parseNPCString.bind(JSONParser)
};

_.each(['items', 'ingredients', 'monsters', 'npcs'], folder => {
  _.each(loadDirectory(`${__dirname}/../assets/content/${folder}`), ({ type, filename }) => {
    ObjectAssets[type] = _.compact(_.map(parseFile(filename), line => parseTable[folder](line, type)));
  });
});

// after loading all of the assets, we need to do some preformatting on them
// we remove any key that is not in the following hash from all object assets
const validItemKeys = {
  type: true,
  name: true,

  level: true,

  // all stats are added below

  // monster specific traits
  zone: true,
  class: true
};

const validStats = ['str', 'con', 'dex', 'int', 'agi', 'luk', 'xp', 'gold', 'hp'];
validStats.forEach(stat => {
  validItemKeys[stat] = true;
});

Object.keys(ObjectAssets).forEach(itemType => {
  ObjectAssets[itemType].forEach((item, idx) => {    
    Object.keys(item).forEach(key => {
      if(validItemKeys[key]) return;
      delete item[key];
    });

    if(Object.keys(item).length <= 2 && itemType !== 'trainer') {
      ObjectAssets[itemType][idx] = null;
    }
  });

  ObjectAssets[itemType] = _.compact(ObjectAssets[itemType]);
});

ObjectAssets.monster.forEach(mon => {
  mon.profession = mon.class;
  delete mon.class;
  
  validStats.forEach(stat => {
    mon.stats = mon.stats || {};

    if(mon[stat]) {
      mon.stats[stat] = mon[stat];
      delete mon[stat];
    }
  });
});

const getMapsInFolder = (dir) => {
  let results = [];

  const list = fs.readdirSync(__dirname + '/../' + dir);
  list.forEach(basefilename => {
    const filename = `${dir}/${basefilename}`;
    const stat = fs.statSync(__dirname + '/../' + filename);
    if(_.includes(filename, 'promo')) return;

    if(stat && stat.isDirectory()) results = results.concat(getMapsInFolder(filename));
    else results.push({ map: basefilename.split('.')[0], path: __dirname + '/../' + filename });
  });

  return results;
};

const fixObject = (obj) => {
  if(obj.type === 'Collectible') {
    if(!obj.properties.rarity) obj.properties.rarity = 'basic';
    obj.properties.description = obj.properties.flavorText;
  }

  return obj;
};

const getDataForMap = (map) => {

  const objects = {};
  const regions = {};

  if(map.layers[2] && map.layers[2].objects) {
    map.layers[2].objects.forEach(obj => {
      if(obj.type !== 'Teleport'
      && obj.type !== 'GuildTeleport'
      && obj.type !== 'Boss'
      && obj.type !== 'BossParty'
      && obj.type !== 'Collectible'
      && obj.type !== 'Trainer'
      && obj.type !== 'Treasure'
      && !_.get(obj, 'properties.forceEvent')
      && !Object.keys(obj.properties || {}).some(x => x.includes('require'))) return;

      obj = fixObject(obj);

      const x = obj.x / 16;
      const y = (obj.y / 16) - 1;

      objects[x] = objects[x] || {};
      objects[x][y] = obj;
    });
  }

  if(map.layers[3] && map.layers[3].objects) {
    map.layers[3].objects.forEach(region => {
      const startX = region.x / 16;
      const startY = (region.y / 16) + 1;
      const width = region.width / 16;
      const height = region.height / 16;

      for(let x = startX; x < startX + width; x++) {
        for(let y = startY; y < startY + height; y++) {
          regions[x] = regions[x] || {};
          regions[x][y] = region.name;
        }
      }
    });
  }

  return { objects, regions };
};

const formatMap = (map) => {
  if(!map.layers[2] || !map.layers[2].objects) return;

  map.layers[2].objects.forEach(object => {
    if(!object.type) return;
    if(!object.properties) object.properties = {};

    object.properties = {
      ...object.properties,
      realtype:           object.type,
      destName:           object.properties.destName,
      movementType:       object.properties.movementType,
      teleportX:          object.properties.destx ? +object.properties.destx : 0,
      teleportY:          object.properties.desty ? +object.properties.desty : 0,
      teleportMap:        object.properties.map,
      teleportLocation:   object.properties.toLoc,
      flavorText:         object.properties.flavorText,

      requireBoss:        object.properties.requireBoss,
      requireCollectible: object.properties.requireCollectible,
      requireAchievement: object.properties.requireAchievement,
      requireClass:       object.properties.requireClass,
      requireRegion:      object.properties.requireRegion,
      requireMap:         object.properties.requireMap,
      requireHoliday:     object.properties.requireHoliday,
      requireAscension:   object.properties.requireAscension
    };

    Object.keys(object.properties).forEach(key => {
      if(!_.isUndefined(object.properties[key])) return;
      delete object.properties[key];
    });
  });
};

const loadMapsInFolder = () => {
  getMapsInFolder('assets/maps/world-maps').forEach(({ map, path }) => {
    MapAssets[map] = require(path);
    MapInformation[map] = getDataForMap(MapAssets[map]);

    formatMap(MapAssets[map]);
  });
};

const CONTENT_PARENTDIR = 'src';

const loadPetData = () => {
  const pets = YAML.load(CONTENT_PARENTDIR + '/content/pets.yml');
  pets.forEach(pet => Pets[pet.typeName] = pet);
};

const loadTeleportData = () => {
  const teleports = YAML.load(CONTENT_PARENTDIR + '/content/teleports.yml');
  for(let key in teleports) {
    for(let subkey in teleports[key]) {
      Teleports[subkey] = teleports[key][subkey];
    }
  }
};

const loadBossData = () => {
  Bosses.creatures = YAML.load(CONTENT_PARENTDIR + '/content/boss.yml');
  Bosses.items = YAML.load(CONTENT_PARENTDIR + '/content/bossitems.yml');
  Bosses.collectibles = YAML.load(CONTENT_PARENTDIR + '/content/bosscollectibles.yml');
  Bosses.parties = YAML.load(CONTENT_PARENTDIR + '/content/bossparties.yml');

  Object.keys(Bosses.creatures).forEach(key => {
    Bosses.creatures[key].name = key;
  });

  Object.keys(Bosses.items).forEach(key => {
    Bosses.items[key].name = key;
  });
};

const loadTreasureData = () => {
  Treasures.chests = YAML.load(CONTENT_PARENTDIR + '/content/chest.yml');
  Treasures.items = YAML.load(CONTENT_PARENTDIR + '/content/chestitems.yml');
};

const init = async () => {
  loadMapsInFolder();
  loadPetData();
  loadTeleportData();
  loadBossData();
  loadTreasureData();

  const url = process.env.TYPEORM_URL;
  const client = await MongoClient.connect(url, { useNewUrlParser: true });

  const db = client.db();

  const assetCol = db.collection('assets');
  
  await assetCol.deleteMany({});

  await assetCol.insertOne({
    stringAssets: StringAssets,
    objectAssets: ObjectAssets,
    mapAssets: MapAssets,
    petAssets: Pets,
    teleports: Teleports,
    treasureAssets: Treasures,
    bossAssets: Bosses,
    mapInformation: MapInformation,
    globalMapInformation: GlobalMapInformation
  });

  process.exit(0);
};

init();