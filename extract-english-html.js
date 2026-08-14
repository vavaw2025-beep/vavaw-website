const fs = require('fs');
const path = require('path');

const routes = [
  'index.html',
  'cosmetic.html',
  'system-update.html',
  'contact.html',
  'cosmetic/products/luminous-revitalization-sheer-set.html',
  'cosmetic/products/calmiance-superior-sheer-gel.html',
  'cosmetic/products/cellurevive-ampoule.html',
  'cosmetic/products/gentle-activation-renew-ampoule.html',
  'cosmetic/products/lumiglow-rosy-sheer-sunscreen.html',
  'cosmetic/products/p30-boost-facial-hydrating-toner.html',
  'cosmetic/products/p30-boost-facial-moisturizer.html',
  'cosmetic/products/regenaglow-nourish-sheer-cream.html'
];

const basePath = path.join(__dirname, 'apps/main/.next/server/app');

// Regex to strip HTML and extract visible-ish text
const extractText = (html) => {
    // Remove script and style tags completely
    let text = html.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ');
    // Remove all other HTML tags
    text = text.replace(/<[^>]+>/g, ' ');
    // Remove HTML entities like &nbsp;
    text = text.replace(/&[a-z]+;/gi, ' ');
    return text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
};

const ENGLISH_SIGNALS = [
  'the', 'and', 'for', 'with', 'from', 'into', 'designed', 'developed', 
  'skincare', 'recovery', 'system', 'premium', 'clinical', 'beauty', 
  'functional', 'ingredients', 'cautions', 'storage', 'quality', 
  'guarantee', 'product information', 'how to use', 'all rights reserved',
  'contact', 'home', 'shop', 'about', 'services', 'products'
];

const VIETNAMESE_DIACRITICS_REGEX = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/;

const candidates = [];

routes.forEach(route => {
    const filePath = path.join(basePath, route);
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping missing route file: ${filePath}`);
        return;
    }
    const html = fs.readFileSync(filePath, 'utf-8');
    const lines = extractText(html);
    
    // Split lines further by large spaces to isolate phrases
    const phrases = lines.join('  ').split(/\s{2,}/).map(p => p.trim()).filter(p => p.length > 0);
    
    phrases.forEach(phrase => {
        if (VIETNAMESE_DIACRITICS_REGEX.test(phrase)) return; // Skip Vietnamese
        
        // Check for English signals
        const words = phrase.toLowerCase().split(/[\s,.-]+/);
        const hasEnglish = words.some(w => ENGLISH_SIGNALS.includes(w));
        
        // Also allow strings that have multiple English words
        if (hasEnglish || (words.length >= 2 && /^[a-zA-Z\s,.-]+$/.test(phrase))) {
            candidates.push({ route, phrase });
        }
    });
});

// Deduplicate
const uniqueCandidates = [];
const seen = new Set();
candidates.forEach(c => {
    if (!seen.has(c.phrase)) {
        seen.add(c.phrase);
        uniqueCandidates.push(c);
    }
});

console.log(JSON.stringify(uniqueCandidates, null, 2));
