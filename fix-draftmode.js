const fs = require('fs');
const path = require('path');

const files = [
  'apps/beauty/app/api/preview/exit/route.ts',
  'apps/beauty/app/api/preview/route.ts',
  'apps/beauty/app/layout.tsx',
  'apps/beauty/app/page.tsx',
  'apps/franchise/app/api/preview/exit/route.ts',
  'apps/franchise/app/api/preview/route.ts',
  'apps/franchise/app/layout.tsx',
  'apps/franchise/app/page.tsx',
  'apps/main/app/api/preview/exit/route.ts',
  'apps/main/app/api/preview/route.ts',
  'apps/main/app/cosmetic/page.tsx',
  'apps/main/app/layout.tsx',
  'apps/main/app/page.tsx'
];

for (const f of files) {
  const filePath = path.join(__dirname, f);
  if (!fs.existsSync(filePath)) continue;
  let content = fs.readFileSync(filePath, 'utf8');

  content = content.replace(/draftMode\(\)\.disable\(\)/g, '(await draftMode()).disable()');
  content = content.replace(/draftMode\(\)\.enable\(\)/g, '(await draftMode()).enable()');
  content = content.replace(/draftMode\(\)\.isEnabled/g, '(await draftMode()).isEnabled');

  if (f.endsWith('layout.tsx')) {
    content = content.replace(/export default function RootLayout/g, 'export default async function RootLayout');
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('Fixed draftMode issues!');
