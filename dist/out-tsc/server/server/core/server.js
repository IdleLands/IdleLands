/*
  This is the SocketCluster master controller file.
  It is responsible for bootstrapping the SocketCluster master process.
  Be careful when modifying the options object below.
  If you plan to run SCC on Kubernetes or another orchestrator at some point
  in the future, avoid changing the environment constiable names below as
  each one has a specific meaning within the SC ecosystem.
*/
var path = require('path');
var chokidar = require('chokidar');
var argv = require('minimist')(process.argv.slice(2));
var waitForFile = require('socketcluster/fsutil').waitForFile;
var SocketCluster = require('socketcluster');
var workerControllerPath = argv.wc || process.env.SOCKETCLUSTER_WORKER_CONTROLLER;
var brokerControllerPath = argv.bc || process.env.SOCKETCLUSTER_BROKER_CONTROLLER;
var workerClusterControllerPath = argv.wcc || process.env.SOCKETCLUSTER_WORKERCLUSTER_CONTROLLER;
var environment = process.env.ENV || process.env.NODE_ENV || 'dev';
var filetype = process.env.SERVER_FILETYPE || (environment === 'dev' ? 'ts' : 'js');
var options = {
    workers: Number(argv.w) || Number(process.env.SOCKETCLUSTER_WORKERS) || 1,
    brokers: Number(argv.b) || Number(process.env.SOCKETCLUSTER_BROKERS) || 1,
    port: Number(argv.p) || Number(process.env.SOCKETCLUSTER_PORT) || Number(process.env.PORT) || 8000,
    // You can switch to 'sc-uws' for improved performance.
    wsEngine: process.env.SOCKETCLUSTER_WS_ENGINE || 'ws',
    appName: argv.n || process.env.SOCKETCLUSTER_APP_NAME || null,
    workerController: workerControllerPath || path.join(__dirname, 'worker.' + filetype),
    brokerController: brokerControllerPath || path.join(__dirname, 'broker.' + filetype),
    workerClusterController: workerClusterControllerPath || null,
    socketChannelLimit: Number(process.env.SOCKETCLUSTER_SOCKET_CHANNEL_LIMIT) || 1000,
    clusterStateServerHost: argv.cssh || process.env.SCC_STATE_SERVER_HOST || null,
    clusterStateServerPort: process.env.SCC_STATE_SERVER_PORT || null,
    clusterMappingEngine: process.env.SCC_MAPPING_ENGINE || null,
    clusterClientPoolSize: process.env.SCC_CLIENT_POOL_SIZE || null,
    clusterAuthKey: process.env.SCC_AUTH_KEY || null,
    clusterInstanceIp: process.env.SCC_INSTANCE_IP || null,
    clusterInstanceIpFamily: process.env.SCC_INSTANCE_IP_FAMILY || null,
    clusterStateServerConnectTimeout: Number(process.env.SCC_STATE_SERVER_CONNECT_TIMEOUT) || null,
    clusterStateServerAckTimeout: Number(process.env.SCC_STATE_SERVER_ACK_TIMEOUT) || null,
    clusterStateServerReconnectRandomness: Number(process.env.SCC_STATE_SERVER_RECONNECT_RANDOMNESS) || null,
    crashWorkerOnError: argv['auto-reboot'] !== false,
    // If using nodemon, set this to true, and make sure that environment is 'dev'.
    killMasterOnSignal: false,
    environment: environment,
    logLevel: 1,
    brokerOptions: {
        host: process.env.SCC_BROKER_REDIS_HOST,
        port: process.env.SCC_BROKER_REDIS_PORT
    }
};
var bootTimeout = Number(process.env.SOCKETCLUSTER_CONTROLLER_BOOT_TIMEOUT) || 10000;
var bootCheckInterval = Number(process.env.SOCKETCLUSTER_BOOT_CHECK_INTERVAL) || 200;
var bootStartTime = Date.now();
var SOCKETCLUSTER_OPTIONS;
if (process.env.SOCKETCLUSTER_OPTIONS) {
    SOCKETCLUSTER_OPTIONS = JSON.parse(process.env.SOCKETCLUSTER_OPTIONS);
}
for (var i in SOCKETCLUSTER_OPTIONS) {
    if (SOCKETCLUSTER_OPTIONS.hasOwnProperty(i)) {
        options[i] = SOCKETCLUSTER_OPTIONS[i];
    }
}
var start = function () {
    var socketCluster = new SocketCluster(options);
    socketCluster.on(socketCluster.EVENT_WORKER_CLUSTER_START, function (workerClusterInfo) {
        console.log('   >> WorkerCluster PID:', workerClusterInfo.pid);
    });
    if (socketCluster.options.environment === 'dev') {
        // This will cause SC workers to reboot when code changes anywhere in the app directory.
        // The second options argument here is passed directly to chokidar.
        // See https://github.com/paulmillr/chokidar#api for details.
        console.log("   !! The sc-hot-reboot plugin is watching for code changes in the src/server directory");
        var attachHMR = function (scMasterInstance, opts) {
            chokidar.watch(['**/*', '../shared'], opts).on('change', function (filePath) {
                console.log('   !! File ' + filePath + ' was modified. Restarting workers...');
                scMasterInstance.killWorkers({ immediate: true });
            });
        };
        attachHMR(socketCluster, {
            cwd: path.join(__dirname, '../'),
            ignored: ['core/server.ts', 'core/broker.ts', /[\/\\]\./, '*.log']
        });
    }
};
// Detect when Docker volumes are ready.
var startWhenFileIsReady = function (filePath) {
    var errorMessage = "Failed to locate a controller file at " + filePath + " before SOCKETCLUSTER_CONTROLLER_BOOT_TIMEOUT";
    return waitForFile(filePath, bootCheckInterval, bootStartTime, bootTimeout, errorMessage);
};
var filesReadyPromises = [
    startWhenFileIsReady(workerControllerPath),
    startWhenFileIsReady(brokerControllerPath),
    startWhenFileIsReady(workerClusterControllerPath)
];
Promise.all(filesReadyPromises)
    .then(function () {
    start();
})
    .catch(function (err) {
    console.error(err.stack);
    process.exit(1);
});
//# sourceMappingURL=server.js.map