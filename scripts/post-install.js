const download = require('download-github-repo');
const fs = require('fs');

download('IdleLands/Custom-Assets', 'assets/content', () => {});
download('IdleLands/Maps',          'assets/maps', () => {});

fs.writeFileSync('./src/client/assets/tiles.png', fs.readFileSync('./assets/maps/img/tiles.png'));