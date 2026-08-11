const http = require('http');

http.get('http://localhost:3000/cosmetic/products/luminous-revitalization-sheer-set', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    const desktopAttr = body.match(/data-hero-desktop-url="([^"]*)"/);
    const mobileAttr = body.match(/data-hero-mobile-url="([^"]*)"/);
    const fallbackAttr = body.match(/data-hero-fallback-slot="([^"]*)"/);
    console.log('Desktop URL in DOM:', desktopAttr ? desktopAttr[1] : 'NOT FOUND');
    console.log('Mobile URL in DOM:', mobileAttr ? mobileAttr[1] : 'NOT FOUND');
    console.log('Fallback slot in DOM:', fallbackAttr ? fallbackAttr[1] : 'NOT FOUND');
    console.log('Has <picture>:', body.includes('<picture'));
    console.log('Length:', body.length);
  });
}).on('error', console.error);
