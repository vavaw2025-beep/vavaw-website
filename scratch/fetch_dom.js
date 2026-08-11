const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

const server = spawn('pnpm', ['start', '--filter', '@vavaw/main'], { stdio: 'pipe', shell: true });

server.stdout.on('data', (data) => {
  const str = data.toString();
  console.log(str);
  if (str.includes('Ready') || str.includes('started server') || str.includes('Listening')) {
    setTimeout(() => {
      http.get('http://localhost:3000/cosmetic/products/luminous-revitalization-sheer-set', (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          fs.writeFileSync('scratch/luminous_dom.html', body);
          console.log('Saved to scratch/luminous_dom.html');
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
