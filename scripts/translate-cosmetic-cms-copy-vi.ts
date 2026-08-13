import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Use the shared brand-config package for dictionaries and helpers
import { translateJsonCopy, findEnglishCopyCandidates } from '@vavaw/brand-config';

// Load environment from root .env or apps/main/.env.local
const envPath = fs.existsSync(path.resolve(__dirname, '../.env')) 
  ? path.resolve(__dirname, '../.env') 
  : path.resolve(__dirname, '../apps/main/.env.local');

dotenv.config({ path: envPath });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const isApplyPassed = process.argv.includes('--apply');
const isDryRunPassed = process.argv.includes('--dry-run');

// Default to dry run if no flags
const isApplyMode = isApplyPassed;

async function main() {
  if (!isApplyPassed && !isDryRunPassed) {
    console.log("⚠️ No mode provided. Running in --dry-run mode.");
  }

  console.log(`\n🚀 Starting Cosmetic CMS Copy Translation Pipeline`);
  console.log(`Mode: ${isApplyMode ? 'APPLY (Writing to DB)' : 'DRY RUN (Read only)'}\n`);

  if (isApplyMode) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY for apply mode.");
      process.exit(1);
    }
  } else {
    if (!SUPABASE_URL) {
      console.error("❌ Missing SUPABASE_URL.");
      process.exit(1);
    }
  }

  // Use anon key for dry-run if service role is missing, but service role is strictly required for apply
  const keyToUse = (isApplyMode ? SUPABASE_SERVICE_ROLE_KEY : (SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)) as string;
  const supabase = createClient(SUPABASE_URL as string, keyToUse);

  // Target exactly the main cosmetic blocks
  const { data: blocks, error } = await supabase
    .from('content_blocks')
    .select('id, page_path, block_type, content, is_active, sort_order')
    .eq('site_key', 'main')
    .or('page_path.eq./cosmetic,page_path.like./cosmetic/products/%');

  if (error) {
    console.error("❌ Failed to fetch content_blocks:", error);
    process.exit(1);
  }

  if (!blocks || blocks.length === 0) {
    console.log("No cosmetic blocks found.");
    process.exit(0);
  }

  console.log(`Found ${blocks.length} blocks to inspect.`);

  let changedCount = 0;
  let reportLines: string[] = [
    `# Cosmetic CMS Copy Translation Report`,
    `Generated at: ${new Date().toISOString()}`,
    `Mode: ${isApplyMode ? 'APPLY' : 'DRY RUN'}`,
    ``,
    `| Page Path | Block Type | Row ID | English Match | Vietnamese Replacement | Action |`,
    `|-----------|------------|--------|---------------|------------------------|--------|`
  ];

  const blocksToUpdate: Array<{ id: string; content: any }> = [];

  for (const block of blocks) {
    if (!block.content) continue;

    // Translate JSON safely
    const res = translateJsonCopy(block.content);

    if (res.changed) {
      changedCount++;
      blocksToUpdate.push({ id: block.id, content: res.value });
      
      // We don't have the exact strings returned from translateJsonCopy in the current API,
      // so we use (multiple) or we can infer it. For the report, we'll mark the block as updated.
      reportLines.push(`| \`${block.page_path}\` | \`${block.block_type}\` | \`${block.id}\` | (multiple) | (multiple) | ${isApplyMode ? 'UPDATED' : 'WOULD UPDATE'} |`);
    } else {
      // Find remaining English candidates to flag
      const remainingCandidates = findEnglishCopyCandidates(block.content);
      if (remainingCandidates.length > 0) {
        for (const cand of remainingCandidates) {
          // If match is found, it means it should have been translated, but we report candidates
          const matchText = cand.match ? cand.match : "(None)";
          reportLines.push(`| \`${block.page_path}\` | \`${block.block_type}\` | \`${block.id}\` | "${cand.text}" | ${matchText} | SKIPPED (Needs review) |`);
        }
      }
    }
  }

  // Write report
  const reportDir = path.resolve(__dirname, '../docs');
  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true });
  
  const reportPath = path.join(reportDir, 'cosmetic-cms-copy-translation-report.md');
  fs.writeFileSync(reportPath, reportLines.join('\n'), 'utf8');

  console.log(`Blocks with changes: ${changedCount}/${blocks.length}`);
  
  if (isApplyMode) {
    if (blocksToUpdate.length === 0) {
      console.log(`\n✅ No blocks need updating.`);
    } else {
      console.log(`\nApplying updates to ${blocksToUpdate.length} blocks...`);
      for (const update of blocksToUpdate) {
        const { error: updateError } = await supabase
          .from('content_blocks')
          .update({
            content: update.content,
            updated_at: new Date().toISOString()
          })
          .eq('id', update.id);

        if (updateError) {
          console.error(`❌ Failed to update block ${update.id}:`, updateError);
        } else {
          console.log(`✅ Updated block ${update.id}`);
        }
      }
      console.log(`\n✅ Completed.`);
    }
  } else {
    console.log(`\nReport written to: docs/cosmetic-cms-copy-translation-report.md`);
    console.log(`Run with --apply to execute these changes.`);
  }
}

main().catch(console.error);
