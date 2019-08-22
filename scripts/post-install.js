const download = require('download-github-repo');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

download('IdleLands/Custom-Assets', 'assets/content', () => {});
download('IdleLands/Maps',          'assets/maps', () => {
  fs.writeFileSync('./src/client/assets/tiles.png', fs.readFileSync('./assets/maps/img/tiles.png'));

  try {
    fs.rmdirSync('./src/client/assets/maps');
  } catch(e) {}

  fs.mkdirSync('./src/client/assets/maps');

  const files = glob.sync('./assets/maps/world-maps/**/*.json');
  files.forEach(file => {
    fs.writeFileSync(`./src/client/assets/maps/${path.basename(file)}`, fs.readFileSync(file));
  });
});
