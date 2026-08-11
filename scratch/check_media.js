const http = require('http');
http.get('http://localhost:3000/cosmetic/products/luminous-revitalization-sheer-set', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    // Let's just find anything ending in .jpg or .png
    const matches = body.match(/https?:\/\/[^\"]+\.(jpg|png)/g);
    console.log('Images in DOM:', [...new Set(matches)]);
  });
}).on('error', console.error);
