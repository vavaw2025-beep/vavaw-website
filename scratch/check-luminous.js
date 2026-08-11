const http = require('http');
const { spawn } = require('child_process');

// Start the server
const server = spawn('pnpm', ['start', '--filter', '@vavaw/main'], { stdio: 'pipe' });

server.stdout.on('data', (data) => {
  const str = data.toString();
  console.log(str);
  if (str.includes('Ready in') || str.includes('started server') || str.includes('Listening on port') || str.includes('Ready')) {
    setTimeout(() => {
      http.get('http://localhost:3000/cosmetic/products/luminous-revitalization-sheer-set', (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          console.log('HTML length:', body.length);
          const desktopAttr = body.match(/data-hero-desktop-url="([^"]*)"/);
          const mobileAttr = body.match(/data-hero-mobile-url="([^"]*)"/);
          console.log('Desktop URL in DOM:', desktopAttr ? desktopAttr[1] : 'NOT FOUND');
          console.log('Mobile URL in DOM:', mobileAttr ? mobileAttr[1] : 'NOT FOUND');
          const hasImage = body.includes('<picture');
          console.log('Has <picture>:', hasImage);
          server.kill();
          process.exit(0);
        });
      }).on('error', (e) => {
        console.error(e.message);
        server.kill();
        process.exit(1);
      });
    }, 2000);
  }
});

setTimeout(() => {
    console.log("Timeout");
    server.kill();
    process.exit(1);
}, 20000);
