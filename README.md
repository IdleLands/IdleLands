# IdleLands4

🎉

## Environment Variables

### Required

* `TYPEORM_CONNECTION` - the DB type
* `TYPEORM_HOST` - the DB host
* `TYPEORM_USERNAME` - the DB username (if applicable)
* `TYPEORM_PASSWORD` - the DB password (if applicable)
* `TYPEORM_DATABASE` - the DB name
* `TYPEORM_PORT` - the DB port
* `TYPEORM_SYNCHRONIZE` - set to `true`
* `TYPEORM_ENTITIES` - set to `src/shared/models/entity/**/*.ts`

### Optional

* `SCC_BROKER_REDIS_HOST` - the URL to the Redis instance
* `SCC_BROKER_REDIS_PORT` - the port of the Redis instance
* `GAME_DELAY` - the game loop delay. Default: `5000`ms.
* `GRACE_PERIOD_DISCONNECT` - the delay between disconnect and character exiting game. Default: `30000`ms.
* `FIREBASE_ADMIN_DATABASE` - the admin database URL for firebase. Should be in the format `https://<DATABASE_NAME>.firebaseio.com`.
* `FIREBASE_ADMIN_JSON` - the JSON blob (stringified) for a service account private key. You can read how to do that [here](https://firebase.google.com/docs/admin/setup).

## Useful Commands

* `npm run start:server` - start the server
* `npm run start:client` - start the client