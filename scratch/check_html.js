const fs = require('fs');

const path = 'apps/main/.next/server/app/cosmetic/products/luminous-revitalization-sheer-set.html';
const body = fs.readFileSync(path, 'utf8');

const desktopAttr = body.match(/data-hero-desktop-url=\\?"([^"\\]*)\\?"/);
const mobileAttr = body.match(/data-hero-mobile-url=\\?"([^"\\]*)\\?"/);
const hasUrlAttr = body.match(/data-hero-has-url=\\?"([^"\\]*)\\?"/);
const keysAttr = body.match(/data-hero-media-keys=\\?"([^"\\]*)\\?"/);

console.log('data-hero-has-url:', hasUrlAttr ? hasUrlAttr[1] : 'NOT FOUND');
console.log('data-hero-desktop-url:', desktopAttr ? desktopAttr[1] : 'NOT FOUND');
console.log('data-hero-mobile-url:', mobileAttr ? mobileAttr[1] : 'NOT FOUND');
console.log('data-hero-media-keys:', keysAttr ? keysAttr[1] : 'NOT FOUND');
console.log('Has <picture>:', body.includes('<picture'));
