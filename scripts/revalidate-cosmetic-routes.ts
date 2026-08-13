import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

const envPath = fs.existsSync(path.resolve(__dirname, '../apps/main/.env.local')) 
  ? path.resolve(__dirname, '../apps/main/.env.local') 
  : path.resolve(__dirname, '../.env');

dotenv.config({ path: envPath });

const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://vavaw.vn';
const REVALIDATION_SECRET = process.env.REVALIDATION_SECRET;

const COSMETIC_PATHS = [
  '/cosmetic',
  '/cosmetic/products/luminous-revitalization-sheer-set',
  '/cosmetic/products/cellurevive-ampoule',
  '/cosmetic/products/regenaglow-nourish-sheer-cream',
  '/cosmetic/products/calmiance-superior-sheer-gel',
  '/cosmetic/products/p30-boost-facial-hydrating-toner',
  '/cosmetic/products/gentle-activation-renew-ampoule',
  '/cosmetic/products/p30-boost-facial-moisturizer',
  '/cosmetic/products/lumiglow-rosy-sheer-sunscreen'
];

async function main() {
  console.log(`\n🚀 Triggering Next.js Revalidation for Cosmetic Routes`);
  
  if (!REVALIDATION_SECRET) {
    console.warn("⚠️ Missing REVALIDATION_SECRET in environment variables. Skipping revalidation.");
    process.exit(0);
  }

  const revalidateUrl = `${NEXT_PUBLIC_SITE_URL}/api/revalidate`;
  console.log(`Target URL: ${revalidateUrl}`);
  console.log(`Paths to revalidate: ${COSMETIC_PATHS.length}\n`);

  try {
    const res = await fetch(revalidateUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-revalidation-secret': REVALIDATION_SECRET,
      },
      body: JSON.stringify({ paths: COSMETIC_PATHS }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`❌ Revalidation failed with status ${res.status}:`, text);
      process.exit(1);
    }

    const data = await res.json();
    console.log("✅ Revalidation successful!");
    console.log(JSON.stringify(data, null, 2));

  } catch (error) {
    console.error("❌ Revalidation request failed:", error);
    process.exit(1);
  }
}

main().catch(console.error);
