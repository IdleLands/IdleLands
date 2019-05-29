# IdleLands4

🎉

## Requirements

* Git
* MongoDB (not tested against other DBs)
* Node 10.x

### MongoDB Note

The game is only tested against MongoDB. TypeORM currently lacks support for joins, etc and these are done manually. Additionally, the `seed` process requires using MongoDB. This could be cleaned up in the future, but is not a priority right now.

## Getting Started

* Clone the repo
* `npm install`
* If you do not have an `assets` folder, run `npm run postinstall`
* `npm run seed`
* Create `.env` file (see `Environment Variables`)

## Environment Variables

Create a `.env` file in the root of the cloned project and fill it with these values.

### Required

* `TYPEORM_CONNECTION` - the DB type (you probably want to use `mongodb`)
* `TYPEORM_URL` - the URL to connect to the DB
* `TYPEORM_SYNCHRONIZE` - set to `true`
* `TYPEORM_ENTITIES` - set to `src/shared/models/entity/**/*.ts`

### Optional

#### Game Variables

These variables will change how the game plays.

* `GAME_DELAY` - the game loop delay. Default: `5000`ms.
* `GRACE_PERIOD_DISCONNECT` - the delay between disconnect and character exiting game. Default: `30000`ms.

#### Redis Variables

Redis variables will enable use of Redis to scale horizontally.

* `SCC_BROKER_REDIS_HOST` - the URL to the Redis instance
* `SCC_BROKER_REDIS_PORT` - the port of the Redis instance

#### Firebase Variables

Firebase variables are used to set up Firebase, which is used only to sync accounts based on a uid.

* `FIREBASE_ADMIN_DATABASE` - the admin database URL for firebase. Should be in the format `https://<DATABASE_NAME>.firebaseio.com`.
* `FIREBASE_ADMIN_JSON` - the JSON blob (stringified) for a service account private key. You can read how to do that [here](https://firebase.google.com/docs/admin/setup).

#### Discord Variables

Discord variables are used to connect to Discord, which will sync chat between the game/Discord. You will also need to set up a Discord bot and give it sufficient permissions to post messages/emoji, create/modify channels, and create/modify roles.

* `DISCORD_SECRET` - the Discord API secret for your created Discord bot
* `DISCORD_GUILD_ID` - the Discord guild ID
* `DISCORD_CHANNEL_ID` - the Discord channel ID

## Useful Commands

* `npm run start:server` - start the server
* `npm run start:client` - start the client