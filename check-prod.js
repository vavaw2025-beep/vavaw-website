const https = require('https');
https.get('https://vavaw-main.vercel.app', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const urls = data.match(/https:\/\/zrgnoeyfnfhatqkkhskf\.supabase\.co\/storage\/v1\/object\/public\/[a-zA-Z0-9_/-]+\.(jpg|png|webp)/g);
    console.log(urls ? [...new Set(urls)] : 'No URLs found');
  });
});
