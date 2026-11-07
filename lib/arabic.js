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
  'اكسو': 'tictactoe', 'اكساو': 'tictactoe', 'حرك': 'move', 'المشنقة': 'hangman', 'خمن': 'guess',
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
  'رداتلقائي': 'areact', 'قسم': 'menusec', 'استسلام': 'surrender', 'ريبو': 'repo', 'قناة': 'newsletter',
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
function translateText(text) {
  if (typeof text !== 'string') return text;
  const trimmed = text.trim();
  if (!trimmed) return text;

  if (CMD_MAP[norm(trimmed).replace(/-/g, '')] === 'surrender') return 'surrender';

  if (!trimmed.startsWith('.')) return text;
  const body = trimmed.slice(1).replace(/^\s+/, '');
  const parts = body.split(/(\s+)/); // نحافظ على المسافات
  const first = parts[0];
  const mapped = CMD_MAP[norm(first).replace(/-/g, '')];
  if (!mapped) return text;
  parts[0] = mapped;

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

// بتعدل نص الرسالة نفسه جوه الكائن
function normalizeMessage(message) {
  const m = message && message.message;
  if (!m) return message;
  // ضغطة زر تفاعلي بتتحول لنص عادي (الامر اللي في id الزر)
  if (m.interactiveResponseMessage) {
    const id = require('./buttons').extractResponseId(m);
    if (id) {
      message.message = { conversation: translateText(id) };
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

module.exports = { translateText, normalizeMessage, COMMANDS, SUB };
