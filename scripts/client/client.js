
const PLAYER_COUNT = process.env.PLAYER_COUNT ? +process.env.PLAYER_COUNT : 10;

const { species } = require('fantastical');

const scCodecMinBin = require('sc-codec-min-bin');

const names = [
  'Goop', 'Jombocom', 'Carple', 'Danret', 'Swilia', 'Bripz',
  'Jeut', 'Axce', 'Groat', 'Jack', 'Xefe', 'Ooola', 'Getry',
  'Seripity', 'Tence', 'Rawgle', 'Plez', 'Zep', 'Shet', 'Jezza',
  'Lord Sirpy', 'Sir Pipe', 'Pleb', 'Rekter', 'Pilu', 'Sengai',
  'El Shibe', 'La Gpoy', 'Wizzrobu', 'Banana', 'Chelpe', 'Q',
  'Azerty'
];

const loggedIn = {};

const play = (name) => {

  const SocketCluster = require('socketcluster-client');
  const opts = { hostname: 'localhost', port: 8000, multiplex: false };
  opts.codecEngine = scCodecMinBin;
  const socket = SocketCluster.create(opts);

  socket.on('error', (err) => {
  });

  socket.on('connect', () => {
    console.log(`Logged in ${name}!`);
  
    setTimeout(() => {
  
      socket.emit('auth:signin', { name, userId: `local|${name}` });
  
      setTimeout(() => {
  
        socket.emit('auth:playgame', { name, userId: `local|${name}` });
      }, 100);
    }, 100);
  });

  socket.on('disconnect', () => {
  });

  socket.on('gameevent', (ev) => {
  });

  socket.emit('auth:register', { name, userId: `local|${name}` });
};

const chosenNames = names.slice(0, PLAYER_COUNT);
if(chosenNames.length < PLAYER_COUNT) {
  for(let i = chosenNames.length; i < PLAYER_COUNT; i++) {

    let name = '';
    do {
      name = species.human();
    } while(loggedIn[name]);

    loggedIn[name] = true;
    chosenNames.push(name);
  }
}

chosenNames.forEach(name => play(name));