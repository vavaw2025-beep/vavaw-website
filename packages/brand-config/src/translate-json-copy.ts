import { 
  COSMETIC_VI_COPY_MAP, 
  COSMETIC_COPY_PROTECTED_PHRASES, 
  COSMETIC_COPY_PROTECTED_KEYS 
} from './cosmetic-vietnamese-copy-map';

export interface TranslateResult {
  value: any;
  changed: boolean;
}

function isProtectedValue(val: string): boolean {
  if (COSMETIC_COPY_PROTECTED_PHRASES.includes(val)) return true;
  if (val.trim() === '') return true;
  // skip URL-like strings
  if (val.startsWith('http://') || val.startsWith('https://') || val.startsWith('/')) return true;
  return false;
}

/**
 * Recursively walks JSON and replaces exact string matches using the dictionary.
 * Preserves structure, unknown keys, arrays, and protected fields.
 */
export function translateJsonCopy(
  obj: any,
  dictionary: Record<string, string> = COSMETIC_VI_COPY_MAP,
  keyContext?: string
): TranslateResult {
  if (obj === null || obj === undefined) return { value: obj, changed: false };

  // Array
  if (Array.isArray(obj)) {
    let changed = false;
    const newArr = obj.map((item) => {
      const res = translateJsonCopy(item, dictionary, keyContext);
      if (res.changed) changed = true;
      return res.value;
    });
    return { value: newArr, changed };
  }

  // Object
  if (typeof obj === 'object') {
    let changed = false;
    const newObj: Record<string, any> = {};
    for (const [key, val] of Object.entries(obj)) {
      if (COSMETIC_COPY_PROTECTED_KEYS.includes(key)) {
        newObj[key] = val; // skip entirely
      } else {
        const res = translateJsonCopy(val, dictionary, key);
        if (res.changed) changed = true;
        newObj[key] = res.value;
      }
    }
    return { value: newObj, changed };
  }

  // String
  if (typeof obj === 'string') {
    if (isProtectedValue(obj)) {
      return { value: obj, changed: false };
    }

    // Try exact match
    const exactMatch = (dictionary as any)[obj];
    if (exactMatch) {
      return { value: exactMatch, changed: true };
    }

    // Try trimmed match
    const trimmedMatch = (dictionary as any)[obj.trim()];
    if (trimmedMatch) {
      const replaced = obj.replace(obj.trim(), trimmedMatch);
      return { value: replaced, changed: true };
    }

    return { value: obj, changed: false };
  }

  // Booleans, numbers, etc.
  return { value: obj, changed: false };
}

export interface CandidateResult {
  text: string;
  match: string | null;
}

const VIETNAMESE_DIACRITICS_REGEX = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/;

const COMMON_VIETNAMESE_WORDS = [
  'và', 'của', 'cho', 'với', 'được', 'trong', 'một', 'không', 
  'làn da', 'chăm sóc', 'phục hồi', 'thành phần', 'hướng dẫn', 
  'bảo quản', 'lưu ý', 'sản phẩm', 'cao cấp', 'khoa học', 'lâm sàng'
];

const ENGLISH_SIGNALS = [
  'the', 'and', 'for', 'with', 'from', 'into', 'designed', 'developed', 
  'skincare', 'recovery', 'system', 'premium', 'clinical', 'beauty', 
  'functional', 'ingredients', 'cautions', 'storage', 'quality', 
  'guarantee', 'product information', 'how to use'
];

/**
 * Scans JSON recursively and returns likely English copy candidates.
 */
export function findEnglishCopyCandidates(
  obj: any,
  keyContext?: string
): CandidateResult[] {
  let candidates: CandidateResult[] = [];

  if (obj === null || obj === undefined) return candidates;

  if (Array.isArray(obj)) {
    for (const item of obj) {
      candidates = candidates.concat(findEnglishCopyCandidates(item, keyContext));
    }
    return candidates;
  }

  if (typeof obj === 'object') {
    for (const [key, val] of Object.entries(obj)) {
      if (!COSMETIC_COPY_PROTECTED_KEYS.includes(key)) {
        candidates = candidates.concat(findEnglishCopyCandidates(val, key));
      }
    }
    return candidates;
  }

  if (typeof obj === 'string') {
    if (isProtectedValue(obj)) return candidates;

    const exactMatch = (COSMETIC_VI_COPY_MAP as Record<string, string>)[obj];
    const trimmedMatch = (COSMETIC_VI_COPY_MAP as Record<string, string>)[obj.trim()];

    if (exactMatch || trimmedMatch) {
      candidates.push({
        text: obj,
        match: exactMatch || trimmedMatch
      });
      return candidates;
    }

    // Heuristic: check if it's likely English UI text
    
    // Rule A: Do NOT flag strings that contain Vietnamese diacritics
    if (VIETNAMESE_DIACRITICS_REGEX.test(obj)) {
      return candidates;
    }

    // Rule B: Do NOT flag strings containing common Vietnamese words
    const lowerObj = obj.toLowerCase();
    if (COMMON_VIETNAMESE_WORDS.some(word => lowerObj.includes(word))) {
      return candidates;
    }

    // Rule D: DO flag likely English sentences if it matches English signals
    // Also, we want to ensure it has words
    const hasEnglishSignal = ENGLISH_SIGNALS.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      return regex.test(obj);
    });

    if (hasEnglishSignal && obj.split(' ').length > 1 && /[a-zA-Z]/.test(obj)) {
      candidates.push({
        text: obj,
        match: null
      });
    }
  }

  return candidates;
}
