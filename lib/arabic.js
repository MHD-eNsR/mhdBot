// طبقة الاوامر العربية
// بتحول الامر العربي لاسمه الاصلي جوه الكود قبل ما main.js يتعامل معاه

const COMMANDS = {
  // عامة
  'المنيو': 'menu', 'اوامر': 'menu', 'مساعدة': 'help', 'الاوامر': 'menu',
  'بنج': 'ping', 'شغال': 'alive', 'انطق': 'tts', 'المالك': 'owner',
  'نكتة': 'joke', 'اقتباس': 'quote', 'معلومة': 'fact', 'الطقس': 'weather',
  'اخبار': 'news', 'متحرك': 'attp', 'كلمات': 'lyrics', 'كورة': '8ball',
  'الجروب': 'groupinfo', 'الادمنز': 'staff', 'فتح': 'vv', 'فتح2': 'vv2',
  'ترجم': 'translate', 'سكرين': 'ss', 'الايدي': 'jid', 'رابط': 'url',
  // ادارة
  'حظر': 'ban', 'فكحظر': 'unban', 'رقي': 'promote', 'نزل': 'demote',
  'اسكت': 'mute', 'اتكلم': 'unmute', 'امسح': 'delete', 'اطرد': 'kick',
  'انذارات': 'warnings', 'انذار': 'warn', 'منعلينك': 'antilink',
  'منعسب': 'antibadword', 'نضف': 'clear', 'منشن': 'tag', 'منشنالكل': 'tagall',
  'منشنالاعضاء': 'tagnotadmin', 'منشنخفي': 'hidetag', 'شات': 'chatbot',
  'لينكجديد': 'resetlink', 'منعمنشن': 'antitag', 'ترحيب': 'welcome',
  'وداع': 'goodbye', 'منعبوت': 'antibot', 'وصفالجروب': 'setgdesc',
  'اسمالجروب': 'setgname', 'صورةالجروب': 'setgpp', 'حالةالجروب': 'groupstatus',
  // مالك
  'الوضع': 'mode', 'تنضيفالسيشن': 'clearsession', 'منعمسح': 'antidelete',
  'تنضيفالمؤقت': 'cleartmp', 'تحديث': 'update', 'الاعدادات': 'settings',
  'صورةالبوت': 'setpp', 'ردتلقائي': 'autoreact', 'مشاهدةالحالات': 'autostatus',
  'حفظالحالات': 'savestatus', 'كتابةتلقائية': 'autotyping',
  'قراءةتلقائية': 'autoread', 'منعمكالمات': 'anticall', 'منعالخاص': 'pmblocker',
  'ضبطالمنشن': 'setmention', 'منشنالبوت': 'mention', 'مساعد': 'sudo',
  // صور وملصقات
  'بلور': 'blur', 'لصورة': 'simage', 'ملصق': 'sticker', 'شيلالخلفية': 'removebg',
  'حسنالصورة': 'remini', 'قص': 'crop', 'ملصقتليجرام': 'tgsticker', 'ميمز': 'meme',
  'خدملصق': 'take', 'دمجايموجي': 'emojimix', 'انستاستوري': 'igs', 'انستاسكرين': 'igsc',
  'صور': 'pies', 'صين': 'china', 'اندونيسيا': 'indonesia', 'يابان': 'japan',
  'كوريا': 'korea',
  // العاب
  'اكسو': 'tictactoe', 'اكساو': 'tictactoe', 'مارد': 'genie', 'المارد': 'genie', 'الماردالازرق': 'genie', 'ماردازرق': 'genie', 'حرك': 'move', 'المشنقة': 'hangman', 'خمن': 'guess',
  'سؤال': 'trivia', 'اجابة': 'answer', 'صراحة': 'truth', 'تحدي': 'dare',
  // ذكاء اصطناعي
  'ذكاء': 'ai', 'جيبيتي': 'gpt', 'جيميني': 'gemini', 'تخيل': 'imagine',
  'فلاكس': 'flux', 'سورا': 'sora',
  // تسلية
  'مجاملة': 'compliment', 'اهانة': 'insult', 'غزل': 'flirt', 'شعر': 'shayari',
  'تصبحعلىخير': 'goodnight', 'وردة': 'roseday', 'شخصية': 'character',
  'ضايع': 'wasted', 'حب': 'ship', 'سمب': 'simp', 'غبي': 'stupid',
  // كتابة بخطوط
  'معدن': 'metallic', 'تلج': 'ice', 'ثلج': 'snow', 'مبهر': 'impressive',
  'ماتريكس': 'matrix', 'ضوء': 'light', 'نيون': 'neon', 'شيطان': 'devil',
  'بنفسجي': 'purple', 'رعد': 'thunder', 'ورق': 'leaves', 'ارينا': 'arena',
  'هاكر': 'hacker', 'رمل': 'sand', 'بلاكبينك': 'blackpink', 'جليتش': 'glitch',
  'نار': 'fire',
  // تحميل
  'شغل': 'play', 'اغنية': 'song', 'سبوتيفاي': 'spotify', 'انستجرام': 'instagram',
  'فيسبوك': 'facebook', 'تويتر': 'twitter', 'تيكتوك': 'tiktok', 'فيديو': 'video',
  'موسيقى': 'music',
  // متنوعة
  'قلب': 'heart', 'مثير': 'horny', 'دايرة': 'circle', 'قوسقزح': 'lgbt',
  'شرطة': 'lolice', 'كارتسمب': 'simpcard', 'تونيكاوا': 'tonikawa',
  'كارتغبي': 'its-so-stupid', 'كارتاسم': 'namecard', 'حكيم': 'oogway',
  'حكيم2': 'oogway2', 'تويت': 'tweet', 'كومنتيوتيوب': 'ytcomment',
  'رفيق': 'comrade', 'قزح': 'gay', 'زجاج': 'glass', 'سجن': 'jail',
  'نجحت': 'passed', 'غضب': 'triggered',
  // انمي
  'انمي': 'animu', 'ياكل': 'nom', 'نكزة': 'poke', 'عياط': 'cry', 'بوسة': 'kiss',
  'طبطبة': 'pat', 'حضن': 'hug', 'غمزة': 'wink', 'ضربجبهة': 'facepalm',
  'اقتباسانمي': 'animuquote',
  // اخرى
  'رداتلقائي': 'areact', 'قسم': 'menusec', 'استسلام': 'surrender', 'ريبو': 'repo', 'اعلىالاعضاء': 'topmembers', 'فيلم1917': '1917', 'لولي': 'loli', 'هند': 'india', 'ماليزيا': 'malaysia', 'تايلاند': 'thailand', 'قناة': 'newsletter',
};

// كلمات فرعية بتتحول في الاوامر اللي ليها اوامر فرعية
const SUB = {
  'تشغيل': 'on', 'ايقاف': 'off', 'ضبط': 'set', 'عرض': 'get', 'اضافة': 'add',
  'حذف': 'delete', 'قائمة': 'list', 'حالة': 'status', 'تفاعل': 'react',
  'انذار': 'warn', 'طرد': 'kick', 'مسح': 'delete', 'خاص': 'private', 'عام': 'public',
  'رسالة': 'setmsg',
};

const SUB_COMMANDS = new Set([
  'antilink', 'antitag', 'antibot', 'antibadword', 'antidelete', 'anticall',
  'autoread', 'autotyping', 'autostatus', 'savestatus', 'areact', 'autoreact',
  'chatbot', 'welcome', 'goodbye', 'mention', 'pmblocker', 'mode', 'sudo',
  'groupstatus',
]);

function norm(s) {
  return String(s)
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .toLowerCase();
}

const CMD_MAP = {};
for (const [k, v] of Object.entries(COMMANDS)) CMD_MAP[norm(k)] = v;
const SUB_MAP = {};
for (const [k, v] of Object.entries(SUB)) SUB_MAP[norm(k)] = v;

// بتاخد النص وترجع النص بالامر الاصلي
const CANON = {
 "1917": "فيلم1917",
 "menu": "المنيو",
 "ping": "بنج",
 "alive": "شغال",
 "tts": "انطق",
 "owner": "المالك",
 "joke": "نكتة",
 "quote": "اقتباس",
 "fact": "معلومة",
 "weather": "الطقس",
 "news": "اخبار",
 "attp": "متحرك",
 "lyrics": "كلمات",
 "8ball": "كورة",
 "groupinfo": "الجروب",
 "staff": "الادمنز",
 "vv": "فتح",
 "translate": "ترجم",
 "ss": "سكرين",
 "jid": "الايدي",
 "url": "رابط",
 "ban": "حظر",
 "unban": "فكحظر",
 "promote": "رقي",
 "demote": "نزل",
 "mute": "اسكت",
 "unmute": "اتكلم",
 "delete": "امسح",
 "kick": "اطرد",
 "warn": "انذار",
 "warnings": "انذارات",
 "antilink": "منعلينك",
 "antibadword": "منعسب",
 "antitag": "منعمنشن",
 "antibot": "منعبوت",
 "clear": "نضف",
 "tag": "منشن",
 "tagall": "منشنالكل",
 "tagnotadmin": "منشنالاعضاء",
 "hidetag": "منشنخفي",
 "chatbot": "شات",
 "resetlink": "لينكجديد",
 "topmembers": "اعلىالاعضاء",
 "welcome": "ترحيب",
 "goodbye": "وداع",
 "setgdesc": "وصفالجروب",
 "setgname": "اسمالجروب",
 "setgpp": "صورةالجروب",
 "groupstatus": "حالةالجروب",
 "mode": "الوضع",
 "clearsession": "تنضيفالسيشن",
 "antidelete": "منعمسح",
 "cleartmp": "تنضيفالمؤقت",
 "update": "تحديث",
 "settings": "الاعدادات",
 "setpp": "صورةالبوت",
 "autoreact": "ردتلقائي",
 "autostatus": "مشاهدةالحالات",
 "savestatus": "حفظالحالات",
 "autotyping": "كتابةتلقائية",
 "autoread": "قراءةتلقائية",
 "anticall": "منعمكالمات",
 "pmblocker": "منعالخاص",
 "setmention": "ضبطالمنشن",
 "mention": "منشنالبوت",
 "sudo": "مساعد",
 "sticker": "ملصق",
 "simage": "لصورة",
 "blur": "بلور",
 "removebg": "شيلالخلفية",
 "remini": "حسنالصورة",
 "crop": "قص",
 "tgsticker": "ملصقتليجرام",
 "meme": "ميمز",
 "take": "خدملصق",
 "emojimix": "دمجايموجي",
 "igs": "انستاستوري",
 "igsc": "انستاسكرين",
 "pies": "صور",
 "china": "صين",
 "indonesia": "اندونيسيا",
 "japan": "يابان",
 "korea": "كوريا",
 "india": "هند",
 "malaysia": "ماليزيا",
 "thailand": "تايلاند",
 "tictactoe": "اكساو",
 "genie": "مارد",
 "hangman": "المشنقة",
 "guess": "خمن",
 "trivia": "سؤال",
 "answer": "اجابة",
 "truth": "صراحة",
 "dare": "تحدي",
 "ai": "ذكاء",
 "gpt": "جيبيتي",
 "gemini": "جيميني",
 "imagine": "تخيل",
 "flux": "فلاكس",
 "sora": "سورا",
 "compliment": "مجاملة",
 "insult": "اهانة",
 "flirt": "غزل",
 "shayari": "شعر",
 "goodnight": "تصبحعلىخير",
 "roseday": "وردة",
 "character": "شخصية",
 "wasted": "ضايع",
 "ship": "حب",
 "simp": "سمب",
 "stupid": "غبي",
 "metallic": "معدن",
 "ice": "تلج",
 "snow": "ثلج",
 "impressive": "مبهر",
 "matrix": "ماتريكس",
 "light": "ضوء",
 "neon": "نيون",
 "devil": "شيطان",
 "purple": "بنفسجي",
 "thunder": "رعد",
 "leaves": "ورق",
 "arena": "ارينا",
 "hacker": "هاكر",
 "sand": "رمل",
 "blackpink": "بلاكبينك",
 "glitch": "جليتش",
 "fire": "نار",
 "play": "شغل",
 "song": "اغنية",
 "spotify": "سبوتيفاي",
 "instagram": "انستجرام",
 "facebook": "فيسبوك",
 "twitter": "تويتر",
 "tiktok": "تيكتوك",
 "video": "فيديو",
 "heart": "قلب",
 "circle": "دايرة",
 "lgbt": "قوسقزح",
 "lolice": "شرطة",
 "its-so-stupid": "كارتغبي",
 "namecard": "كارتاسم",
 "oogway": "حكيم",
 "tweet": "تويت",
 "ytcomment": "كومنتيوتيوب",
 "comrade": "رفيق",
 "glass": "زجاج",
 "jail": "سجن",
 "passed": "نجحت",
 "triggered": "غضب",
 "nom": "ياكل",
 "poke": "نكزة",
 "cry": "عياط",
 "kiss": "بوسة",
 "pat": "طبطبة",
 "hug": "حضن",
 "wink": "غمزة",
 "facepalm": "ضربجبهة",
 "loli": "لولي",
 "repo": "ريبو",
 "help": "مساعدة",
 "vv2": "فتح2",
 "move": "حرك",
 "music": "موسيقى",
 "horny": "مثير",
 "simpcard": "كارتسمب",
 "tonikawa": "تونيكاوا",
 "oogway2": "حكيم2",
 "gay": "قزح",
 "animu": "انمي",
 "animuquote": "اقتباسانمي",
 "areact": "رداتلقائي",
 "menusec": "قسم",
 "surrender": "استسلام",
 "newsletter": "قناة"
};
// عكس الجدول: الاسم العربي الاساسي -> الاسم الانجليزي (للاستخدام الداخلي فقط)
const ENGLISH_OF = Object.fromEntries(Object.entries(CANON).map(([en, ar]) => [ar, en]));

// علامة خفية بتتحط قدام الامر الانجليزي عشان البوت ميعتبرهوش امر
const NEUTRAL = '\u200B';

// allowEnglish: للاستخدام الداخلي بس (ids الازرار زي .menusec 3)
function translateText(text, allowEnglish = false) {
  if (typeof text !== 'string') return text;
  const trimmed = text.trim();
  if (!trimmed) return text;

  // الاوامر الانجليزي اتلغت: بتتحول لرسالة عادية
  if (!allowEnglish && !text.startsWith(NEUTRAL)) {
    if (trimmed.toLowerCase() === 'surrender') return NEUTRAL + text;
    if (/^\.\s*[A-Za-z0-9]/.test(trimmed)) return NEUTRAL + text;
  }

  if (CMD_MAP[norm(trimmed).replace(/-/g, '')] === 'surrender') return 'استسلام';

  if (!trimmed.startsWith('.')) return text;
  const body = trimmed.slice(1).replace(/^\s+/, '');
  const parts = body.split(/(\s+)/); // نحافظ على المسافات
  const first = parts[0];
  const mapped = CMD_MAP[norm(first).replace(/-/g, '')];
  if (!mapped) return text;
  parts[0] = CANON[mapped] || first;

  if (SUB_COMMANDS.has(mapped)) {
    let seen = 0;
    for (let i = 2; i < parts.length && seen < 3; i += 2) {
      const key = norm(parts[i]);
      if (SUB_MAP[key]) parts[i] = (mapped === 'sudo' && SUB_MAP[key] === 'delete') ? 'del' : SUB_MAP[key];
      seen++;
    }
  }
  return '.' + parts.join('');
}


// هل الرسالة هي الامر ده (الامر لوحده او بعده مسافة/سطر جديد)
function isCmd(msg, cmd) {
  if (typeof msg !== 'string') return false;
  return msg === cmd || msg.startsWith(cmd + ' ') || msg.startsWith(cmd + '\n');
}

// النص اللي بعد اسم الامر
function argsOf(msg) {
  if (typeof msg !== 'string') return '';
  const m = /^\S+\s*([\s\S]*)$/.exec(msg.trim());
  return m ? m[1].trim() : '';
}

// الاسم الانجليزي الداخلي للامر (لاماكن بتبعته كمعامل لخدمة خارجية)
function toEnglish(word) {
  return ENGLISH_OF[word] || word;
}

// بتعدل نص الرسالة نفسه جوه الكائن
function normalizeMessage(message) {
  const m = message && message.message;
  if (!m) return message;
  // متتعملش مرتين على نفس الرسالة (عشان الامر المترجم ميتحسبش انجليزي)
  if (message.__normalized) return message;
  Object.defineProperty(message, '__normalized', { value: true, enumerable: false });
  // ضغطة زر تفاعلي بتتحول لنص عادي (الامر اللي في id الزر)
  if (m.interactiveResponseMessage) {
    const id = require('./buttons').extractResponseId(m);
    if (id) {
      message.message = { conversation: translateText(id, true) };
      return message;
    }
  }
  if (typeof m.conversation === 'string') m.conversation = translateText(m.conversation);
  if (m.extendedTextMessage && typeof m.extendedTextMessage.text === 'string') {
    m.extendedTextMessage.text = translateText(m.extendedTextMessage.text);
  }
  if (m.imageMessage && typeof m.imageMessage.caption === 'string') {
    m.imageMessage.caption = translateText(m.imageMessage.caption);
  }
  if (m.videoMessage && typeof m.videoMessage.caption === 'string') {
    m.videoMessage.caption = translateText(m.videoMessage.caption);
  }
  return message;
}

module.exports = { translateText, normalizeMessage, isCmd, argsOf, toEnglish, CANON, ENGLISH_OF, COMMANDS, SUB };
