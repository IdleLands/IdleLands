
const PLAYER_COUNT = process.env.PLAYER_COUNT ? +process.env.PLAYER_COUNT : 10;

const { species } = require('fantastical');

const SocketCluster = require('socketcluster-client');
const scCodecMinBin = require('sc-codec-min-bin');

const names = [
  'Jombocom', 'Carple', 'Danret', 'Swilia', 'Bripz', 'Goop',
  'Jeut', 'Axce', 'Groat', 'Jack', 'Xefe', 'Ooola', 'Getry',
  'Seripity', 'Tence', 'Rawgle', 'Plez', 'Zep', 'Shet', 'Jezza',
  'Lord Sirpy', 'Sir Pipe', 'Pleb', 'Rekter', 'Pilu', 'Sengai',
  'El Shibe', 'La Gpoy', 'Wizzrobu', 'Banana', 'Chelpe', 'Q',
  'Azerty'
];

const play = (name) => {

  const opts = { hostname: 'localhost', port: 8000 };
  opts.codecEngine = scCodecMinBin;
  const socket = SocketCluster.connect(opts);

  socket.on('error', (err) => {
  });

  socket.on('connect', () => {
    console.log(`Logged in ${name}!`);
  });

  socket.on('disconnect', () => {
  });

  socket.on('gameevent', (ev) => {
  });

  socket.emit('auth:register', { name, userId: `local|${name}` });
  
  setTimeout(() => {

    socket.emit('auth:signin', { name, userId: `local|${name}` });

    setTimeout(() => {

      socket.emit('auth:playgame', { name, userId: `local|${name}` });
    }, 100);
  }, 100);
};

const chosenNames = names.slice(0, PLAYER_COUNT);
if(chosenNames.length < PLAYER_COUNT) {
  for(let i = chosenNames.length; i < PLAYER_COUNT; i++) {
    chosenNames.push(species.human());
  }
}

chosenNames.forEach(name => play(name));