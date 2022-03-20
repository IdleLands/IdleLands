# IdleLands [![Build Status](https://travis-ci.org/IdleLands/IdleLands.svg?branch=master)](https://travis-ci.org/IdleLands/IdleLands)

🎉

## Requirements

* Git
* MongoDB (not tested against other DBs)
* Node 10.x

### MongoDB Note

The game is only tested against MongoDB. TypeORM currently lacks support for joins, etc and these are done manually. Additionally, the `seed` process requires using MongoDB. This could be cleaned up in the future, but is not a priority right now.

Additionally, it is recommended to set up a mLab account for your MongoDB tests or you can use our `docker-compose`, which you can run locally via `docker-compose up`.
This will spin up two Docker containers. First one will be your MongoDB database and the second one is tool called Mongo Express. Here you can manage your database collections very easily.
You may need to run the `docker-compose` command using `sudo` and make sure that you kill all instances of MongoDB server before you execute the command.

To connect to Docker MongoDB instance create `.env` file (see `Environment Variables`) and set `TYPEORM_URL` environment variable to: `mongodb://admin-user:admin-password@127.0.0.1:27017/admin?retryWrites=true&w=majority`.

To check Mongo Express, open your browser and navigate to: `http:localhost:8081`.


## Getting Started

* Clone the repo
* Create `.env` file (see `Environment Variables`)
* `npm install`
* `npm run setup`
* Open a terminal and start the server `npm run start:server`
* Open another terminal and start the client `npm run start:client`
* Wait for the server and client to load, which will open a new browser tab with the game

## Improving Server Performance on Windows

If you have trouble or slowness running IdleLands server on Windows, try using `TS_NODE_TRANSPILE_ONLY=1` as an `env` variable. This will alleviate most issues.

## Environment Variables

Create a `.env` file in the root of the cloned project and fill it with these values.

### Required

* `TYPEORM_CONNECTION` - the DB type (you probably want to use `mongodb`)
* `TYPEORM_URL` - the URL to connect to the DB
* `TYPEORM_SYNCHRONIZE` - set to `true`
* `TYPEORM_ENTITIES` - set to `src/shared/models/entity/**/*.ts`

Example content of `.env`:
```
TYPEORM_CONNECTION=mongodb
TYPEORM_URL=mongodb://admin-user:admin-password@127.0.0.1:27017/admin?retryWrites=true&w=majority
TYPEORM_SYNCHRONIZE=true
TYPEORM_ENTITIES=src/shared/models/entity/**/*.ts
```

### Optional

#### Game Variables

These variables will change how the game plays.

* `GAME_DELAY` - the game loop delay (each tick is 1 `GAME_DELAY`). Default: `5000`ms.
* `SAVE_DELAY` - the number of ticks the game will save per interval. Default `15`ticks.
* `GRACE_PERIOD_DISCONNECT` - the delay between disconnect and character exiting game. Default: `30000`ms.

#### Redis Variables

Redis variables will enable use of Redis to scale horizontally.

* `SCC_BROKER_REDIS_HOST` - the URL to the Redis instance
* `SCC_BROKER_REDIS_PORT` - the port of the Redis instance

#### Firebase Variables

Firebase variables are used to set up Firebase, which is used only to sync accounts based on a uid.

* `FIREBASE_ADMIN_DATABASE` - the admin database URL for firebase. Should be in the format `https://<DATABASE_NAME>.firebaseio.com`.
* `FIREBASE_ADMIN_JSON` - the JSON blob (stringified) for a service account private key. You can read how to do that [here](https://firebase.google.com/docs/admin/setup). This needs to be encoded as base64 with LZUTF8.

#### Stripe Variables

Stripe variables need to be set up to accept payments via Stripe.

* `STRIPE_KEY` the private stripe key.

#### Papertrail Variables

* `PAPERTRAIL_HOST` - (optional) set this to `logsX.papertrailapp.com` (given by Papertrail)
* `PAPERTRAIL_PORT` - (optional) set this to `XXXXX` (given by Papertrail)

#### Discord Variables

Discord variables are used to connect to Discord, which will sync chat between the game/Discord. You will also need to set up a Discord bot and give it sufficient permissions to post messages/emoji, create/modify channels, and create/modify roles. Your bot will either need to be an administrator or have these permissions.

* `DISCORD_SECRET` - the Discord API secret for your created Discord bot
* `DISCORD_GUILD_ID` - the Discord guild ID for the Discord bot to reside in (ID of the Discord server)
* `DISCORD_CHANNEL_ID` - the Discord channel ID for the chat bridge
* `DISCORD_CUSTOM_ITEM_CHANNEL_ID` - the Discord channel ID to send custom item submissions to
* `DISCORD_GUILD_CHANNEL_GROUP_ID` - the Discord channel CATEGORY ID to put guild channels in

You will also need the following roles:

* `Verified`
* `Guild Mod`

#### IdleLands 3 Variables

IL3 variables are used to connect to the old DB for the purposes of character imports.

* `IDLELANDS3_MONGODB_URI` - the MongoDB URI to the old IdleLands 3 Mongo instance

## Making Yourself A GM

To test any moderator-related features, you will need to be a GM. Doing so is as easy a quick DB query:

```
db.getCollection('player').update({ name: 'YOUR_CHARACTER_NAME' }, { $set: { modTier: 5 } });
```

## Setting Up a Discord Server and Bot for Local Testing

* Open [this](https://thomlom.dev/create-a-discord-bot-under-15-minutes/) guide.
* Clone/Download the attached [Discord Bot](https://github.com/thomlom/discord-bot-example) repo on the bottom of the site
* Start from **Get that token** and **Add our bot to a server** chapter of the guide (make sure your bot has Administrator permission), and then follow **Getting started** of the [Discord Bot](https://github.com/thomlom/discord-bot-example) repo.
* Your bot should be **ONLINE** on your Discord server before you proceed further.
* Read through **Discord Variables** part of this README.
* `DISCORD_SECRET` env variable is your Bot's token. The same one you copied into the `.env` file of your bot.
* Create roles `Verified` and `Guild Mod` on your Discord server.
* Activate `Developer Mode` in your Discord App: Settings -> Appearance -> Developer Mode.
* Right-click onto your Discord server's `#general` and click on **Copy ID** which you set as `DISCORD_CHANNEL_ID` env variable.
* Right-click onto your Discord server's icon on the left side of the window and click on **Copy ID** which you set as `DISCORD_GUILD_ID` env variable.
* Create `Guild` category by right-clicking into the area of channels on your Discord Server.
* Right-click on the `Guild` category and click on **Copy ID** which you set as `DISCORD_GUILD_CHANNEL_GROUP_ID` env variable.
* You may create another chat room for custom-items and copy its ID into your `.env`, but unless you are going to work with them, you (probably) don't need to do so.
* If everything was set correctly, the bot should be alive and able to write into the respective channels.
