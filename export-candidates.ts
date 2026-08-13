import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { findEnglishCopyCandidates } from './packages/brand-config/src/translate-json-copy';
import * as fs from 'fs';

dotenv.config({ path: 'apps/main/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: blocks } = await supabase.from('content_blocks').select('*');
  let candidates = [];
  for (const block of blocks || []) {
    if (!block.content) continue;
    const cands = findEnglishCopyCandidates(block.content);
    for (const cand of cands) {
        candidates.push({
            page_path: block.page_path,
            block_type: block.block_type,
            text: cand.text,
            match: cand.match
        });
    }
  }
  
  // Dedup
  const uniqueCands = [];
  const seen = new Set();
  for (const c of candidates) {
      if (!seen.has(c.text)) {
          seen.add(c.text);
          uniqueCands.push(c);
      }
  }

  let md = "# Remaining Candidates\n\n| Page Path | Block Type | English Candidate | Match |\n|---|---|---|---|\n";
  for (const c of uniqueCands) {
      md += `| ${c.page_path} | ${c.block_type} | ${c.text.replace(/\n/g, ' ')} | ${c.match || 'None'} |\n`;
  }
  fs.writeFileSync('docs/cosmetic-remaining-english-copy-candidates.md', md);
  console.log(`Exported ${uniqueCands.length} unique candidates to docs/cosmetic-remaining-english-copy-candidates.md`);
}

run();
