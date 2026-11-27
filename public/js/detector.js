/**
 * Bharat Translator - Intelligent Multilingual Language & Script Detector
 * Identifies:
 * 1. Native Indic Unicode Scripts (Telugu, Devanagari, Tamil, Kannada, Malayalam, Bengali, Gujarati, Gurmukhi, Odia, Urdu, etc.)
 * 2. Romanized Indian Languages (Hinglish, Teluglish, Tanglish, Kanglish, Manglish, Banglish, Punjabi, Marathi, Gujarati)
 * 3. Standard English vocabulary & grammar
 */

// Distinctive marker words and tokens for Romanized Indian languages
const ROMANIZED_MARKERS = {
  te: [
    'ela', 'unnaru', 'unnavu', 'unnanu', 'unnara', 'unnamu', 'nenu', 'nuvvu', 'meeru', 'miru',
    'manamu', 'memu', 'vaaru', 'athadu', 'aame', 'idi', 'adi', 'enti', 'enduku', 'ekkada',
    'eppudu', 'evaru', 'naaku', 'neeku', 'maaku', 'meeku', 'aakali', 'vesthundi', 'vestundi',
    'velthunnanu', 'velthunna', 'cheppandi', 'chudandi', 'randi', 'vellandi', 'kavali', 'vaddu',
    'undi', 'ledu', 'avunu', 'kaadu', 'bagunnanu', 'bagunnara', 'bagunnava', 'dhanyavadalu',
    'namaskaram', 'emiti', 'cheyyi', 'cheyyali', 'cheppali', 'vastunnanu', 'tintunnanu',
    'annam', 'neellu', 'kura', 'vepudu', 'perugu', 'roju', 'ippudu', 'appudu', 'eppudo',
    'chala', 'koncham', 'inka', 'kuda', 'mari', 'ayithe', 'vachanu', 'vellanu', 'chesanu',
    'chusanu', 'unna', 'unnayi', 'kavala', 'lekapothe', 'telusu', 'teliyadu', 'ravali', 'vellali'
  ],
  hi: [
    'aap', 'kaise', 'kaisi', 'kaisa', 'ho', 'hai', 'hain', 'hoon', 'hum', 'tum', 'mera',
    'meri', 'mere', 'tera', 'teri', 'tere', 'apka', 'apki', 'apke', 'iska', 'iski', 'uska',
    'uski', 'kya', 'kyun', 'kahan', 'kab', 'kaun', 'kitna', 'kitne', 'mujhe', 'tujhe',
    'humein', 'unhe', 'paani', 'chahiye', 'khana', 'bhookh', 'lagi', 'laga', 'raha', 'rahi',
    'rahe', 'kar', 'karo', 'kijiye', 'boliye', 'suniye', 'shukriya', 'dhanyavaad', 'namaste',
    'achha', 'accha', 'theek', 'bahut', 'thoda', 'nahi', 'nahin', 'haan', 'bhi', 'aur',
    'lekin', 'kyunki', 'aaj', 'kal', 'abhi', 'yahan', 'wahan', 'sabzi', 'bhai', 'dost', 'karenge'
  ],
  ta: [
    'eppadi', 'irukkinga', 'irukkeenga', 'irukken', 'irukku', 'irukkeengala', 'naan', 'nee',
    'neenga', 'namma', 'enaku', 'enakku', 'unakku', 'ungalukku', 'nandri', 'vanakkam', 'enna',
    'edhuku', 'enga', 'eppo', 'yaaru', 'thannir', 'thanni', 'venum', 'vendaam', 'pasi',
    'saapadu', 'sapten', 'saaptingala', 'poren', 'vaanga', 'ponga', 'sollunga', 'nalla',
    'romba', 'konjam', 'illai', 'aama', 'ippo', 'appo', 'inge', 'ange', 'theriyum', 'theriyathu'
  ],
  kn: [
    'hegiddira', 'hegiddiya', 'hege', 'neevu', 'neenu', 'naanu', 'naavu', 'namaskara',
    'dhanyavada', 'enidu', 'enu', 'yake', 'elli', 'yaavaaga', 'yaaru', 'neeru', 'beku',
    'beda', 'oota', 'aayitha', 'hasiwu', 'ide', 'illa', 'houdu', 'chennagiddini', 'banni',
    'hogi', 'heli', 'kodi', 'tumba', 'swalpa', 'matte', 'yelli', 'ivattu', 'naale', 'madidira'
  ],
  ml: [
    'sukhamano', 'sukhamanu', 'evide', 'enthannu', 'entha', 'engane', 'njan', 'nee',
    'ningal', 'namukku', 'enikku', 'ninakku', 'vellam', 'venam', 'venda', 'bhakshanam',
    'kazhicho', 'vishappu', 'undu', 'illa', 'athe', 'nanni', 'namaskaram', 'ivide',
    'avide', 'ippol', 'eppo', 'valare', 'kurachu', 'ariyaam', 'ariyilla', 'vannu', 'poyi'
  ],
  bn: [
    'kemon', 'achen', 'acho', 'achis', 'ami', 'tumi', 'apni', 'amra', 'amake', 'tomake',
    'apnake', 'ki', 'keno', 'kothay', 'kobe', 'ke', 'jol', 'lagbe', 'khabar', 'khabo',
    'khide', 'dhonnobad', 'bhalo', 'khub', 'ektu', 'na', 'hyan', 'ekhon', 'kokhon', 'shob'
  ],
  pa: [
    'kiven', 'tusi', 'tussi', 'kithe', 'kidda', 'kiddan', 'ki', 'kyun', 'kadon', 'kaun',
    'main', 'assi', 'paani', 'chahida', 'khana', 'bhookh', 'lagi', 'dhanwaad', 'sat',
    'sri', 'akal', 'changa', 'theek', 'bahut', 'nahi', 'haan', 'ajj', 'kal', 'ethe', 'othe'
  ],
  mr: [
    'kasa', 'kase', 'kashi', 'ahes', 'ahat', 'kuthe', 'kay', 'kiti', 'kadhi', 'kon',
    'mi', 'aamhi', 'tu', 'tumhi', 'paani', 'pahije', 'jevan', 'bhook', 'lagli',
    'dhanyavaad', 'namaskar', 'chhan', 'khup', 'thoda', 'nahi', 'hoy', 'aaj', 'udya', 'ata'
  ],
  gu: [
    'kem', 'cho', 'kya', 'kare', 'shu', 'kone', 'hu', 'ame', 'tame', 'paani', 'joiye',
    'khavanu', 'bhookh', 'laagi', 'aabhar', 'namaste', 'saru', 'ghano', 'thodu', 'nathi',
    'ha', 'aaje', 'aave'
  ]
};

// Common English words (stop words + frequent vocabulary)
const ENGLISH_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with',
  'he', 'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her',
  'she', 'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up',
  'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time',
  'no', 'just', 'him', 'know', 'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could',
  'them', 'see', 'other', 'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think',
  'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even',
  'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us', 'are', 'is', 'am', 'was',
  'were', 'been', 'being', 'need', 'water', 'food', 'hungry', 'thirsty', 'brinjal', 'potato', 'tomato',
  'curry', 'vegetable', 'rice', 'fruit', 'morning', 'afternoon', 'evening', 'night', 'thank', 'thanks',
  'welcome', 'please', 'sorry', 'excuse', 'hotel', 'hospital', 'station', 'school', 'college', 'room',
  'ticket', 'train', 'bus', 'flight', 'airport', 'car', 'bike', 'house', 'home', 'road', 'street',
  'friend', 'brother', 'sister', 'mother', 'father', 'family', 'money', 'price', 'cost', 'where', 'why'
]);

export class LanguageDetector {
  /**
   * Fast script detection by Unicode code ranges
   * @param {string} text
   * @returns {string} language id or 'latin' / 'unknown'
   */
  static detectScript(text) {
    if (!text || typeof text !== 'string') return 'en';
    const s = text.trim();
    if (!s) return 'en';

    let counts = {
      te: 0, hi: 0, ta: 0, bn: 0, kn: 0, ml: 0, gu: 0, pa: 0, or: 0, ur: 0, sat: 0, mni: 0, latin: 0
    };

    for (let i = 0; i < s.length; i++) {
      const code = s.charCodeAt(i);
      if (code >= 0x0c00 && code <= 0x0c7f) counts.te++;
      else if (code >= 0x0900 && code <= 0x097f) counts.hi++;
      else if (code >= 0x0b80 && code <= 0x0bff) counts.ta++;
      else if (code >= 0x0980 && code <= 0x09ff) counts.bn++;
      else if (code >= 0x0c80 && code <= 0x0cff) counts.kn++;
      else if (code >= 0x0d00 && code <= 0x0d7f) counts.ml++;
      else if (code >= 0x0a80 && code <= 0x0aff) counts.gu++;
      else if (code >= 0x0a00 && code <= 0x0a7f) counts.pa++;
      else if (code >= 0x0b00 && code <= 0x0b7f) counts.or++;
      else if (code >= 0x0600 && code <= 0x06ff) counts.ur++;
      else if (code >= 0x1c50 && code <= 0x1c7f) counts.sat++;
      else if (code >= 0xabc0 && code <= 0xabff) counts.mni++;
      else if ((code >= 65 && code <= 90) || (code >= 97 && code <= 122)) counts.latin++;
    }

    // Sort by frequency of non-latin Indic scripts first
    const indicList = Object.entries(counts)
      .filter(([k, v]) => k !== 'latin' && v > 0)
      .sort((a, b) => b[1] - a[1]);

    if (indicList.length > 0 && indicList[0][1] >= 2) {
      return indicList[0][0];
    }

    if (counts.latin > 0) {
      return 'latin';
    }

    return indicList.length > 0 ? indicList[0][0] : 'en';
  }

  /**
   * Detects whether Latin-script text is Romanized Indian language or standard English
   * @param {string} text
   * @returns {{ lang: string, isRomanized: boolean, confidence: number }}
   */
  static detectRomanizedLanguage(text) {
    if (!text || typeof text !== 'string') return { lang: 'en', isRomanized: false, confidence: 1 };
    const clean = text.toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!clean) return { lang: 'en', isRomanized: false, confidence: 1 };

    const tokens = clean.split(' ').filter((w) => w.length >= 2);
    if (tokens.length === 0) return { lang: 'en', isRomanized: false, confidence: 1 };

    // Score English vs Indian languages
    let englishScore = 0;
    for (const token of tokens) {
      if (ENGLISH_WORDS.has(token)) {
        englishScore += 2;
      }
    }

    const scores = { te: 0, hi: 0, ta: 0, kn: 0, ml: 0, bn: 0, pa: 0, mr: 0, gu: 0 };

    // Score each language based on marker keywords
    for (const [lang, markers] of Object.entries(ROMANIZED_MARKERS)) {
      const markerSet = new Set(markers);
      for (const token of tokens) {
        if (markerSet.has(token)) {
          scores[lang] += 3;
        } else {
          // Substring / suffix matching (e.g. "unnaru", "chahiye", "irukku")
          for (const m of markers) {
            if (m.length >= 4 && (token.endsWith(m) || token.startsWith(m))) {
              scores[lang] += 1.5;
              break;
            }
          }
        }
      }
    }

    // Specific multi-word phrases boost
    if (/ela\s+unna/i.test(clean) || /naaku\s+aakali/i.test(clean) || /meeru\s+ela/i.test(clean)) scores.te += 10;
    if (/kaise\s+ho/i.test(clean) || /paani\s+chahiye/i.test(clean) || /kya\s+haal/i.test(clean) || /kahan\s+ho/i.test(clean)) scores.hi += 10;
    if (/eppadi\s+iruk/i.test(clean) || /thanni\s+venum/i.test(clean) || /vanakkam/i.test(clean)) scores.ta += 10;
    if (/hegidd/i.test(clean) || /neeru\s+beku/i.test(clean) || /oota\s+aayitha/i.test(clean)) scores.kn += 10;
    if (/sukhamano/i.test(clean) || /vellam\s+venam/i.test(clean)) scores.ml += 10;
    if (/kemon\s+ach/i.test(clean) || /apni\s+kemon/i.test(clean)) scores.bn += 10;
    if (/kiven\s+ho/i.test(clean) || /tusi\s+kiven/i.test(clean)) scores.pa += 10;
    if (/kasa\s+ahes/i.test(clean) || /kase\s+ahat/i.test(clean)) scores.mr += 10;
    if (/kem\s+cho/i.test(clean)) scores.gu += 10;

    const sortedIndic = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const topIndic = sortedIndic[0];

    // If highest Indic score is strong and beats English, it's a Romanized Indian language
    if (topIndic[1] >= 2.5 && topIndic[1] > englishScore) {
      return {
        lang: topIndic[0],
        isRomanized: true,
        confidence: Math.min(0.99, 0.6 + (topIndic[1] / (topIndic[1] + englishScore + 1)) * 0.39)
      };
    }

    // Single common greeting/phrase matches even if single word
    for (const [lang, markers] of Object.entries(ROMANIZED_MARKERS)) {
      if (markers.includes(clean)) {
        return { lang, isRomanized: true, confidence: 0.95 };
      }
    }

    return {
      lang: 'en',
      isRomanized: false,
      confidence: englishScore > 0 ? 0.95 : 0.7
    };
  }

  /**
   * Main unified detector
   * @param {string} text
   * @returns {{ lang: string, isRomanized: boolean, confidence: number }}
   */
  static detect(text) {
    if (!text || !text.trim()) {
      return { lang: 'en', isRomanized: false, confidence: 1 };
    }

    const script = this.detectScript(text);
    if (script !== 'latin') {
      return { lang: script, isRomanized: false, confidence: 1 };
    }

    return this.detectRomanizedLanguage(text);
  }
}
