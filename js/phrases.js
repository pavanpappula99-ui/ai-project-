/**
 * Essential Travel & Business Phrases Dictionary
 * Categorized curated phrases for face-to-face travel in India.
 * Includes offline translations for core languages (English, Hindi, Punjabi, Tamil, etc.)
 */

// Categorized Romanized Slang Chips for Instant 1-Tap Travel Communication
export const LANGUAGE_SLANG_CHIPS = {
  te: [
    { slang: 'nuvvu', native: 'నువ్వు', meaning: 'You' },
    { slang: 'nenu', native: 'నేను', meaning: 'I / Me' },
    { slang: 'ela unnavu', native: 'ఎలా ఉన్నావు', meaning: 'How are you?' },
    { slang: 'ekkada unnavu', native: 'ఎక్కడ ఉన్నావు', meaning: 'Where are you?' },
    { slang: 'bagunnava', native: 'బాగున్నావా', meaning: 'Are you fine?' },
    { slang: 'namaskaram', native: 'నమస్కారం', meaning: 'Hello / Greetings' },
    { slang: 'intiki velthunnanu', native: 'ఇంటికి వెళ్తున్నాను', meaning: 'Going home' },
    { slang: 'chala dhanyavadalu', native: 'చాలా ధన్యవాదాలు', meaning: 'Thank you very much' },
    { slang: 'kavali', native: 'కావాలి', meaning: 'Need / Want' },
    { slang: 'enti sangathi', native: 'ఏంటి సంగతి', meaning: 'What is the matter?' }
  ],
  hi: [
    { slang: 'aap kaise ho', native: 'आप कैसे हो', meaning: 'How are you?' },
    { slang: 'kya haal hai', native: 'क्या हाल है', meaning: 'What is up?' },
    { slang: 'kahan ho', native: 'कहाँ हो', meaning: 'Where are you?' },
    { slang: 'namaste', native: 'नमस्ते', meaning: 'Hello' },
    { slang: 'shukriya', native: 'शुक्रिया', meaning: 'Thank you' },
    { slang: 'paani chahiye', native: 'पानी चाहिए', meaning: 'Need water' },
    { slang: 'kitna hua', native: 'कितना हुआ', meaning: 'How much?' },
    { slang: 'madad kijiye', native: 'मदद कीजिए', meaning: 'Please help' }
  ],
  ta: [
    { slang: 'vanakkam', native: 'வணக்கம்', meaning: 'Hello' },
    { slang: 'epdi irukinga', native: 'எப்படி இருக்கீங்க', meaning: 'How are you?' },
    { slang: 'enga irukinga', native: 'எங்க இருக்கீங்க', meaning: 'Where are you?' },
    { slang: 'nandri', native: 'நன்றி', meaning: 'Thank you' },
    { slang: 'thanni venum', native: 'தண்ணீர் வேண்டும்', meaning: 'Need water' },
    { slang: 'evvalavu aachu', native: 'எவ்வளவு ஆச்சு', meaning: 'How much was it?' }
  ],
  pa: [
    { slang: 'sat sri akal', native: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ', meaning: 'Hello' },
    { slang: 'tussi kidda ho', native: 'ਤੁਸੀਂ ਕਿੱਦਾਂ ਹੋ', meaning: 'How are you?' },
    { slang: 'kithe ho', native: 'ਕਿੱਥੇ ਹੋ', meaning: 'Where are you?' },
    { slang: 'dhannvaad', native: 'ਧੰਨਵਾਦ', meaning: 'Thank you' },
    { slang: 'kinne da hai', native: 'ਕਿੰਨੇ ਦਾ ਹੈ', meaning: 'How much is this?' }
  ],
  bn: [
    { slang: 'kemon acho', native: 'কেমন আছো', meaning: 'How are you?' },
    { slang: 'kothay jachho', native: 'কোথায় যাচ্ছ', meaning: 'Where are you going?' },
    { slang: 'dhonnobad', native: 'ধন্যবাদ', meaning: 'Thank you' },
    { slang: 'koto holo', native: 'কত হলো', meaning: 'How much?' }
  ],
  mr: [
    { slang: 'kasa ahes', native: 'कसा आहेस', meaning: 'How are you?' },
    { slang: 'kuthe ahat', native: 'कुठे आहात', meaning: 'Where are you?' },
    { slang: 'dhanyavaad', native: 'धन्यवाद', meaning: 'Thank you' },
    { slang: 'pani hava', native: 'पाणी हवे', meaning: 'Need water' }
  ],
  gu: [
    { slang: 'kem cho', native: 'કેમ છો', meaning: 'How are you?' },
    { slang: 'kya cho', native: 'ક્યાં છો', meaning: 'Where are you?' },
    { slang: 'aabhar', native: 'આભાર', meaning: 'Thank you' }
  ],
  kn: [
    { slang: 'hegiddeera', native: 'ಹೇಗಿದ್ದೀರಾ', meaning: 'How are you?' },
    { slang: 'elli iddeera', native: 'ಎಲ್ಲಿ ಇದ್ದೀರಾ', meaning: 'Where are you?' },
    { slang: 'dhanyavadagalu', native: 'ಧನ್ಯವಾದಗಳು', meaning: 'Thank you' }
  ],
  ml: [
    { slang: 'sukhamano', native: 'സുഖമാണോ', meaning: 'How are you?' },
    { slang: 'evideyanu', native: 'എവിടെയാണ്', meaning: 'Where are you?' },
    { slang: 'nandi', native: 'നന്ദി', meaning: 'Thank you' }
  ],
  ur: [
    { slang: 'kya haal hai', native: 'کیا حال ہے', meaning: 'How are you?' },
    { slang: 'kahan ho', native: 'کہاں ہو', meaning: 'Where are you?' },
    { slang: 'shukriya', native: 'شکریہ', meaning: 'Thank you' }
  ]
};

export const CATEGORIES = [
  { id: 'essentials', name: 'Essentials', icon: '⭐' },
  { id: 'travel', name: 'Travel & Directions', icon: '🧭' },
  { id: 'food', name: 'Food & Dining', icon: '🍲' },
  { id: 'shopping', name: 'Shopping & Money', icon: '🛍️' },
  { id: 'emergency', name: 'Emergency & Health', icon: '🚨' },
  { id: 'business', name: 'Business & Meetings', icon: '💼' }
];

export const PRESET_PHRASES = [
  // Essentials
  {
    id: 'p_hello',
    category: 'essentials',
    en: 'Hello / Greetings',
    translations: {
      hi: 'नमस्ते',
      pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ',
      ta: 'வணக்கம்',
      te: 'నమస్కారం',
      bn: 'নমস্কার',
      mr: 'नमस्ते',
      gu: 'નમસ્તે',
      kn: 'ನಮಸ್ಕಾರ',
      ml: 'നമസ്കാരം',
      ur: 'السلام علیکم',
      as: 'নমস্কাৰ',
      or: 'ନମସ୍କାର',
      sa: 'नमो नमः',
      ne: 'नमस्ते'
    }
  },
  {
    id: 'p_thank_you',
    category: 'essentials',
    en: 'Thank you very much',
    translations: {
      hi: 'बहुत-बहुत धन्यवाद',
      pa: 'ਬਹੁਤ ਬਹੁਤ ਧੰਨਵਾਦ',
      ta: 'மிக்க நன்றி',
      te: 'చాలా ధన్యవాదాలు',
      bn: 'অনেক ধন্যবাদ',
      mr: 'खूप खूप धन्यवाद',
      gu: 'ખૂબ ખૂબ આભાર',
      kn: 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು',
      ml: 'വളരെ നന്ദി',
      ur: 'بہت بہت شکریہ',
      as: 'বহুত বহুত ধন্যবাদ',
      or: 'ଅଶେଷ ଧନ୍ୟବାଦ',
      sa: 'धन्यवादः'
    }
  },
  {
    id: 'p_please',
    category: 'essentials',
    en: 'Please help me',
    translations: {
      hi: 'कृपया मेरी मदद करें',
      pa: 'ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੀ ਮਦਦ ਕਰੋ',
      ta: 'தயவுசெய்து எனக்கு உதவுங்கள்',
      te: 'దయచేసి నాకు సహాయం చేయండి',
      bn: 'দয়া করে আমাকে সাহায্য করুন',
      mr: 'कृपया मला मदत करा',
      gu: 'કૃપા કરીને મને મદદ કરો',
      kn: 'ದಯವಿಟ್ಟು ನನಗೆ ಸಹಾಯ ಮಾಡಿ',
      ml: 'ദയവായി എന്നെ സഹായിക്കൂ',
      ur: 'براہ کرم میری مدد کریں'
    }
  },
  {
    id: 'p_bathroom',
    category: 'travel',
    en: 'Where is the bathroom / washroom?',
    translations: {
      hi: 'शौचालय कहां है?',
      pa: 'ਵਾਸ਼ਰੂਮ / ਗੁਸਲਖਾਨਾ ਕਿੱਥੇ ਹੈ?',
      ta: 'கழிப்பறை எங்கே உள்ளது?',
      te: 'వాష్‌రూమ్ / టాయిలెట్ ఎక్కడ ఉంది?',
      bn: 'শৌচাগারটি কোথায়?',
      mr: 'शौचालय कुठे आहे?',
      gu: 'વોશરૂમ / શૌચાલય ક્યાં છે?',
      kn: 'ಶೌಚಾಲಯ ಎಲ್ಲಿದೆ?',
      ml: 'ബാത്ത്റൂം എവിടെയാണ്?',
      ur: 'بیت الخلا کہاں ہے؟'
    }
  },
  {
    id: 'p_station',
    category: 'travel',
    en: 'How do I get to the railway station or airport?',
    translations: {
      hi: 'रेलवे स्टेशन या हवाई अड्डे कैसे जाएं?',
      pa: 'ਰੇਲਵੇ ਸਟੇਸ਼ਨ ਜਾਂ ਹਵਾਈ ਅੱਡੇ ਕਿਵੇਂ ਪਹੁੰਚਣਾ ਹੈ?',
      ta: 'ரயில் நிலையம் அல்லது விமான நிலையத்திற்கு எப்படி செல்வது?',
      te: 'రైల్వే స్టేషన్ లేదా విమానాశ్రయానికి ఎలా వెళ్ళాలి?',
      bn: 'রেলওয়ে স্টেশন বা বিমানবন্দরে কীভাবে যাব?',
      mr: 'रेल्वे स्टेशन किंवा विमानतळावर कसे जायचे?',
      gu: 'રેલ્વે સ્ટેશન કે એરપોર્ટ કેવી રીતે જવું?',
      ur: 'ریلوے اسٹیشن یا ہوائی اڈے کیسے جائیں؟'
    }
  },
  {
    id: 'p_cost',
    category: 'shopping',
    en: 'How much does this cost?',
    translations: {
      hi: 'इसकी कीमत क्या है? / यह कितने का है?',
      pa: 'ਇਸਦੀ ਕੀਮਤ ਕਿੰਨੀ ਹੈ? / ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?',
      ta: 'இதன் விலை என்ன?',
      te: 'దీని ధర ఎంత?',
      bn: 'এটার দাম কত?',
      mr: 'याची किंमत किती आहे?',
      gu: 'આની કિંમત કેટલી છે?',
      kn: 'ಇದರ ಬೆಲೆ ಎಷ್ಟು?',
      ml: 'ഇതിന് എത്ര വിലയാകും?',
      ur: 'اس کی قیمت کتنی ہے؟'
    }
  },
  {
    id: 'p_discount',
    category: 'shopping',
    en: 'Can you give me a discount, please?',
    translations: {
      hi: 'क्या आप थोड़ा कम कर सकते हैं?',
      pa: 'ਕੀ ਤੁਸੀਂ ਥੋੜ੍ਹਾ ਘੱਟ ਕਰ ਸਕਦੇ ਹੋ?',
      ta: 'கொஞ்சம் குறைத்து தர முடியுமா?',
      te: 'కొంచెం తగ్గిస్తారా?',
      bn: 'কিছুটা ছাড় দেওয়া যাবে কি?',
      mr: 'काही सवलत मिळेल का?',
      gu: 'થોડો ઘટાડો કરી શકશો?',
      ur: 'کیا آپ کچھ رعایت کر سکتے ہیں؟'
    }
  },
  {
    id: 'p_water',
    category: 'food',
    en: 'Drinking water, please',
    translations: {
      hi: 'पीने का पानी चाहिए, कृपया',
      pa: 'ਪੀਣ ਵਾਲਾ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ ਜੀ',
      ta: 'குடிநீர் கொடுங்கள், தயவுசெய்து',
      te: 'త్రాగునీరు ఇవ్వండి, దయచేసి',
      bn: 'খাওয়ার জল দিন, দয়া করে',
      mr: 'पिण्याचे पाणी द्या, कृपया',
      gu: 'પીવાનું પાણી આપશો, પ્લીઝ',
      kn: 'ಕುಡಿಯುವ ನೀರು ಕೊಡಿ',
      ml: 'കുടിവെള്ളം തരുമോ',
      ur: 'پینے کا پانی دیں، براہ کرم'
    }
  },
  {
    id: 'p_vegetarian',
    category: 'food',
    en: 'Is this food pure vegetarian / non-spicy?',
    translations: {
      hi: 'क्या यह खाना शुद्ध शाकाहारी और कम तीखा है?',
      pa: 'ਕੀ ਇਹ ਭੋਜਨ ਸ਼ੁੱਧ ਸ਼ਾਕਾਹਾਰੀ ਅਤੇ ਘੱਟ ਮਸਾਲੇਦਾਰ ਹੈ?',
      ta: 'இந்த உணவு சைவ உணவா? காரம் குறைவா?',
      te: 'ఈ ఆహారం శాకాహారమా? కారం తక్కువగా ఉందా?',
      bn: 'এই খাবার কি নিরামিষ এবং কম ঝাল?',
      mr: 'हे जेवण शाकाहारी आणि कमी तिखट आहे का?',
      gu: 'આ ખોરાક શાકાહારી અને ઓછો તીખો છે?',
      ur: 'کیا یہ کھانا سبزی خور اور کم مرچ والا ہے؟'
    }
  },
  {
    id: 'p_doctor',
    category: 'emergency',
    en: 'I need a doctor / Call an ambulance immediately',
    translations: {
      hi: 'मुझे डॉक्टर की जरूरत है / तुरंत एम्बुलेंस बुलाएं',
      pa: 'ਮੈਨੂੰ ਡਾਕਟਰ ਦੀ ਲੋੜ ਹੈ / ਤੁਰੰਤ ਐਂਬੂਲੈਂਸ ਬੁਲਾਓ',
      ta: 'எனக்கு மருத்துவர் தேவை / உடனே ஆம்புலன்ஸ் அழையுங்கள்',
      te: 'నాకు డాక్టర్ కావాలి / వెంటనే అంబులెన్స్ పిలవండి',
      bn: 'আমার ডাক্তার দরকার / অবিলম্বে অ্যাম্বুলেন্স ডাকুন',
      mr: 'मला डॉक्टरची गरज आहे / ताबडतोब रुग्णवाहिका बोलवा',
      gu: 'મને ડૉક્ટરની જરૂર છે / તાત્કાલિક એમ્બ્યુલન્સ બોલાવો',
      ur: 'مجھے ڈاکٹر کی ضرورت ہے / فوراً ایمبولینس بلائیں'
    }
  },
  {
    id: 'p_police',
    category: 'emergency',
    en: 'Where is the nearest police station?',
    translations: {
      hi: 'निकटतम पुलिस स्टेशन कहां है?',
      pa: 'ਨੇੜਲਾ ਪੁਲਿਸ ਥਾਣਾ ਕਿੱਥੇ ਹੈ?',
      ta: 'அருகிலுள்ள காவல் நிலையம் எங்கே?',
      te: 'సమీప పోలీస్ స్టేషన్ ఎక్కడ ఉంది?',
      bn: 'নিকটতম থানা কোথায়?',
      mr: 'जवळचे पोलीस ठाणे कुठे आहे?',
      gu: 'નજીકનું પોલીસ સ્ટેશન ક્યાં છે?',
      ur: 'قریبی پولیس اسٹیشن کہاں ہے؟'
    }
  },
  {
    id: 'p_business_meeting',
    category: 'business',
    en: 'Pleased to meet you. Let us discuss the proposal.',
    translations: {
      hi: 'आपसे मिलकर खुशी हुई। आइए प्रस्ताव पर चर्चा करें।',
      pa: 'ਤੁਹਾਨੂੰ ਮਿਲ ਕੇ ਖੁਸ਼ੀ ਹੋਈ। ਆਓ ਪ੍ਰਸਤਾਵ ਤੇ ਗੱਲਬਾਤ ਕਰੀਏ।',
      ta: 'உங்களைச் சந்தித்ததில் மகிழ்ச்சி. முன்மொழிவைப் பற்றி விவாதிப்போம்.',
      te: 'మిమ్మల్ని కలవడం చాలా సంతోషంగా ఉంది. ప్రతిపాదనపై చర్చిద్దాం.',
      bn: 'আপনার সাথে দেখা করে আনন্দিত হলাম। আসুন প্রস্তাবটি নিয়ে আলোচনা করি।',
      mr: 'आपल्याला भेटून आनंद झाला. प्रस्तावावर चर्चा करूया.',
      gu: 'તમને મળીને આનંદ થયો. ચાલો દરખાસ્ત પર ચર્ચા કરીએ.',
      ur: 'آپ سے مل کر خوشی ہوئی۔ آئیے تجویز پر بات کریں۔'
    }
  }
];

// Smart offline dictionary lookup function with keyword similarity matching
export function getOfflineTranslation(text, sourceLang, targetLang) {
  if (!text) return null;
  const clean = text.trim().toLowerCase();

  // 1. Direct or Substring match
  for (const phrase of PRESET_PHRASES) {
    const pEn = phrase.en.toLowerCase();
    const pTrans = phrase.translations[sourceLang] ? phrase.translations[sourceLang].toLowerCase() : '';

    const matchesEn = pEn.includes(clean) || clean.includes(pEn);
    const matchesSource = pTrans && (pTrans.includes(clean) || clean.includes(pTrans));

    if (matchesEn || matchesSource) {
      if (targetLang === 'en') return phrase.en;
      if (phrase.translations[targetLang]) return phrase.translations[targetLang];
    }
  }

  // 2. Keyword token similarity matching (for travel variations)
  const stopWords = new Set(['is', 'the', 'a', 'an', 'to', 'or', 'do', 'i', 'get', 'me', 'please', 'can', 'you', 'this', 'that', 'how', 'where', 'what']);
  const userTokens = clean
    .replace(/[^\w\s\u0900-\u0D7F]/gi, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));

  if (userTokens.length > 0) {
    let bestScore = 0;
    let bestPhrase = null;

    for (const phrase of PRESET_PHRASES) {
      const phraseTokens = phrase.en
        .toLowerCase()
        .replace(/[^\w\s\u0900-\u0D7F]/gi, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2 && !stopWords.has(w));

      let common = 0;
      for (const token of userTokens) {
        if (phraseTokens.some((pt) => pt.includes(token) || token.includes(pt))) {
          common++;
        }
      }

      const score = common / Math.max(userTokens.length, phraseTokens.length);
      if (score > bestScore) {
        bestScore = score;
        bestPhrase = phrase;
      }
    }

    if (bestScore >= 0.3 && bestPhrase) {
      if (targetLang === 'en') return bestPhrase.en;
      if (bestPhrase.translations[targetLang]) return bestPhrase.translations[targetLang];
    }
  }

  return null;
}
