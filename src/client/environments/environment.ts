// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  firebase: {
    apiKey: 'AIzaSyApNfy2rl9J4f1eyPu4ToF0nTrzS9bYO7c',
    authDomain: 'idle-lands.firebaseapp.com',
    databaseURL: 'https://idle-lands.firebaseio.com',
    projectId: 'idle-lands',
    storageBucket: 'idle-lands.appspot.com',
    messagingSenderId: '289483800784'
  },

  app: {
    protocol: 'http',
    hostname: '127.0.0.1',
    port: 2468
  },

  server: {
    protocol: 'http',
    secure: false,
    hostname: '127.0.0.1',
    port: 8000
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
