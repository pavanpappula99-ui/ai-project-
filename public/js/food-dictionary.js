/**
 * Bharat Translator - Food, Mess Menu & Daily Indian Vocabulary Dictionary
 * Provides 100% accurate, culturally natural meanings in pure native scripts
 * for hostel/college mess menus, dishes, vegetables, meals, days, and ingredients.
 * Eliminates awkward transliterations (e.g. "brinjal curry" -> "వంకాయ కూర" instead of "బ్రింజల్ కర్రీ").
 */

export const FOOD_MENU_DICTIONARY = [
  // --- BRINJAL / EGGPLANT ---
  {
    keys: ['brinjal curry', 'eggplant curry', 'aubergine curry', 'vankaya curry', 'vankaya kura', 'vankaya kurra', 'baingan sabzi', 'baingan ki sabzi', 'baingan ki sabji', 'baingan curry'],
    translations: {
      en: 'Brinjal Curry',
      te: 'వంకాయ కూర',
      hi: 'बैंगन की सब्जी',
      ta: 'கத்தரிக்காய் குழம்பு',
      kn: 'ಬದನೆಕಾಯಿ ಪಲ್ಯ',
      ml: 'വഴുതനങ്ങ കറി',
      bn: 'বেগুন তরকারি',
      mr: 'वांग्याची भाजी',
      gu: 'રીંગણનું શાક',
      pa: 'ਬੈਂਗਣ ਦੀ ਸਬਜ਼ੀ',
      or: 'ବାଇଗଣ ତରକାରୀ',
      ur: 'بینگن کی سبزی'
    }
  },
  {
    keys: ['brinjal fry', 'eggplant fry', 'vankaya fry', 'vankaya vepudu', 'baingan fry', 'baingan bhaja'],
    translations: {
      en: 'Brinjal Fry',
      te: 'వంకాయ వేపుడు',
      hi: 'बैंगन फ्राई / भाजा',
      ta: 'கத்தரிக்காய் வறுவல்',
      kn: 'ಬದನೆಕಾಯಿ ಫ್ರೈ',
      ml: 'വഴുതനങ്ങ മെഴുക്കുപുരട്ടി',
      bn: 'বেগুন ভাজা',
      mr: 'वांग्याचे काप',
      gu: 'રીંગણ ફ્રાય',
      pa: 'ਬੈਂਗਣ ਫਰਾਈ',
      or: 'ବାଇଗଣ ଭଜା',
      ur: 'بینگن فرائی'
    }
  },
  {
    keys: ['brinjal chutney', 'vankaya pachadi', 'baingan bharta', 'baingan ka bharta'],
    translations: {
      en: 'Brinjal Chutney / Bharta',
      te: 'వంకాయ పచ్చడి',
      hi: 'बैंगन का भरता',
      ta: 'கத்தரிக்காய் துவையல்',
      kn: 'ಬದನೆಕಾಯಿ ಚಟ್ನಿ / ಗೊಜ್ಜು',
      ml: 'വഴുതനങ്ങ ചമ്മന്തി',
      bn: 'বেগুন ভর্তা',
      mr: 'वांग्याचे भरीत',
      gu: 'રીંગણનો ઓળો',
      pa: 'ਬੈਂਗਣ ਦਾ ਭਰਥਾ',
      or: 'ବାଇଗଣ ଭର୍ତ୍ତା'
    }
  },
  {
    keys: ['brinjal', 'eggplant', 'aubergine', 'vankaya', 'baingan'],
    translations: {
      en: 'Brinjal',
      te: 'వంకాయ',
      hi: 'बैंगन',
      ta: 'கத்தரிக்காய்',
      kn: 'ಬದನೆಕಾಯಿ',
      ml: 'വഴുതനങ്ങ',
      bn: 'বেগুন',
      mr: 'वांगी',
      gu: 'રીંગણ',
      pa: 'ਬੈਂਗਣ',
      or: 'ବାଇଗଣ',
      ur: 'بینگن'
    }
  },

  // --- LADIES FINGER / OKRA / BHENDI ---
  {
    keys: ['ladies finger curry', 'lady finger curry', 'okra curry', 'bhindi curry', 'bhendi curry', 'bendakaya curry', 'bendakaya kura', 'bhindi ki sabzi', 'bhendi ki sabzi'],
    translations: {
      en: 'Ladies Finger Curry (Bhindi)',
      te: 'బెండకాయ కూర',
      hi: 'भिंडी की सब्जी',
      ta: 'வெண்டைக்காய் குழம்பு',
      kn: 'ಬೆಂಡೆಕಾಯಿ ಪಲ್ಯ',
      ml: 'വെണ്ടയ്ക്ക കറി',
      bn: 'ঢ্যাঁড়শ তরকারি',
      mr: 'भेंडीची भाजी',
      gu: 'ભીંડાનું શાક',
      pa: 'ਭਿੰਡੀ ਦੀ ਸਬਜ਼ੀ',
      or: 'ଭେଣ୍ଡି ତରକାରୀ',
      ur: 'بھنڈی کی سبزی'
    }
  },
  {
    keys: ['ladies finger fry', 'lady finger fry', 'okra fry', 'bhindi fry', 'bhendi fry', 'bendakaya fry', 'bendakaya vepudu', 'kurkuri bhindi'],
    translations: {
      en: 'Ladies Finger Fry',
      te: 'బెండకాయ వేపుడు',
      hi: 'भिंडी फ्राई / कुरकुरी भिंडी',
      ta: 'வெண்டைக்காய் வறுவல்',
      kn: 'ಬೆಂಡೆಕಾಯಿ ಫ್ರೈ',
      ml: 'വെണ്ടയ്ക്ക മെഴുക്കുപുരട്ടി',
      bn: 'ঢ্যাঁড়শ ভাজা',
      mr: 'भेंडी फ्राय',
      gu: 'ભીંડા ફ્રાય',
      pa: 'ਭਿੰਡੀ ਫਰਾਈ',
      or: 'ଭେଣ୍ଡି ଭଜା',
      ur: 'بھنڈی فرائی'
    }
  },
  {
    keys: ['ladies finger', 'lady finger', 'okra', 'bhindi', 'bhendi', 'bendakaya'],
    translations: {
      en: 'Ladies Finger (Okra)',
      te: 'బెండకాయ',
      hi: 'भिंडी',
      ta: 'வெண்டைக்காய்',
      kn: 'ಬೆಂಡೆಕಾಯಿ',
      ml: 'വെണ്ടയ്ക്ക',
      bn: 'ঢ্যাঁড়শ',
      mr: 'भेंडी',
      gu: 'ભીંડા',
      pa: 'ਭਿੰਡੀ',
      or: 'ଭେଣ୍ଡି',
      ur: 'بھنڈی'
    }
  },

  // --- POTATO / ALOO / BANGALADUMPA ---
  {
    keys: ['potato fry', 'aloo fry', 'alu fry', 'bangaladumpa fry', 'bangaladumpa vepudu', 'aloo ki bhujia', 'aloo bhujia', 'batata fry'],
    translations: {
      en: 'Potato Fry',
      te: 'బంగాళాదుంప వేపుడు',
      hi: 'आलू की भुजिया / आलू फ्राई',
      ta: 'உருளைக்கிழங்கு வறுவல்',
      kn: 'ಆಲೂಗಡ್ಡೆ ಫ್ರೈ',
      ml: 'ഉരുളക്കിഴങ്ങ് മെഴുക്കുപുരട്ടി',
      bn: 'আলু ভাজা',
      mr: 'बटाटा फ्राय',
      gu: 'બટાકા ફ્રાય',
      pa: 'ਆਲੂ ਫਰਾਈ',
      or: 'ଆଳୁ ଭଜା',
      ur: 'آلو فرائی'
    }
  },
  {
    keys: ['potato curry', 'aloo curry', 'alu curry', 'bangaladumpa curry', 'bangaladumpa kura', 'aloo ki sabzi', 'aloo sabzi', 'aloo sabji', 'batata bhaji'],
    translations: {
      en: 'Potato Curry',
      te: 'బంగాళాదుంప కూర',
      hi: 'आलू की सब्जी',
      ta: 'உருளைக்கிழங்கு மசால் / குழம்பு',
      kn: 'ಆಲೂಗಡ್ಡೆ ಪಲ್ಯ',
      ml: 'ഉരുളക്കിഴങ്ങ് കറി',
      bn: 'আলুর দম / তরকারি',
      mr: 'बटाट्याची भाजी',
      gu: 'બટાકાનું શાક',
      pa: 'ਆਲੂ ਦੀ ਸਬਜ਼ੀ',
      or: 'ଆଳୁ ତରକାରୀ',
      ur: 'آلو کی سبزی'
    }
  },
  {
    keys: ['aloo gobi', 'alu gobi', 'potato cauliflower', 'potato cauliflower curry'],
    translations: {
      en: 'Aloo Gobi',
      te: 'ఆలూ గోబీ (బంగాళాదుంప క్యాలీఫ్లవర్ కూర)',
      hi: 'आलू गोभी की सब्जी',
      ta: 'உருளை காலிஃபிளவர் மசால்',
      kn: 'ಆಲೂ ಗೋಬಿ ಪಲ್ಯ',
      ml: 'ആലു ഗോബി',
      bn: 'আলু ফুলকপির তরকারি',
      mr: 'आलू गोबी',
      gu: 'આલૂ ગોબી',
      pa: 'ਆਲੂ ਗੋਭੀ',
      or: 'ଆଳୁ କୋବି'
    }
  },
  {
    keys: ['aloo matar', 'alu matar', 'potato peas', 'potato peas curry'],
    translations: {
      en: 'Aloo Matar',
      te: 'ఆలూ మటర్ (బంగాళాదుంప బఠానీ కూర)',
      hi: 'आलू मटर की सब्जी',
      ta: 'உருளை பட்டாணி மசால்',
      kn: 'ಆಲೂ ಮಟರ್ ಪಲ್ಯ',
      ml: 'ആലു മട്ടർ',
      bn: 'আলু মটর তরকারি',
      mr: 'आलू मटार',
      gu: 'આલૂ વટાણા',
      pa: 'ਆਲੂ ਮਟਰ'
    }
  },
  {
    keys: ['potato', 'potatoes', 'aloo', 'alu', 'bangaladumpa', 'batata'],
    translations: {
      en: 'Potato',
      te: 'బంగాళాదుంప',
      hi: 'आलू',
      ta: 'உருளைக்கிழங்கு',
      kn: 'ಆಲೂಗಡ್ಡೆ',
      ml: 'ഉരുളക്കിഴങ്ങ്',
      bn: 'আলু',
      mr: 'बटाटा',
      gu: 'બટાકા',
      pa: 'ਆਲੂ',
      or: 'ଆଳୁ',
      ur: 'آلو'
    }
  },

  // --- BOTTLE GOURD / SORAKAYA / LAUKI ---
  {
    keys: ['bottle gourd curry', 'sorakaya curry', 'sorakaya kura', 'anapakaya curry', 'lauki curry', 'lauki ki sabzi', 'doodhi sabzi'],
    translations: {
      en: 'Bottle Gourd Curry (Lauki)',
      te: 'సొరకాయ కూర / ఆనపకాయ కూర',
      hi: 'लौकी की सब्जी',
      ta: 'சுரைக்காய் கூட்டு',
      kn: 'ಸೋರೆಕಾಯಿ ಪಲ್ಯ',
      ml: 'ചുരയ്ക്ക കറി',
      bn: 'লাউ তরকারি',
      mr: 'दुधी भोपळ्याची भाजी',
      gu: 'દૂધીનું શાક',
      pa: 'ਲੌਕੀ ਦੀ ਸਬਜ਼ੀ',
      or: 'ଲାଉ ତରକାରୀ'
    }
  },
  {
    keys: ['bottle gourd sambar', 'sorakaya sambar', 'lauki sambar'],
    translations: {
      en: 'Bottle Gourd Sambar',
      te: 'సొరకాయ సాంబార్',
      hi: 'लौकी का सांबर',
      ta: 'சுரைக்காய் சாம்பார்',
      kn: 'ಸೋರೆಕಾಯಿ ಸಾಂಬಾರ್',
      ml: 'ചുരയ്ക്ക സാമ്പാർ'
    }
  },
  {
    keys: ['bottle gourd', 'sorakaya', 'anapakaya', 'lauki', 'ghiya', 'doodhi'],
    translations: {
      en: 'Bottle Gourd',
      te: 'సొరకాయ',
      hi: 'लौकी',
      ta: 'சுரைக்காய்',
      kn: 'ಸೋರೆಕಾಯಿ',
      ml: 'ചുരയ്ക്ക',
      bn: 'লাউ',
      mr: 'दुधी भोपळा',
      gu: 'દૂધી',
      pa: 'ਲੌਕੀ / ਘੀਆ',
      or: 'ଲାଉ'
    }
  },

  // --- BITTER GOURD / KAKARAKAYA / KARELA ---
  {
    keys: ['bitter gourd fry', 'kakarakaya fry', 'kakarakaya vepudu', 'karela fry', 'karela ki bhujia'],
    translations: {
      en: 'Bitter Gourd Fry',
      te: 'కాకరకాయ వేపుడు',
      hi: 'करेला फ्राई / करेले की भुजिया',
      ta: 'பாகற்காய் வறுவல்',
      kn: 'ಹಾಗಲಕಾಯಿ ಫ್ರೈ',
      ml: 'പാവയ്ക്ക മെഴുക്കുപുരട്ടി',
      bn: 'করলা ভাজা',
      mr: 'कारल्याचे काप',
      gu: 'કારેલા ફ્રાય',
      pa: 'ਕਰੇਲਾ ਫਰਾਈ',
      or: 'କଲରା ଭଜା'
    }
  },
  {
    keys: ['bitter gourd curry', 'kakarakaya curry', 'kakarakaya pulusu', 'karela curry', 'karela ki sabzi'],
    translations: {
      en: 'Bitter Gourd Curry',
      te: 'కాకరకాయ పులుసు / కూర',
      hi: 'करेले की सब्जी',
      ta: 'பாகற்காய் குழம்பு',
      kn: 'ಹಾಗಲಕಾಯಿ ಗೊಜ್ಜು',
      ml: 'പാവയ്ക്ക തീയൽ',
      bn: 'করলা তরকারি',
      mr: 'कारल्याची भाजी',
      gu: 'કારેલાનું શાક',
      pa: 'ਕਰੇਲੇ ਦੀ ਸਬਜ਼ੀ',
      or: 'କଲରା ତରକାରୀ'
    }
  },
  {
    keys: ['bitter gourd', 'kakarakaya', 'karela'],
    translations: {
      en: 'Bitter Gourd',
      te: 'కాకరకాయ',
      hi: 'करेला',
      ta: 'பாகற்காய்',
      kn: 'ಹಾಗಲಕಾಯಿ',
      ml: 'പാവയ്ക്ക',
      bn: 'করলা',
      mr: 'कारले',
      gu: 'કારેલા',
      pa: 'ਕਰੇਲਾ',
      or: 'କଲରା'
    }
  },

  // --- RIDGE GOURD / BEERAKAYA / TURAI ---
  {
    keys: ['ridge gourd curry', 'beerakaya curry', 'beerakaya kura', 'turai curry', 'turai ki sabzi', 'tori curry'],
    translations: {
      en: 'Ridge Gourd Curry',
      te: 'బీరకాయ కూర',
      hi: 'तोरई की सब्जी',
      ta: 'பீர்க்கங்காய் குழம்பு',
      kn: 'ಹೀರೆಕಾಯಿ ಪಲ್ಯ',
      ml: 'പീച്ചിങ്ങ കറി',
      bn: 'ঝিঙে তরকারি',
      mr: 'दोडक्याची भाजी',
      gu: 'તુરીયાનું શાક',
      pa: 'ਤੋਰੀ ਦੀ ਸਬਜ਼ੀ',
      or: 'ଜାହ୍ନି ତରକାରୀ'
    }
  },
  {
    keys: ['ridge gourd', 'beerakaya', 'turai', 'tori'],
    translations: {
      en: 'Ridge Gourd',
      te: 'బీరకాయ',
      hi: 'तोरई',
      ta: 'பீர்க்கங்காய்',
      kn: 'ಹೀರೆಕಾಯಿ',
      ml: 'പീച്ചിങ്ങ',
      bn: 'ঝিঙে',
      mr: 'दोडका',
      gu: 'તુરીયું',
      pa: 'ਤੋਰੀ',
      or: 'ଜାହ୍ନି'
    }
  },

  // --- IVY GOURD / DONDAKAYA / TINDORA ---
  {
    keys: ['ivy gourd fry', 'dondakaya fry', 'dondakaya vepudu', 'tindora fry', 'kundru fry'],
    translations: {
      en: 'Ivy Gourd Fry (Tindora)',
      te: 'దొండకాయ వేపుడు',
      hi: 'कुंदरू फ्राई / टिंडोरा फ्राई',
      ta: 'கோவக்காய் வறுவல்',
      kn: 'ತೊಂಡೆಕಾಯಿ ಫ್ರೈ',
      ml: 'കോവയ്ക്ക മെഴുക്കുപുരട്ടി'
    }
  },
  {
    keys: ['ivy gourd curry', 'dondakaya curry', 'dondakaya kura', 'tindora curry', 'kundru ki sabzi'],
    translations: {
      en: 'Ivy Gourd Curry',
      te: 'దొండకాయ కూర',
      hi: 'कुंदरू की सब्जी / टिंडोरा',
      ta: 'கோவக்காய் கூட்டு',
      kn: 'ತೊಂಡೆಕಾಯಿ ಪಲ್ಯ'
    }
  },
  {
    keys: ['ivy gourd', 'dondakaya', 'tindora', 'kundru', 'tendli'],
    translations: {
      en: 'Ivy Gourd',
      te: 'దొండకాయ',
      hi: 'कुंदरू / टिंडोरा',
      ta: 'கோவக்காய்',
      kn: 'ತೊಂಡೆಕಾಯಿ',
      ml: 'കോവയ്ക്ക'
    }
  },

  // --- SNAKE GOURD / POTLAKAYA ---
  {
    keys: ['snake gourd curry', 'potlakaya curry', 'potlakaya kura', 'chichinda curry'],
    translations: {
      en: 'Snake Gourd Curry',
      te: 'పొట్లకాయ కూర',
      hi: 'चिचिंडा की सब्जी',
      ta: 'புடலங்காய் கூட்டு',
      kn: 'ಪಡವಲಕಾಯಿ ಪಲ್ಯ'
    }
  },
  {
    keys: ['snake gourd', 'potlakaya', 'chichinda'],
    translations: {
      en: 'Snake Gourd',
      te: 'పొట్లకాయ',
      hi: 'चिचिंडा',
      ta: 'புடலங்காய்',
      kn: 'ಪಡವಲಕಾಯಿ'
    }
  },

  // --- CABBAGE & CAULIFLOWER ---
  {
    keys: ['cabbage curry', 'cabbage fry', 'cabbage vepudu', 'patta gobhi ki sabzi', 'patta gobhi'],
    translations: {
      en: 'Cabbage Curry / Fry',
      te: 'క్యాబేజీ కూర / వేపుడు',
      hi: 'पत्ता गोभी की सब्जी',
      ta: 'முட்டைகோஸ் பொரியல்',
      kn: 'ಎಲೆಕೋಸು ಪಲ್ಯ',
      ml: 'മുട്ടക്കോസ് തോരൻ',
      bn: 'বাঁধাকপি তরকারি',
      mr: 'कोबीची भाजी',
      gu: 'કોબીજનું શાક',
      pa: 'ਬੰਦਗੋਭੀ ਦੀ ਸਬਜ਼ੀ'
    }
  },
  {
    keys: ['cauliflower curry', 'cauliflower fry', 'gobi curry', 'gobi fry', 'phool gobhi ki sabzi', 'phool gobhi'],
    translations: {
      en: 'Cauliflower Curry / Fry',
      te: 'క్యాలీఫ్లవర్ కూర / గోబీ వేపుడు',
      hi: 'फूलगोभी की सब्जी',
      ta: 'காலிஃபிளவர் வறுவல்',
      kn: 'ಹೂಕೋಸು ಪಲ್ಯ',
      ml: 'കോളിഫ്ലവർ തോരൻ',
      bn: 'ফুলকপি তরকারি',
      mr: 'फ्लॉवरची भाजी',
      gu: 'ફુલાવરનું શાક',
      pa: 'ਫੁੱਲਗੋਭੀ ਦੀ ਸਬਜ਼ੀ'
    }
  },

  // --- BEANS, BEETROOT, CARROT ---
  {
    keys: ['beans fry', 'beans curry', 'beans vepudu', 'french beans', 'french beans curry'],
    translations: {
      en: 'Beans Fry / Curry',
      te: 'బీన్స్ వేపుడు / కూర',
      hi: 'बीन्स की सब्जी / फली',
      ta: 'பீன்ஸ் பொரியல்',
      kn: 'ಹುರುಳಿಕಾಯಿ ಪಲ್ಯ',
      ml: 'ബീൻസ് തോരൻ'
    }
  },
  {
    keys: ['beetroot fry', 'beetroot curry', 'beetroot vepudu', 'chukandar ki sabzi'],
    translations: {
      en: 'Beetroot Fry',
      te: 'బీట్‌రూట్ వేపుడు',
      hi: 'चुकंदर की सब्जी / फ्राई',
      ta: 'பீட்ரூட் பொரியல்',
      kn: 'ಬೀಟ್ರೂಟ್ ಪಲ್ಯ',
      ml: 'ബീറ്റ്റൂട്ട് തോരൻ'
    }
  },
  {
    keys: ['carrot fry', 'carrot curry', 'carrot vepudu', 'gajar ki sabzi'],
    translations: {
      en: 'Carrot Fry / Curry',
      te: 'క్యారెట్ వేపుడు / కూర',
      hi: 'गाजर की सब्जी',
      ta: 'கேரட் பொரியல்',
      kn: 'ಕ್ಯಾರೆಟ್ ಪಲ್ಯ',
      ml: 'കാരറ്റ് തോരൻ'
    }
  },

  // --- TOMATO, SPINACH, DRUMSTICK ---
  {
    keys: ['tomato curry', 'tomato kura', 'tamata curry', 'tamata kura', 'tamatar ki sabzi'],
    translations: {
      en: 'Tomato Curry',
      te: 'టమోటా కూర',
      hi: 'टमाटर की सब्जी',
      ta: 'தக்காளி தொக்கு / குழம்பு',
      kn: 'ಟೊಮೆಟೊ ಗೊಜ್ಜು'
    }
  },
  {
    keys: ['tomato rasam', 'tomato charu', 'tamata rasam', 'tamatar rasam'],
    translations: {
      en: 'Tomato Rasam',
      te: 'టమోటా రసం / చారు',
      hi: 'टमाटर रसम',
      ta: 'தக்காளி ரசம்',
      kn: 'ಟೊಮೆಟೊ ಸಾರು'
    }
  },
  {
    keys: ['palak dal', 'spinach dal', 'palakura pappu', 'palak pappu', 'dal palak'],
    translations: {
      en: 'Palak Dal (Spinach Dal)',
      te: 'పాలకూర పప్పు',
      hi: 'पालक दाल',
      ta: 'பசலைக்கீரை பருப்பு',
      kn: 'ಪಾಲಕ್ ತೊವ್ವೆ / ಸಾರು',
      ml: 'ചീര പരിപ്പ് കറി'
    }
  },
  {
    keys: ['gongura pappu', 'gongura dal'],
    translations: {
      en: 'Gongura Dal',
      te: 'గోంగూర పప్పు',
      hi: 'गोंगुरा दाल',
      ta: 'புளிச்சக்கீரை பருப்பு',
      kn: 'ಪುಂಡಿ ಪಲ್ಯ ಬೇಳೆ'
    }
  },
  {
    keys: ['tomato pappu', 'tomato dal', 'tamata pappu'],
    translations: {
      en: 'Tomato Pappu (Tomato Dal)',
      te: 'టమోటా పప్పు',
      hi: 'टमाटर दाल',
      ta: 'தக்காளி பருப்பு',
      kn: 'ಟೊಮೆಟೊ ತೊವ್ವೆ'
    }
  },
  {
    keys: ['drumstick sambar', 'munakkaya sambar', 'sahjan sambar', 'murungakkai sambar'],
    translations: {
      en: 'Drumstick Sambar',
      te: 'మునక్కాయ సాంబార్',
      hi: 'सहजन सांबर',
      ta: 'முருங்கைக்காய் சாம்பார்',
      kn: 'ನುಗ್ಗೆಕಾಯಿ ಸಾಂಬಾರ್',
      ml: 'മുരിങ്ങയ്ക്ക സാമ്പാർ'
    }
  },
  {
    keys: ['drumstick curry', 'munakkaya curry', 'munakkaya kura', 'sahjan ki sabzi'],
    translations: {
      en: 'Drumstick Curry',
      te: 'మునక్కాయ కూర',
      hi: 'सहजन की सब्जी',
      ta: 'முருங்கைக்காய் குழம்பு',
      kn: 'ನುಗ್ಗೆಕಾಯಿ ಪಲ್ಯ'
    }
  },

  // --- DALS & SOUPS ---
  {
    keys: ['dal tadka', 'dal fry', 'tadka dal', 'yellow dal', 'talimpu pappu'],
    translations: {
      en: 'Dal Tadka (Tempered Lentils)',
      te: 'దాల్ తడ్కా (తాలింపు పప్పు)',
      hi: 'दाल तड़का / दाल फ्राई',
      ta: 'பருப்பு தாளிப்பு',
      kn: 'ದಾಲ್ ತಡ್ಕಾ / ತೊವ್ವೆ',
      ml: 'പരിപ്പ് കറി',
      bn: 'ডাল তরকা',
      mr: 'दाल तडका',
      gu: 'દાળ તડકા',
      pa: 'ਦਾਲ ਤੜਕਾ'
    }
  },
  {
    keys: ['dal', 'pappu', 'paruppu', 'dhal'],
    translations: {
      en: 'Dal (Lentils)',
      te: 'పప్పు',
      hi: 'दाल',
      ta: 'பருப்பு',
      kn: 'ಬೇಳೆ ಸಾರು / ತೊವ್ವೆ',
      ml: 'പരിപ്പ്',
      bn: 'ডাল',
      mr: 'वरण / डाळ',
      gu: 'દાળ',
      pa: 'ਦਾਲ'
    }
  },
  {
    keys: ['sambar', 'sambhar'],
    translations: {
      en: 'Sambar',
      te: 'సాంబార్',
      hi: 'सांबर',
      ta: 'சாம்பார்',
      kn: 'ಸಾಂಬಾರ್',
      ml: 'സാമ്പാർ'
    }
  },
  {
    keys: ['rasam', 'charu', 'chaaru'],
    translations: {
      en: 'Rasam',
      te: 'రసం / చారు',
      hi: 'रसम',
      ta: 'ரசம்',
      kn: 'ಸಾರು',
      ml: 'രസം'
    }
  },
  {
    keys: ['pappu charu', 'pappuchaaru'],
    translations: {
      en: 'Pappu Charu (Lentil Soup)',
      te: 'పప్పు చారు',
      hi: 'दाल रसम / सांबर',
      ta: 'பருப்பு ரசம்'
    }
  },
  {
    keys: ['chole', 'chole masala', 'chana masala'],
    translations: {
      en: 'Chole Masala (Chickpeas)',
      te: 'ఛోలే మసాలా',
      hi: 'छोले मसाला / चना मसाला',
      ta: 'சென்னா மசாலா',
      kn: 'ಕಡಲೆ ಮಸಾಲೆ',
      pa: 'ਛੋਲੇ ਮਸਾਲਾ'
    }
  },
  {
    keys: ['rajma', 'rajma curry', 'rajma masala'],
    translations: {
      en: 'Rajma Masala (Kidney Beans)',
      te: 'రాజ్మా మసాలా',
      hi: 'राजमा मसाला',
      ta: 'ராஜ்மா மசாலா',
      pa: 'ਰਾਜਮਾਂਹ'
    }
  },

  // --- RICE, GRAINS & DAIRY ---
  {
    keys: ['curd rice', 'perugu annam', 'daddojanam', 'thayir sadam', 'mosaranna', 'dahi chawal', 'dahi bhat'],
    translations: {
      en: 'Curd Rice',
      te: 'పెరుగు అన్నం (దద్దోజనం)',
      hi: 'दही चावल',
      ta: 'தயிர் சாதம்',
      kn: 'ಮೊಸರನ್ನ',
      ml: 'തൈര് ചോറ്',
      bn: 'দই ভাত',
      mr: 'दही भात',
      gu: 'દહીં ભાત',
      pa: 'ਦਹੀਂ ਚਾਵਲ'
    }
  },
  {
    keys: ['lemon rice', 'pulihora', 'chitranna', 'elamichai sadam'],
    translations: {
      en: 'Lemon Rice (Pulihora)',
      te: 'పులిహోర / నిమ్మకాయ అన్నం',
      hi: 'नींबू चावल (लेमन राइस)',
      ta: 'எலுமிச்சை சாதம்',
      kn: 'ಚಿತ್ರನ್ನ',
      ml: 'നാരങ്ങ ചോറ്'
    }
  },
  {
    keys: ['jeera rice', 'zeera rice'],
    translations: {
      en: 'Jeera Rice (Cumin Rice)',
      te: 'జీరా రైస్',
      hi: 'जीरा चावल',
      ta: 'சீரக சாதம்',
      kn: 'ಜೀರಾ ರೈಸ್'
    }
  },
  {
    keys: ['steamed rice', 'white rice', 'boiled rice', 'plain rice', 'rice', 'annam', 'chawal', 'bhat', 'sadam'],
    translations: {
      en: 'Steamed Rice',
      te: 'అన్నం',
      hi: 'चावल / भात',
      ta: 'சாதம்',
      kn: 'ಅನ್ನ',
      ml: 'ചോറ്',
      bn: 'ভাত',
      mr: 'भात',
      gu: 'ભાત',
      pa: 'ਚੌਲ',
      or: 'ଭାତ'
    }
  },
  {
    keys: ['veg biryani', 'vegetable biryani', 'biryani'],
    translations: {
      en: 'Veg Biryani',
      te: 'వెజ్ బిర్యానీ',
      hi: 'वेज बिरयानी',
      ta: 'வெஜ் பிரியாணி',
      kn: 'ವೆಜ್ ಬಿರಿಯಾನಿ',
      ml: 'വെജ് ബിരിയാണി'
    }
  },
  {
    keys: ['veg pulao', 'vegetable pulao', 'pulao'],
    translations: {
      en: 'Veg Pulao',
      te: 'వెజ్ పులావ్',
      hi: 'वेज पुलाव',
      ta: 'வெஜ் புலாவ்',
      kn: 'ವೆಜ್ ಪುಲಾವ್'
    }
  },
  {
    keys: ['fried rice', 'veg fried rice'],
    translations: {
      en: 'Fried Rice',
      te: 'ఫ్రైడ్ రైస్',
      hi: 'फ्राइड राइस',
      ta: 'ஃப்ரைட் ரைஸ்',
      kn: 'ಫ್ರೈಡ್ ರೈಸ್'
    }
  },
  {
    keys: ['curd', 'yogurt', 'yoghurt', 'dahi', 'perugu', 'thayir', 'mosaru'],
    translations: {
      en: 'Curd (Yogurt)',
      te: 'పెరుగు',
      hi: 'दही',
      ta: 'தயிர்',
      kn: 'ಮೊಸರು',
      ml: 'തൈര്',
      bn: 'দই',
      mr: 'दही',
      gu: 'દહીં',
      pa: 'ਦਹੀਂ',
      or: 'ଦହି'
    }
  },
  {
    keys: ['buttermilk', 'butter milk', 'majjiga', 'chaas', 'chhas', 'mattha', 'mor', 'majjige'],
    translations: {
      en: 'Buttermilk',
      te: 'మజ్జిగ',
      hi: 'छाछ / मट्ठा',
      ta: 'மோர்',
      kn: 'ಮಜ್ಜಿಗೆ',
      ml: 'മോര്',
      bn: 'ঘোল',
      mr: 'ताक',
      gu: 'છાશ',
      pa: 'ਲੱਸੀ / ਛਾਛ',
      or: 'ଘୋଳଦହି'
    }
  },
  {
    keys: ['milk', 'palu', 'doodh', 'paal', 'haalu'],
    translations: {
      en: 'Milk',
      te: 'పాలు',
      hi: 'दूध',
      ta: 'பால்',
      kn: 'ಹಾಲು',
      ml: 'പാൽ',
      bn: 'দুধ',
      mr: 'दूध',
      gu: 'દૂધ',
      pa: 'ਦੁੱਧ'
    }
  },
  {
    keys: ['tea', 'chai', 'teaneeru'],
    translations: {
      en: 'Tea',
      te: 'టీ (తేనీరు)',
      hi: 'चाय',
      ta: 'தேநீர் (டீ)',
      kn: 'ಚಹಾ',
      ml: 'ചായ',
      bn: 'চা',
      mr: 'चहा',
      gu: 'ચા',
      pa: 'ਚਾਹ'
    }
  },
  {
    keys: ['coffee', 'filter coffee'],
    translations: {
      en: 'Filter Coffee',
      te: 'కాఫీ',
      hi: 'कॉफी / फिल्टर कॉफी',
      ta: 'காபி',
      kn: 'ಕಾಫಿ',
      ml: 'കാപ്പി'
    }
  },
  {
    keys: ['drinking water', 'water', 'neellu', 'paani', 'thanneer', 'neeru'],
    translations: {
      en: 'Drinking Water',
      te: 'మంచినీళ్లు',
      hi: 'पीने का पानी',
      ta: 'குடிநீர்',
      kn: 'ಕುಡಿಯುವ ನೀರು',
      ml: 'കുടിവെള്ളം',
      bn: 'জল',
      mr: 'पिण्याचे पाणी',
      gu: 'પીવાનું પાણી',
      pa: 'ਪਾਣੀ'
    }
  },

  // --- BREADS & TIFFINS ---
  {
    keys: ['chapati', 'chapathi', 'roti', 'phulka', 'fulka'],
    translations: {
      en: 'Chapati / Roti',
      te: 'చపాతీ / రోటీ',
      hi: 'चपाती / रोटी / फुल्का',
      ta: 'சப்பாத்தி',
      kn: 'ಚಪಾತಿ / ರೊಟ್ಟಿ',
      ml: 'ചപ്പാത്തി',
      bn: 'রুটি',
      mr: 'चपाती / पोळी',
      gu: 'રોટલી',
      pa: 'ਰੋਟੀ / ਫੁਲਕਾ'
    }
  },
  {
    keys: ['poori', 'puri', 'poori bhaji', 'puri bhaji'],
    translations: {
      en: 'Poori Bhaji',
      te: 'పూరీ బాజీ',
      hi: 'पूरी भाजी',
      ta: 'பூரி மசால்',
      kn: 'ಪೂರಿ ಸಾಗು',
      ml: 'പൂരി മസാല',
      bn: 'লুচি তরকারি'
    }
  },
  {
    keys: ['paratha', 'parotta', 'aloo paratha'],
    translations: {
      en: 'Paratha / Aloo Paratha',
      te: 'పరోటా / ఆలూ పరోటా',
      hi: 'पराठा / आलू पराठा',
      ta: 'பரோட்டா',
      kn: 'ಪರೋಟ',
      pa: 'ਪਰੌਂਠਾ'
    }
  },
  {
    keys: ['idli', 'idly', 'sambar idli'],
    translations: {
      en: 'Idli',
      te: 'ఇడ్లీ',
      hi: 'इडली',
      ta: 'இட்லி',
      kn: 'ಇಡ್ಲಿ',
      ml: 'ഇഡ്ഡലി'
    }
  },
  {
    keys: ['dosa', 'masala dosa', 'plain dosa'],
    translations: {
      en: 'Dosa / Masala Dosa',
      te: 'దోశ / మసాలా దోశ',
      hi: 'डोसा / मसाला डोसा',
      ta: 'தோசை / மசாலா தோசை',
      kn: 'ದೋಸೆ / ಮಸಾಲೆ ದೋಸೆ',
      ml: 'ദോശ'
    }
  },
  {
    keys: ['vada', 'medu vada', 'vadai', 'sambar vada'],
    translations: {
      en: 'Medu Vada',
      te: 'వడ / మెదు వడ',
      hi: 'वड़ा / मेदु वड़ा',
      ta: 'வடை / மெதுவடை',
      kn: 'ವಡೆ / ಮೆದು ವಡೆ',
      ml: 'ഉഴുന്നുവട'
    }
  },
  {
    keys: ['upma', 'uppittu', 'rava upma'],
    translations: {
      en: 'Upma',
      te: 'ఉప్మా',
      hi: 'उपमा',
      ta: 'உப்மா',
      kn: 'ಉಪ್ಪಿಟ್ಟು / ಉಪ್ಮಾ',
      ml: 'ഉപ്പുമാവ്'
    }
  },
  {
    keys: ['poha', 'atukulu', 'avalakki', 'aval'],
    translations: {
      en: 'Poha',
      te: 'అటుకులు (పోహా)',
      hi: 'पोहा',
      ta: 'அவல்',
      kn: 'ಅವಲಕ್ಕಿ',
      ml: 'അവൽ',
      mr: 'पोहे',
      gu: 'પૌંઆ'
    }
  },
  {
    keys: ['pongal', 'ven pongal'],
    translations: {
      en: 'Pongal (Ven Pongal)',
      te: 'పొంగల్ / కట్టె పొంగలి',
      hi: 'पोंगल (दाल चावल खिचड़ी)',
      ta: 'வெண் பொங்கல்',
      kn: 'ಪೊಂಗಲ್'
    }
  },
  {
    keys: ['pesarattu', 'pesara dosa'],
    translations: {
      en: 'Pesarattu (Moong Dal Dosa)',
      te: 'పెసరట్టు',
      hi: 'पेसरट्टू (मूंग दाल डोसा)',
      ta: 'பெசரட்டு'
    }
  },

  // --- PANEER & NON-VEG ---
  {
    keys: ['paneer butter masala', 'paneer makhani'],
    translations: {
      en: 'Paneer Butter Masala',
      te: 'పనీర్ బటర్ మసాలా',
      hi: 'पनीर बटर मसाला',
      ta: 'பன்னீர் பட்டர் மசாலா',
      kn: 'ಪನೀರ್ ಬಟರ್ ಮಸಾಲಾ'
    }
  },
  {
    keys: ['palak paneer'],
    translations: {
      en: 'Palak Paneer',
      te: 'పాలక్ పనీర్',
      hi: 'पालक पनीर',
      ta: 'பாலக் பன்னீர்',
      kn: 'ಪಾಲಕ್ ಪನೀರ್'
    }
  },
  {
    keys: ['matar paneer', 'muttar paneer'],
    translations: {
      en: 'Matar Paneer',
      te: 'మటర్ పనీర్',
      hi: 'मटर पनीर',
      ta: 'பட்டாணி பன்னீர்',
      kn: 'ಮಟರ್ ಪನೀರ್'
    }
  },
  {
    keys: ['paneer curry', 'paneer sabzi'],
    translations: {
      en: 'Paneer Curry',
      te: 'పనీర్ కూర',
      hi: 'पनीर की सब्जी',
      ta: 'பன்னீர் கிரேவி',
      kn: 'ಪನೀರ್ ಪಲ್ಯ'
    }
  },
  {
    keys: ['egg curry', 'anda curry', 'guddu kura', 'muttai kulambu'],
    translations: {
      en: 'Egg Curry',
      te: 'గుడ్డు కూర (ఎగ్ కర్రీ)',
      hi: 'अंडा करी / अंडे की सब्जी',
      ta: 'முட்டை குழம்பு',
      kn: 'ಮೊಟ್ಟೆ ಸಾಂಬಾರ್',
      ml: 'മുട്ട കറി',
      bn: 'ডিমের ঝোল',
      mr: 'अंडा करी',
      gu: 'ઈંડા કરી',
      pa: 'ਆਂਡਾ ਕਰੀ'
    }
  },
  {
    keys: ['boiled egg', 'boiled eggs', 'udikinchina guddu', 'ubla anda'],
    translations: {
      en: 'Boiled Egg',
      te: 'ఉడికించిన గుడ్డు',
      hi: 'उबला अंडा',
      ta: 'அவித்த முட்டை',
      kn: 'ಬೇಯಿಸಿದ ಮೊಟ್ಟೆ',
      ml: 'പുഴുങ്ങിയ മുട്ട'
    }
  },
  {
    keys: ['egg omelette', 'omelet', 'omelette', 'omlet'],
    translations: {
      en: 'Omelette',
      te: 'ఆమ్లెట్',
      hi: 'ऑमलेट',
      ta: 'ஆம்லெட்',
      kn: 'ಆಮ್ಲೆಟ್'
    }
  },
  {
    keys: ['chicken curry', 'kodi kura', 'murgh curry', 'chicken gravy'],
    translations: {
      en: 'Chicken Curry',
      te: 'కోడి కూర (చికెన్ కర్రీ)',
      hi: 'चिकन करी / मुर्ग की सब्जी',
      ta: 'சிக்கன் குழம்பு',
      kn: 'ಕೋಳಿ ಸಾರು (ಚಿಕನ್ ಕರಿ)',
      ml: 'ചിക്കൻ കറി',
      bn: 'চিকেন কারি',
      mr: 'चिकन रस्सा',
      gu: 'ચિકન કરી',
      pa: 'ਚਿਕਨ ਕਰੀ'
    }
  },
  {
    keys: ['chicken fry', 'kodi vepudu'],
    translations: {
      en: 'Chicken Fry',
      te: 'చికెన్ వేపుడు',
      hi: 'चिकन फ्राई',
      ta: 'சிக்கன் வறுவல்',
      kn: 'ಚಿಕನ್ ಫ್ರೈ',
      ml: 'ചിക്കൻ ഫ്രൈ'
    }
  },
  {
    keys: ['fish curry', 'chepala pulusu', 'machli curry'],
    translations: {
      en: 'Fish Curry',
      te: 'చేపల పులుసు / కూర',
      hi: 'मछली की करी',
      ta: 'மீன் குழம்பு',
      kn: 'ಮೀನು ಸಾರು',
      ml: 'മീൻ കറി',
      bn: 'মাছের ঝোল',
      mr: 'माशाचे कालवण'
    }
  },
  {
    keys: ['mutton curry', 'mamsam kura', 'gosht'],
    translations: {
      en: 'Mutton Curry',
      te: 'మటన్ కూర (మాంసం కూర)',
      hi: 'मटन करी / गोश्त',
      ta: 'மட்டன் குழம்பு',
      kn: 'ಮಟನ್ ಸಾಂಬಾರ್'
    }
  },

  // --- CONDIMENTS, SWEETS & SNACKS ---
  {
    keys: ['payasam', 'kheer', 'semiya payasam', 'semiya kheer'],
    translations: {
      en: 'Payasam / Kheer',
      te: 'పాయసం / సేమియా పాయసం',
      hi: 'खीर / सेवई खीर',
      ta: 'பாயாசம்',
      kn: 'ಪಾಯಸ',
      ml: 'പായസം',
      bn: 'পায়েস',
      mr: 'खीर',
      gu: 'ખીર',
      pa: 'ਖੀਰ'
    }
  },
  {
    keys: ['gulab jamun'],
    translations: {
      en: 'Gulab Jamun',
      te: 'గులాబ్ జామున్',
      hi: 'गुलाब जामुन',
      ta: 'குலாப் ஜாமூன்',
      kn: 'ಗುಲಾಬ್ ಜಾಮೂನ್'
    }
  },
  {
    keys: ['gajar halwa', 'carrot halwa'],
    translations: {
      en: 'Carrot Halwa (Gajar Halwa)',
      te: 'క్యారెట్ హల్వా',
      hi: 'गाजर का हलवा',
      ta: 'கேரட் அல்வா',
      kn: 'ಕ್ಯಾರೆಟ್ ಹಲ್ವಾ'
    }
  },
  {
    keys: ['pickle', 'pachadi', 'achar', 'ooragaya', 'avakaya'],
    translations: {
      en: 'Pickle',
      te: 'ఊరగాయ / పచ్చడి',
      hi: 'अचार',
      ta: 'ஊறுகாய்',
      kn: 'ಉಪ್ಪಿನಕಾಯಿ',
      ml: 'അച്ചാർ',
      bn: 'আচার',
      mr: 'लोणचे',
      gu: 'અથાણું',
      pa: 'ਅਚਾਰ'
    }
  },
  {
    keys: ['papad', 'papadum', 'appalam'],
    translations: {
      en: 'Papad',
      te: 'అప్పడం / పాపడ్',
      hi: 'पापड़',
      ta: 'அப்பளம்',
      kn: 'ಹಪ್ಪಳ',
      ml: 'പപ്പടം',
      bn: 'পাপড়'
    }
  },
  {
    keys: ['coconut chutney', 'chutney'],
    translations: {
      en: 'Coconut Chutney',
      te: 'కొబ్బరి పచ్చడి / చట్నీ',
      hi: 'नारियल की चटनी',
      ta: 'தேங்காய் சட்னி',
      kn: 'ತೆಂಗಿನಕಾಯಿ ಚಟ್ನಿ',
      ml: 'തേങ്ങ ചമ്മന്തി'
    }
  },
  {
    keys: ['samosa'],
    translations: {
      en: 'Samosa',
      te: 'సమోసా',
      hi: 'समोसा',
      ta: 'சமோசா',
      kn: 'ಸಮೋಸ'
    }
  },

  // --- MESS MENU HEADERS, MEALS & DAYS ---
  {
    keys: ['hostel mess menu', 'mess menu', 'food menu', 'mess timetable', 'hostel menu'],
    translations: {
      en: 'Hostel Mess Menu',
      te: 'హాస్టల్ మెస్ మెనూ (భోజన పట్టిక)',
      hi: 'छात्रावास मेस मेनू (भोजन तालिका)',
      ta: 'விடுதி மெஸ் மெனு (உணவு பட்டியல்)',
      kn: 'ಹಾಸ್ಟೆಲ್ ಮೆಸ್ ಮೆನು (ಊಟದ ಪಟ್ಟಿ)',
      ml: 'ഹോസ്റ്റൽ മെസ്സ് മെനു',
      bn: 'মেস মেনু',
      mr: 'मेस मेनू (जेवणाची यादी)',
      gu: 'મેસ મેનુ',
      pa: 'ਮੈਸ ਮੈਨੂ'
    }
  },
  {
    keys: ['breakfast', 'morning tiffin', 'tiffin'],
    translations: {
      en: 'Breakfast',
      te: 'అల్పాహారం (టిఫిన్)',
      hi: 'नाश्ता',
      ta: 'காலை உணவு (டிபன்)',
      kn: 'ತಿಂಡಿ / ಉಪಹಾರ',
      ml: 'പ്രഭാതഭക്ഷണം',
      bn: 'সকালের জলখাবার',
      mr: 'सकाळचा नाश्ता',
      gu: 'સવારનો નાસ્તો',
      pa: 'ਸਵੇਰ ਦਾ ਨਾਸ਼ਤਾ'
    }
  },
  {
    keys: ['lunch', 'afternoon meal'],
    translations: {
      en: 'Lunch',
      te: 'మధ్యాహ్న భోజనం',
      hi: 'दोपहर का भोजन (लंच)',
      ta: 'மதிய உணவு',
      kn: 'ಮಧ್ಯಾಹ್ನದ ಊಟ',
      ml: 'ഉച്ചഭക്ഷണം',
      bn: 'দুপুরের খাবার',
      mr: 'दुपारचे जेवण',
      gu: 'બપોરનું ભોજન',
      pa: 'ਦੁਪਹਿਰ ਦਾ ਖਾਣਾ'
    }
  },
  {
    keys: ['snacks', 'evening snacks', 'evening tea'],
    translations: {
      en: 'Evening Snacks',
      te: 'సాయంత్రం స్నాక్స్ / అల్పాహారం',
      hi: 'शाम का नाश्ता (स्नैक्स)',
      ta: 'மாலை சிற்றுண்டி',
      kn: 'ಸಂಜೆ ಉಪಹಾರ',
      ml: 'വൈകുന്നേരത്തെ ചായ'
    }
  },
  {
    keys: ['dinner', 'night meal', 'supper'],
    translations: {
      en: 'Dinner',
      te: 'రాత్రి భోజనం (డిన్నర్)',
      hi: 'रात का खाना (डिनर)',
      ta: 'இரவு உணவு',
      kn: 'ರಾತ್ರಿಯ ಊಟ',
      ml: 'അത്താഴം',
      bn: 'রাতের খাবার',
      mr: 'रात्रीचे जेवण',
      gu: 'રાતનું ભોજન',
      pa: 'ਰਾਤ ਦਾ ਖਾਣਾ'
    }
  },
  {
    keys: ['special', 'special menu', 'sunday special'],
    translations: {
      en: 'Special',
      te: 'ప్రత్యేక వంటకం (స్పెషల్)',
      hi: 'विशेष / स्पेशल',
      ta: 'சிறப்பு உணவு',
      kn: 'ವಿಶೇಷ ಅಡುಗೆ'
    }
  },

  // --- DAYS OF THE WEEK ---
  {
    keys: ['monday'],
    translations: {
      en: 'Monday',
      te: 'సోమవారం',
      hi: 'सोमवार',
      ta: 'திங்கட்கிழமை',
      kn: 'ಸೋಮವಾರ',
      ml: 'തിങ്കളാഴ്ച',
      bn: 'সোমবার',
      mr: 'सोमवार',
      gu: 'સોમવાર',
      pa: 'ਸੋਮਵਾਰ'
    }
  },
  {
    keys: ['tuesday'],
    translations: {
      en: 'Tuesday',
      te: 'మంగళవారం',
      hi: 'मंगलवार',
      ta: 'செவ்வாய்க்கிழமை',
      kn: 'ಮಂಗಳವಾರ',
      ml: 'ചൊവ്വാഴ്ച',
      bn: 'মঙ্গলবার',
      mr: 'मंगळवार',
      gu: 'મંગળવાર',
      pa: 'ਮੰਗਲਵਾਰ'
    }
  },
  {
    keys: ['wednesday'],
    translations: {
      en: 'Wednesday',
      te: 'బుధవారం',
      hi: 'बुधवार',
      ta: 'புதன்கிழமை',
      kn: 'ಬುಧವಾರ',
      ml: 'ബുധനാഴ്ച',
      bn: 'বুধবার',
      mr: 'बुधवार',
      gu: 'બુધવાર',
      pa: 'ਬੁੱਧਵਾਰ'
    }
  },
  {
    keys: ['thursday'],
    translations: {
      en: 'Thursday',
      te: 'గురువారం',
      hi: 'गुरुवार',
      ta: 'வியாழக்கிழமை',
      kn: 'ಗುರುವಾರ',
      ml: 'വ്യാഴാഴ്ച',
      bn: 'বৃহস্পতিবার',
      mr: 'गुरुवार',
      gu: 'ગુરુવાર',
      pa: 'ਵੀਰਵਾਰ'
    }
  },
  {
    keys: ['friday'],
    translations: {
      en: 'Friday',
      te: 'శుక్రవారం',
      hi: 'शुक्रवार',
      ta: 'வெள்ளிக்கிழமை',
      kn: 'ಶುಕ್ರವಾರ',
      ml: 'വെള്ളിയാഴ്ച',
      bn: 'শুক্রবার',
      mr: 'शुक्रवार',
      gu: 'શુક્રવાર',
      pa: 'ਸ਼ੁੱਕਰਵਾਰ'
    }
  },
  {
    keys: ['saturday'],
    translations: {
      en: 'Saturday',
      te: 'శనివారం',
      hi: 'शनिवार',
      ta: 'சனிக்கிழமை',
      kn: 'ಶನಿವಾರ',
      ml: 'ശനിയാഴ്ച',
      bn: 'শনিবার',
      mr: 'शनिवार',
      gu: 'શનિવાર',
      pa: 'ਸ਼ਨੀਵਾਰ'
    }
  },
  {
    keys: ['sunday'],
    translations: {
      en: 'Sunday',
      te: 'ఆదివారం',
      hi: 'रविवार',
      ta: 'ஞாயிற்றுக்கிழமை',
      kn: 'ಭಾನುವಾರ',
      ml: 'ഞായറാഴ്ച',
      bn: 'রবিবার',
      mr: 'रविवार',
      gu: 'રવિવાર',
      pa: 'ਐਤਵਾਰ'
    }
  },

  // --- CONVERSATIONAL EXPRESSIONS & ROMANIZED GREETINGS ---
  {
    keys: ['aap kaise ho', 'aap kaise hain', 'tum kaise ho', 'kya haal hai', 'aap kaisa ho', 'kaise ho aap'],
    translations: {
      en: 'How are you?',
      te: 'మీరు ఎలా ఉన్నారు?',
      hi: 'आप कैसे हैं?',
      ta: 'எப்படி இருக்கிறீர்கள்?',
      kn: 'ಹೇಗಿದ್ದೀರಾ?',
      ml: 'സുഖമാണോ?',
      bn: 'আপনি কেমন আছেন?',
      mr: 'तुम्ही कसे आहात?',
      gu: 'તમે કેમ છો?',
      pa: 'ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?',
      or: 'ଆପଣ କେମିତି ଅଛନ୍ତି?',
      ur: 'آپ کیسے ہیں؟'
    }
  },
  {
    keys: ['ela unnaru', 'ela unnavu', 'bagunnara', 'bagunnava', 'meerela unnaru', 'ela unnav'],
    translations: {
      en: 'How are you?',
      te: 'మీరు ఎలా ఉన్నారు?',
      hi: 'आप कैसे हैं?',
      ta: 'எப்படி இருக்கிறீர்கள்?',
      kn: 'ಹೇಗಿದ್ದೀರಾ?',
      ml: 'സുഖമാണോ?',
      bn: 'আপনি কেমন আছেন?',
      mr: 'तुम्ही कसे आहात?',
      gu: 'તમે કેમ છો?',
      pa: 'ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?',
      or: 'ଆପଣ କେମିତି ଅଛନ୍ତି?',
      ur: 'آپ کیسے ہیں؟'
    }
  },
  {
    keys: ['eppadi irukkeenga', 'eppadi irukkinga', 'nalama', 'eppadi irukenga'],
    translations: {
      en: 'How are you?',
      te: 'మీరు ఎలా ఉన్నారు?',
      hi: 'आप कैसे हैं?',
      ta: 'எப்படி இருக்கிறீர்கள்?',
      kn: 'ಹೇಗಿದ್ದೀರಾ?',
      ml: 'സുഖമാണോ?',
      bn: 'আপনি কেমন আছেন?',
      mr: 'तुम्ही कसे आहात?',
      gu: 'તમે કેમ છો?',
      pa: 'ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?'
    }
  },
  {
    keys: ['sukhamano', 'sukhamanu', 'enthaanu vishesham'],
    translations: {
      en: 'Are you fine / How are you?',
      te: 'సుఖంగా ఉన్నారా? (ఎలా ఉన్నారు?)',
      hi: 'क्या आप ठीक हैं? (आप कैसे हैं?)',
      ta: 'நலமாக இருக்கிறீர்களா?',
      kn: 'ಆರಾಮಾಗಿದ್ದೀರಾ?',
      ml: 'സുഖമാണോ?',
      bn: 'আপনি ভালো আছেন?'
    }
  },
  {
    keys: ['hegiddira', 'hegiddiya', 'chennagiddira'],
    translations: {
      en: 'How are you?',
      te: 'మీరు ఎలా ఉన్నారు?',
      hi: 'आप कैसे हैं?',
      ta: 'எப்படி இருக்கிறீர்கள்?',
      kn: 'ಹೇಗಿದ್ದೀರಾ?',
      ml: 'സുഖമാണോ?',
      bn: 'আপনি কেমন আছেন?'
    }
  },
  {
    keys: ['apni kemon achhen', 'kemon acho', 'kemon achen', 'kemon achis'],
    translations: {
      en: 'How are you?',
      te: 'మీరు ఎలా ఉన్నారు?',
      hi: 'आप कैसे हैं?',
      ta: 'எப்படி இருக்கிறீர்கள்?',
      kn: 'ಹೇಗಿದ್ದೀರಾ?',
      ml: 'സുഖമാണോ?',
      bn: 'আপনি কেমন আছেন?',
      mr: 'तुम्ही कसे आहात?'
    }
  },
  {
    keys: ['tusi kiven ho', 'kidda', 'kiddan', 'tussi kiven ho'],
    translations: {
      en: 'How are you?',
      te: 'మీరు ఎలా ఉన్నారు?',
      hi: 'आप कैसे हैं?',
      ta: 'எப்படி இருக்கிறீர்கள்?',
      kn: 'ಹೇಗಿದ್ದೀರಾ?',
      ml: 'സുഖമാണോ?',
      pa: 'ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?'
    }
  },
  {
    keys: ['kasa ahes', 'kase ahat', 'kasa kay'],
    translations: {
      en: 'How are you?',
      te: 'మీరు ఎలా ఉన్నారు?',
      hi: 'आप कैसे हैं?',
      ta: 'எப்படி இருக்கிறீர்கள்?',
      kn: 'ಹೇಗಿದ್ದೀರಾ?',
      mr: 'तुम्ही कसे आहात?'
    }
  },
  {
    keys: ['kem cho', 'tame kem cho', 'kem cho tame'],
    translations: {
      en: 'How are you?',
      te: 'మీరు ఎలా ఉన్నారు?',
      hi: 'आप कैसे हैं?',
      ta: 'எப்படி இருக்கிறீர்கள்?',
      kn: 'ಹೇಗಿದ್ದೀರಾ?',
      gu: 'તમે કેમ છો?'
    }
  },
  {
    keys: ['mujhe paani chahiye', 'mujhe pani chahiye', 'paani chahiye', 'pani chahiye'],
    translations: {
      en: 'I need water',
      te: 'నాకు నీళ్లు కావాలి',
      hi: 'मुझे पानी चाहिए',
      ta: 'எனக்கு தண்ணீர் வேண்டும்',
      kn: 'ನನಗೆ ನೀರು ಬೇಕು',
      ml: 'എനിക്ക് വെള്ളം വേണം',
      bn: 'আমার জল লাগবে',
      mr: 'मला पाणी हवे आहे',
      gu: 'મને પાણી જોઈએ છે',
      pa: 'ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ',
      or: 'ମୋତେ ପାଣି ଦରକାର',
      ur: 'مجھے پانی چاہیے'
    }
  },
  {
    keys: ['naaku neellu kavali', 'naaku neeru kavali', 'neellu kavali', 'neeru kavali'],
    translations: {
      en: 'I need water',
      te: 'నాకు నీళ్లు కావాలి',
      hi: 'मुझे पानी चाहिए',
      ta: 'எனக்கு தண்ணீர் வேண்டும்',
      kn: 'ನನಗೆ ನೀರು ಬೇಕು',
      ml: 'എനിക്ക് വെള്ളം വേണം',
      bn: 'আমার জল লাগবে',
      mr: 'मला पाणी हवे आहे'
    }
  },
  {
    keys: ['naaku aakali vesthundi', 'naaku aakali vestundi', 'aakali vesthundi', 'aakali vestundi'],
    translations: {
      en: 'I am hungry',
      te: 'నాకు ఆకలి వేస్తుంది',
      hi: 'मुझे भूख लगी है',
      ta: 'எனக்கு பசிக்கிறது',
      kn: 'ನನಗೆ ಹಸಿವಾಗುತ್ತಿದೆ',
      ml: 'എനിക്ക് വിശക്കുന്നു',
      bn: 'আমার খিদে পেয়েছে',
      mr: 'मला भूक लागली आहे',
      gu: 'મને ભૂખ લાગી છે',
      pa: 'ਮੈਨੂੰ ਭੁੱਖ ਲੱਗੀ ਹੈ'
    }
  },
  {
    keys: ['mujhe bhookh lagi hai', 'mujhe bhook lagi hai', 'bhookh lagi hai', 'bhook lagi hai'],
    translations: {
      en: 'I am hungry',
      te: 'నాకు ఆకలి వేస్తుంది',
      hi: 'मुझे भूख लगी है',
      ta: 'எனக்கு பசிக்கிறது',
      kn: 'ನನಗೆ ಹಸಿವಾಗುತ್ತಿದೆ',
      ml: 'എനിക്ക് വിശക്കുന്നു',
      bn: 'আমার খিদে পেয়েছে',
      mr: 'मला भूक लागली आहे',
      gu: 'મને ભૂખ લાગી છે',
      pa: 'ਮੈਨੂੰ ਭੁੱਖ ਲੱਗੀ ਹੈ'
    }
  },
  {
    keys: ['nandri', 'romba nandri', 'mikka nandri'],
    translations: {
      en: 'Thank you',
      te: 'ధన్యవాదాలు',
      hi: 'धन्यवाद',
      ta: 'நன்றி',
      kn: 'ಧನ್ಯವಾದಗಳು',
      ml: 'നന്ദി',
      bn: 'ধন্যবাদ',
      mr: 'धन्यवाद',
      gu: 'આભાર',
      pa: 'ਧੰਨਵਾਦ',
      or: 'ଧନ୍ୟବାଦ',
      ur: 'شکریہ'
    }
  },
  {
    keys: ['dhanyavadalu', 'chala dhanyavadalu'],
    translations: {
      en: 'Thank you very much',
      te: 'చాలా ధన్యవాదాలు',
      hi: 'बहुत-बहुत धन्यवाद',
      ta: 'மிக்க நன்றி',
      kn: 'ತುಂಬಾ ಧನ್ಯವಾದಗಳು',
      ml: 'വളരെ നന്ദി',
      bn: 'অনেক ধন্যবাদ',
      mr: 'खूप खूप धन्यवाद',
      gu: 'ખૂબ ખૂબ આભાર',
      pa: 'ਬਹੁਤ ਬਹੁਤ ਧੰਨਵਾਦ'
    }
  },
  {
    keys: ['shukriya', 'bahut shukriya', 'dhanyavaad', 'bahut dhanyavaad'],
    translations: {
      en: 'Thank you',
      te: 'ధన్యవాదాలు',
      hi: 'धन्यवाद / शुक्रिया',
      ta: 'நன்றி',
      kn: 'ಧನ್ಯವಾದಗಳು',
      ml: 'നന്ദി',
      bn: 'ধন্যবাদ',
      mr: 'धन्यवाद',
      gu: 'આભાર',
      pa: 'ਧੰਨਵਾਦ'
    }
  },
  {
    keys: ['hello', 'namaste', 'namaskaram', 'vanakkam', 'namaskara'],
    translations: {
      en: 'Hello / Greetings',
      te: 'నమస్కారం',
      hi: 'नमस्ते',
      ta: 'வணக்கம்',
      kn: 'ನಮಸ್ಕಾರ',
      ml: 'നമസ്കാരം',
      bn: 'নমস্কার',
      mr: 'नमस्कार',
      gu: 'નમસ્તે',
      pa: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ',
      or: 'ନମସ୍କାର',
      ur: 'سلام'
    }
  },

  // --- FRUITS & VEGETABLES ---
  {
    keys: ['apple', 'apples'],
    translations: {
      en: 'Apple',
      te: 'ఆపిల్ (సేవ పండు)',
      hi: 'सेब',
      ta: 'ஆப்பிள்',
      kn: 'ಸೇಬು',
      ml: 'ആപ്പിൾ',
      bn: 'আপেল',
      mr: 'सफरचंद',
      gu: 'સફરજન',
      pa: 'ਸੇਬ'
    }
  },
  {
    keys: ['banana', 'bananas', 'kela', 'arati pandu'],
    translations: {
      en: 'Banana',
      te: 'అరటిపండు',
      hi: 'केला',
      ta: 'வாழைப்பழம்',
      kn: 'ಬಾಳೆಹಣ್ಣು',
      ml: 'വാഴപ്പഴം',
      bn: 'কলা',
      mr: 'केळे',
      gu: 'કેળું',
      pa: 'ਕੇਲਾ'
    }
  },
  {
    keys: ['mango', 'mangoes', 'aam', 'mamidi pandu'],
    translations: {
      en: 'Mango',
      te: 'మామిడిపండు',
      hi: 'आम',
      ta: 'மாம்பழம்',
      kn: 'ಮಾವಿನಹಣ್ಣು',
      ml: 'മാമ്പഴം',
      bn: 'আম',
      mr: 'आंबा',
      gu: 'કેરી',
      pa: 'ਅੰਬ'
    }
  },
  {
    keys: ['orange', 'oranges', 'santra', 'narinja'],
    translations: {
      en: 'Orange',
      te: 'నారింజ పండు',
      hi: 'संतरा',
      ta: 'ஆரஞ்சு',
      kn: 'ಕಿತ್ತಳೆ',
      ml: 'ഓറഞ്ച്',
      bn: 'কমলালেবু',
      mr: 'संत्रे'
    }
  },
  {
    keys: ['grapes', 'draksha', 'angoor'],
    translations: {
      en: 'Grapes',
      te: 'ద్రాక్ష',
      hi: 'अंगूर',
      ta: 'திராட்சை',
      kn: 'ದ್ರಾಕ್ಷಿ',
      ml: 'മുന്തിരി',
      bn: 'আঙুর',
      mr: 'द्राक्षे'
    }
  },
  {
    keys: ['papaya', 'boppayi', 'papita'],
    translations: {
      en: 'Papaya',
      te: 'బొప్పాయి',
      hi: 'पपीता',
      ta: 'பப்பாளி',
      kn: 'ಪಪ್ಪಾಯಿ',
      ml: 'പപ്പായ',
      bn: 'পেঁপে'
    }
  },
  {
    keys: ['guava', 'jama pandu', 'amrood'],
    translations: {
      en: 'Guava',
      te: 'జామపండు',
      hi: 'अमरूद',
      ta: 'கொய்யா',
      kn: 'ಸೀಬೆಹಣ್ಣು',
      ml: 'പേരയ്ക്ക'
    }
  },
  {
    keys: ['watermelon', 'puchakaya', 'tarbooj'],
    translations: {
      en: 'Watermelon',
      te: 'పుచ్చకాయ',
      hi: 'तरबूज',
      ta: 'தர்பூசணி',
      kn: 'ಕಲ್ಲಂಗಡಿ',
      ml: 'തണ്ണിമത്തൻ'
    }
  },
  {
    keys: ['coconut', 'kobbari', 'nariyal', 'thengai'],
    translations: {
      en: 'Coconut',
      te: 'కొబ్బరికాయ',
      hi: 'नारियल',
      ta: 'தேங்காய்',
      kn: 'ತೆಂಗಿನಕಾಯಿ',
      ml: 'തേങ്ങ',
      bn: 'নারকেল'
    }
  },
  {
    keys: ['lemon', 'nimmakaya', 'nimbu', 'elamichai'],
    translations: {
      en: 'Lemon',
      te: 'నిమ్మకాయ',
      hi: 'नींबू',
      ta: 'எலுமிச்சை',
      kn: 'ನಿಂಬೆಹಣ್ಣು',
      ml: 'നാരങ്ങ'
    }
  },
  {
    keys: ['onion', 'onions', 'ullipaya', 'pyaz', 'vengayam'],
    translations: {
      en: 'Onion',
      te: 'ఉల్లిపాయ',
      hi: 'प्याज',
      ta: 'வெங்காயம்',
      kn: 'ಈರುಳ್ಳಿ',
      ml: 'സവാള / ഉള്ളി',
      bn: 'পেঁয়াজ'
    }
  },
  {
    keys: ['garlic', 'vellulli', 'lahsun', 'poondu'],
    translations: {
      en: 'Garlic',
      te: 'వెల్లుల్లి',
      hi: 'लहसुन',
      ta: 'பூண்டு',
      kn: 'ಬೆಳ್ಳುಳ್ಳಿ',
      ml: 'വെളുത്തുള്ളി',
      bn: 'রসুন'
    }
  },
  {
    keys: ['ginger', 'allam', 'adrak', 'inji'],
    translations: {
      en: 'Ginger',
      te: 'అల్లం',
      hi: 'अदरक',
      ta: 'இஞ்சி',
      kn: 'ಶುಂಠಿ',
      ml: 'ഇഞ്ചി',
      bn: 'আদা'
    }
  },
  {
    keys: ['tomato', 'tomatoes', 'tamata', 'tamatar', 'thakkali'],
    translations: {
      en: 'Tomato',
      te: 'టమోటా',
      hi: 'टमाटर',
      ta: 'தக்காளி',
      kn: 'ಟೊಮೆಟೊ',
      ml: 'തക്കാളി'
    }
  },

  // --- ANIMALS & BIRDS ---
  {
    keys: ['dog', 'dogs', 'kukka', 'kutta', 'naai'],
    translations: {
      en: 'Dog',
      te: 'కుక్క',
      hi: 'कुत्ता',
      ta: 'நாய்',
      kn: 'ನಾಯಿ',
      ml: 'പട്ടി / നായ',
      bn: 'কুকুর'
    }
  },
  {
    keys: ['cat', 'cats', 'pilli', 'billi', 'poonai'],
    translations: {
      en: 'Cat',
      te: 'పిల్లి',
      hi: 'बिल्ली',
      ta: 'பூனை',
      kn: 'ಬೆಕ್ಕು',
      ml: 'പൂച്ച',
      bn: 'বিড়াল'
    }
  },
  {
    keys: ['cow', 'cows', 'aavu', 'gaay', 'pasu'],
    translations: {
      en: 'Cow',
      te: 'ఆవు',
      hi: 'गाय',
      ta: 'பசு',
      kn: 'ಹಸು',
      ml: 'പശു',
      bn: 'গরু'
    }
  },
  {
    keys: ['elephant', 'elephants', 'enugu', 'haathi', 'yaanai'],
    translations: {
      en: 'Elephant',
      te: 'ఏనుగు',
      hi: 'हाथी',
      ta: 'யானை',
      kn: 'ಆನೆ',
      ml: 'ആന',
      bn: 'হাতি'
    }
  },
  {
    keys: ['tiger', 'tigers', 'puli', 'baagh'],
    translations: {
      en: 'Tiger',
      te: 'పులి',
      hi: 'बाघ',
      ta: 'புலி',
      kn: 'ಹುಲಿ',
      ml: 'കടുവ',
      bn: 'বাঘ'
    }
  },
  {
    keys: ['lion', 'lions', 'simham', 'sher'],
    translations: {
      en: 'Lion',
      te: 'సింహం',
      hi: 'शेर / सिंह',
      ta: 'சிங்கம்',
      kn: 'ಸಿಂಹ',
      ml: 'സിംഹം',
      bn: 'সিংহ'
    }
  },
  {
    keys: ['horse', 'horses', 'gurram', 'ghoda', 'kuthirai'],
    translations: {
      en: 'Horse',
      te: 'గుర్రం',
      hi: 'घोड़ा',
      ta: 'குதிரை',
      kn: 'ಕುದುರೆ',
      ml: 'കുതിര',
      bn: 'ঘোড়া'
    }
  },
  {
    keys: ['fish', 'fishes', 'chepa', 'chepalu', 'machli', 'meen'],
    translations: {
      en: 'Fish',
      te: 'చేప',
      hi: 'मछली',
      ta: 'மீன்',
      kn: 'ಮೀನು',
      ml: 'മീൻ',
      bn: 'মাছ'
    }
  },
  {
    keys: ['bird', 'birds', 'pakshi', 'chidiya', 'paravai'],
    translations: {
      en: 'Bird',
      te: 'పక్షి',
      hi: 'पक्षी / चिड़िया',
      ta: 'பறவை',
      kn: 'ಪಕ್ಷಿ',
      ml: 'പക്ഷി',
      bn: 'পাখি'
    }
  },
  {
    keys: ['peacock', 'nemali', 'mor', 'mayil'],
    translations: {
      en: 'Peacock',
      te: 'నెమలి',
      hi: 'मोर',
      ta: 'மயில்',
      kn: 'ನವಿಲು',
      ml: 'മയിൽ'
    }
  },

  // --- FAMILY & DAILY NOUNS ---
  {
    keys: ['mother', 'mom', 'amma', 'thaayi', 'maa', 'mataji'],
    translations: {
      en: 'Mother',
      te: 'తల్లి (అమ్మ)',
      hi: 'माँ (माताजी)',
      ta: 'தாய் (அம்மா)',
      kn: 'ತಾಯಿ (ಅಮ್ಮ)',
      ml: 'അമ്മ',
      bn: 'মা'
    }
  },
  {
    keys: ['father', 'dad', 'nanna', 'thandrhi', 'pita', 'pitaji', 'appa'],
    translations: {
      en: 'Father',
      te: 'తండ్రి (నాన్న)',
      hi: 'पिता (पिताजी)',
      ta: 'தந்தை (அப்பா)',
      kn: 'ತಂದೆ (ಅಪ್ಪ)',
      ml: 'അച്ഛൻ',
      bn: 'বাবা'
    }
  },
  {
    keys: ['brother', 'bhai', 'annayya', 'thammudu', 'sahodaran'],
    translations: {
      en: 'Brother',
      te: 'సోదరుడు (అన్నయ్య / తమ్ముడు)',
      hi: 'भाई',
      ta: 'சகோதரன் (அண்ணன் / தம்பி)',
      kn: 'ಸಹೋದರ (ಅಣ್ಣ / ತಮ್ಮ)',
      ml: 'സഹോദരൻ'
    }
  },
  {
    keys: ['sister', 'behen', 'chelelu', 'akka', 'sahodari'],
    translations: {
      en: 'Sister',
      te: 'సోదరి (అక్క / చెల్లెలు)',
      hi: 'बहन',
      ta: 'சகோதரி (அக்கா / தங்கை)',
      kn: 'ಸಹೋದರಿ (ಅಕ್ಕ / ತಂಗಿ)',
      ml: 'സഹോദരി'
    }
  },
  {
    keys: ['friend', 'friends', 'dost', 'mitr', 'snehithudu', 'nanban'],
    translations: {
      en: 'Friend',
      te: 'స్నేహితుడు (మిత్రుడు)',
      hi: 'दोस्त (मित्र)',
      ta: 'நண்பன்',
      kn: 'ಸ್ನೇಹಿತ',
      ml: 'സുഹൃത്ത്',
      bn: 'বন্ধু'
    }
  },
  {
    keys: ['house', 'home', 'illu', 'ghar', 'veedu', 'mane'],
    translations: {
      en: 'House / Home',
      te: 'ఇల్లు',
      hi: 'घर',
      ta: 'வீடு',
      kn: 'ಮನೆ',
      ml: 'വീട്',
      bn: 'বাড়ি'
    }
  },
  {
    keys: ['hospital', 'aasupathri', 'aspatal', 'maruthuvamanai'],
    translations: {
      en: 'Hospital',
      te: 'ఆసుపత్రి',
      hi: 'अस्पताल',
      ta: 'மருத்துவமனை',
      kn: 'ಆಸ್ಪತ್ರೆ',
      ml: 'ആശുപത്രി'
    }
  },
  {
    keys: ['school', 'paatashala', 'vidyalay', 'palli'],
    translations: {
      en: 'School',
      te: 'పాఠశాల (బడి)',
      hi: 'विद्यालय (स्कूल)',
      ta: 'பள்ளி',
      kn: 'ಶಾಲೆ',
      ml: 'സ്കൂൾ'
    }
  },
  {
    keys: ['book', 'books', 'pustakam', 'kitab'],
    translations: {
      en: 'Book',
      te: 'పుస్తకం',
      hi: 'किताब (पुस्तक)',
      ta: 'புத்தகம்',
      kn: 'ಪುಸ್ತಕ',
      ml: 'പുസ്തകം'
    }
  },
  {
    keys: ['money', 'dabbu', 'dabbulu', 'paise', 'panam', 'hana'],
    translations: {
      en: 'Money',
      te: 'డబ్బులు',
      hi: 'पैसे (धन)',
      ta: 'பணம்',
      kn: 'ಹಣ',
      ml: 'പണം'
    }
  },
  {
    keys: ['doctor', 'vaidyudu', 'chikitsak'],
    translations: {
      en: 'Doctor',
      te: 'వైద్యుడు (డాక్టర్)',
      hi: 'चिकित्सक (डॉक्टर)',
      ta: 'மருத்துவர் (டாக்டர்)',
      kn: 'ವೈದ್ಯ (ಡಾಕ್ಟರ್)',
      ml: 'ഡോക്ടർ'
    }
  }
];

export const VOCABULARY_DICTIONARY = FOOD_MENU_DICTIONARY;
export const lookupVocabulary = lookupFoodTranslation;

/**
 * Fast Lookup of a clean word or phrase in the Indian Food & Menu Dictionary
 * @param {string} text - text to match (e.g. "brinjal curry", "vankaya kura", "ladies finger")
 * @param {string} targetLang - target language code ('te', 'hi', 'ta', etc.)
 * @returns {string|null}
 */
export function lookupFoodTranslation(text, targetLang) {
  if (!text || !targetLang) return null;
  const clean = text.trim().toLowerCase().replace(/[.:,;—\-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!clean) return null;

  for (const entry of FOOD_MENU_DICTIONARY) {
    for (const key of entry.keys) {
      if (key === clean) {
        if (targetLang === 'en') return entry.translations.en || entry.keys[0];
        if (entry.translations[targetLang]) return entry.translations[targetLang];
      }
    }
  }

  // Also check if clean matches after stripping leading bullet / numbering e.g. "1. Brinjal curry" -> "Brinjal curry"
  const stripped = clean.replace(/^[0-9]+[)\].\s]+/, '').trim();
  if (stripped !== clean) {
    for (const entry of FOOD_MENU_DICTIONARY) {
      for (const key of entry.keys) {
        if (key === stripped) {
          if (targetLang === 'en') return entry.translations.en || entry.keys[0];
          if (entry.translations[targetLang]) return entry.translations[targetLang];
        }
      }
    }
  }

  return null;
}

/**
 * Post-processes automated translation results to fix known machine translation
 * flaws and transliterated artifacts (e.g. "లేడీస్ ఫింగర్ కర్రీ" -> "బెండకాయ కూర", "సీసా పొట్లకాయ" -> "సొరకాయ", "బ్రింజల్ కర్రీ" -> "వంకాయ కూర")
 * @param {string} text - Machine translated text
 * @param {string} targetLang - Target language
 * @returns {string}
 */
export function fixKnownTranslationFlaws(text, targetLang) {
  if (!text || typeof text !== 'string') return text;
  let out = text;

  if (targetLang === 'te') {
    const teReplacements = [
      // Brinjal / Eggplant
      [/\bబ్రింజల్\s*కర్రీ\b/gi, 'వంకాయ కూర'],
      [/\bబ్రింజాల్\s*కర్రీ\b/gi, 'వంకాయ కూర'],
      [/\bబ్రింజల్\s*కూర\b/gi, 'వంకాయ కూర'],
      [/\bబ్రింజల్\s*ఫ్రై\b/gi, 'వంకాయ వేపుడు'],
      [/\bబ్రింజల్\b/gi, 'వంకాయ'],
      [/\bబ్రింజాల్\b/gi, 'వంకాయ'],

      // Ladies finger
      [/\bలేడీస్\s*ఫింగర్\s*కర్రీ\b/gi, 'బెండకాయ కూర'],
      [/\bలేడీస్\s*ఫింగర్\s*కూర\b/gi, 'బెండకాయ కూర'],
      [/\bలేడీస్\s*ఫింగర్\s*ఫ్రై\b/gi, 'బెండకాయ వేపుడు'],
      [/\bలేడీస్\s*ఫింగర్\b/gi, 'బెండకాయ'],
      [/\bలేడీ\s*ఫింగర్\b/gi, 'బెండకాయ'],
      [/\bభేది\s*కూర\b/gi, 'బెండకాయ కూర'],
      [/\bభేది\s*వేపుడు\b/gi, 'బెండకాయ వేపుడు'],
      [/\bభిండీ\b/gi, 'బెండకాయ'],

      // Bottle gourd
      [/\bసీసా\s*పొట్లకాయ\b/gi, 'సొరకాయ'],
      [/\bసీసా\s*సొరకాయ\b/gi, 'సొరకాయ'],
      [/\bబాటిల్\s*గార్డ్\b/gi, 'సొరకాయ'],

      // Bitter gourd
      [/\bచేదు\s*పొట్లకాయ\b/gi, 'కాకరకాయ'],
      [/\bచేదు\s*కాకరకాయ\b/gi, 'కాకరకాయ'],
      [/\bబిట్టర్\s*గార్డ్\b/gi, 'కాకరకాయ'],

      // Potato
      [/\bబంగాళదుంప\s*వేసి\b/gi, 'బంగాళాదుంప వేపుడు'],
      [/\bబంగాళదుంప\s*ఫ్రై\b/gi, 'బంగాళాదుంప వేపుడు'],
      [/\bఆలూ\s*ఫ్రై\b/gi, 'బంగాళాదుంప వేపుడు (ఆలూ ఫ్రై)'],
      [/\bఅలు\s*గోబీ\b/gi, 'ఆలూ గోబీ (బంగాళాదుంప క్యాలీఫ్లవర్ కూర)'],

      // Curd & Rice
      [/\bకర్డ్\s*రైస్\b/gi, 'పెరుగు అన్నం (దద్దోజనం)'],
      [/\bకర్డ్\b/gi, 'పెరుగు'],
      [/\bదాల్\s*తడ్కా\b/gi, 'దాల్ తడ్కా (తాలింపు పప్పు)'],

      // Mess Menu
      [/\bమెస్\s*మెనూ\b/gi, 'మెస్ మెనూ (భోజన పట్టిక)']
    ];

    for (const [pattern, repl] of teReplacements) {
      out = out.replace(pattern, repl);
    }
  } else if (targetLang === 'hi') {
    const hiReplacements = [
      // Brinjal
      [/\bब्रिंजल\s*करी\b/gi, 'बैंगन की सब्जी'],
      [/\bब्रिंजाल\s*करी\b/gi, 'बैंगन की सब्जी'],
      [/\bवंकाया\s*करी\b/gi, 'बैंगन की सब्जी'],
      [/\bबैंगन\s*करी\b/gi, 'बैंगन की सब्जी'],
      [/\bब्रिंजल\b/gi, 'बैंगन'],

      // Ladies finger
      [/\bलेडीज़\s*फिंगर\s*करी\b/gi, 'भिंडी की सब्जी'],
      [/\bलेडीज\s*फिंगर\s*करी\b/gi, 'भिंडी की सब्जी'],
      [/\bलेडीज़\s*फिंगर\b/gi, 'भिंडी'],
      [/\bलेडीज\s*फिंगर\b/gi, 'भिंडी'],
      [/\bभिंडी\s*करी\b/gi, 'भिंडी की सब्जी'],

      // Bottle gourd
      [/\bबोतल\s*लौकी\b/gi, 'लौकी की सब्जी'],

      // Potato
      [/\bआलू\s*फ्राई\b/gi, 'आलू की भुजिया (आलू फ्राई)'],
      [/\bअलु\s*गोबी\b/gi, 'आलू गोभी की सब्जी'],
      [/\bआलू\s*गोभी\s*करी\b/gi, 'आलू गोभी की सब्जी'],

      // Curd & Dal
      [/\bकर्ड\s*राइस\b/gi, 'दही चावल'],
      [/\bकर्ड\b/gi, 'दही'],

      // Mess Menu
      [/\bमेस\s*मेनू\b/gi, 'मेस मेनू (भोजन तालिका)']
    ];

    for (const [pattern, repl] of hiReplacements) {
      out = out.replace(pattern, repl);
    }
  } else if (targetLang === 'ta') {
    const taReplacements = [
      [/\bபிரிஞ்சால்\s*கறி\b/gi, 'கத்தரிக்காய் குழம்பு'],
      [/\bபிரிஞ்சால்\b/gi, 'கத்தரிக்காய்'],
      [/\bலேடிஸ்\s*பிங்கர்\b/gi, 'வெண்டைக்காய்'],
      [/\bபொட்டேட்டோ\s*பிரை\b/gi, 'உருளைக்கிழங்கு வறுவல்']
    ];
    for (const [pattern, repl] of taReplacements) {
      out = out.replace(pattern, repl);
    }
  } else if (targetLang === 'kn') {
    const knReplacements = [
      [/\bಬ್ರಿಂಜಾಲ್\s*ಕರಿ\b/gi, 'ಬದನೆಕಾಯಿ ಪಲ್ಯ'],
      [/\bಬ್ರಿಂಜಾಲ್\b/gi, 'ಬದನೆಕಾಯಿ'],
      [/\bಲೇಡೀಸ್\s*ಫಿಂಗರ್\b/gi, 'ಬೆಂಡೆಕಾಯಿ'],
      [/\bಪೊಟ್ಯಾಟೊ\s*ಫ್ರೈ\b/gi, 'ಆಲೂಗಡ್ಡೆ ಫ್ರೈ']
    ];
    for (const [pattern, repl] of knReplacements) {
      out = out.replace(pattern, repl);
    }
  }

  return out;
}
