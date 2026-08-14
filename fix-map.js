const fs = require('fs');
const mapFilePath = 'e:/Downloads/VAVAW-web/packages/brand-config/src/cosmetic-vietnamese-copy-map.ts';
let content = fs.readFileSync(mapFilePath, 'utf-8');

// Fix double quotes
content = content.replace(/""([^"]+)""\s*:\s*/g, '"$1": ');
fs.writeFileSync(mapFilePath, content);
console.log('Fixed double quotes.');
