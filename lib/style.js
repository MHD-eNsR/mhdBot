// زغرفة رسايل واتساب: *عريض* _مائل_ ~مشطوب~ `كود` ```مونو```
// مهم: علامة الزغرفة لازم يكون قبلها وبعدها مسافة او اول/اخر السطر
// ولو لزقت في حرف او رمز او ايموجي (زي مرحبا*العالم*) واتساب مش بيزغرفها

const settings = require('../settings');

const b = (t) => `*${t}*`;
const i = (t) => `_${t}_`;
const s = (t) => `~${t}~`;
const c = (t) => '`' + t + '`';
const m = (t) => '```' + t + '```';
const q = (t) => `> ${t}`;

const BAR = '✠───•───〈✤〉───•───✠';

// ---------- الخطوط المميزة للانجليزي ----------
// كل خط: [بداية الحروف الكبيرة، بداية الحروف الصغيرة]
const FONTS = [
  [0x1d468, 0x1d482], // 𝑯𝒆𝒍𝒍𝒐 عريض مايل
  [0x1d400, 0x1d41a], // 𝐇𝐞𝐥𝐥𝐨 عريض
  [0x1d4d0, 0x1d4ea], // 𝓗𝓮𝓵𝓵𝓸 خط يد
  [0x1d56c, 0x1d586], // 𝕳𝖊𝖑𝖑𝖔 قوطي
  [0x1d5d4, 0x1d5ee], // 𝗛𝗲𝗹𝗹𝗼 سانس عريض
  [0x1d63c, 0x1d656], // 𝙃𝙚𝙡𝙡𝙤 سانس عريض مايل
  [0x1d670, 0x1d68a], // 𝙷𝚎𝚕𝚕𝚘 مونو
  [0xff21, 0xff41],   // Ｈｅｌｌｏ عريض واسع
];

function fancyWord(str, font) {
  const [UP, LO] = FONTS[font] || FONTS[0];
  return str.replace(/[A-Za-z]/g, (ch) => {
    const code = ch.charCodeAt(0);
    return code <= 90
      ? String.fromCodePoint(UP + code - 65)
      : String.fromCodePoint(LO + code - 97);
  });
}

// اجزاء بتتساب زي ما هي: كود ولينكات وايميلات ومنشن وايديهات
const PROTECTED_RE = /```[\s\S]*?```|`[^`\n]*`|https?:\/\/\S+|www\.\S+|\S*@\S*/g;

function fancy(text, font = 0) {
  if (typeof text !== 'string' || !text) return text;
  let out = '';
  let last = 0;
  let mt;
  PROTECTED_RE.lastIndex = 0;
  while ((mt = PROTECTED_RE.exec(text))) {
    out += fancyWord(text.slice(last, mt.index), font) + mt[0];
    last = mt.index + mt[0].length;
  }
  out += fancyWord(text.slice(last), font);
  return out;
}

const randomFont = () => Math.floor(Math.random() * FONTS.length);

// ---------- الاطار ----------
function botTag() {
  return String(settings.botName || 'mhdBot').toUpperCase();
}

// اشكال الاطارات: top/bottom الخطوط، pre بادئة العنوان، body بادئة السطور، foot الختام
const STYLES = [
  { top: BAR, bottom: BAR, pre: '│', body: '│⌯ ', foot: (n) => `╭╼ ${i('BY ' + n)} ╾╮` },
  { top: '╔═══════ ✦ ═══════╗', bottom: '╚═══════ ✦ ═══════╝', pre: '║', body: '║ ◈ ', foot: (n) => `✦ ${i('BY ' + n)} ✦` },
  { top: '┏━━━━━━━━━━━━━━━━┓', bottom: '┗━━━━━━━━━━━━━━━━┛', pre: '┃', body: '┃ ➤ ', foot: (n) => `⌲ ${i('BY ' + n)}` },
  { top: '⋆｡°✩ ━━━━━━━━━ ✩°｡⋆', bottom: '⋆｡°✩ ━━━━━━━━━ ✩°｡⋆', pre: '✦', body: '✧ ', foot: (n) => `❖ ${i('BY ' + n)} ❖` },
  { top: '╭──────────────╮', bottom: '╰──────────────╯', pre: '│', body: '│ ✿ ', foot: (n) => `『 ${i('BY ' + n)} 』` },
  { top: '☆═══════════☆', bottom: '☆═══════════☆', pre: '☆', body: '☆ ', foot: (n) => `⟡ ${i('BY ' + n)} ⟡` },
  { top: '⌬━━━━━━━━━⌬', bottom: '⌬━━━━━━━━━⌬', pre: '⌬', body: '⌬ ', foot: (n) => `⚝ ${i('BY ' + n)} ⚝` },
  { top: '❖───────────❖', bottom: '❖───────────❖', pre: '❖', body: '• ', foot: (n) => `✿ ${i('BY ' + n)} ✿` },
  { top: '┌─────── ✧ ───────┐', bottom: '└─────── ✧ ───────┘', pre: '│', body: '│ ⟢ ', foot: (n) => `⟪ ${i('BY ' + n)} ⟫` },
  { top: '◤━━━━━━━━━━◥', bottom: '◣━━━━━━━━━━◢', pre: '┃', body: '┃ ◆ ', foot: (n) => `⟫ ${i('BY ' + n)} ⟪` },
];

// ختام ثابت للمنيو
function footer() {
  return STYLES[0].foot(botTag());
}

const ERR_RE = /^(معرفتش|حصل خطأ|حصل خطا|فشل|مقدرتش|مش قادر|غلط|الامر ده|لازم)/;
const OK_RE = /^(تم|اتفتح|اتقفل|اتشغل|اتحذف|اتمسح|اتطرد|اتغير|اتحفظ|اتضاف)/;
const EMOJI_START = /^(\p{Extended_Pictographic}\uFE0F?)\s*/u;
const HAS_MARK = /[*_~`]/;

// بيلبس الرد اطار بشكل عشوائي من STYLES
function frame(text, styleIdx) {
  if (typeof text !== 'string') return text;
  const t = text.trim();
  if (!t) return text;
  if (t.includes(BAR)) return text; // منيو او رسالة مزخرفة اصلا
  if (/^(https?:\/\/|www\.)\S+$/i.test(t)) return text; // لينك لوحده

  const st = STYLES[styleIdx === undefined ? Math.floor(Math.random() * STYLES.length) : styleIdx];
  const lines = t.split('\n');
  let first = lines[0].trim();
  let icon = '💬';
  const em = first.match(EMOJI_START);
  if (em) {
    icon = em[1];
    first = first.slice(em[0].length);
  } else if (ERR_RE.test(first)) icon = '⚠️';
  else if (OK_RE.test(first)) icon = '✅';

  const title = `${st.pre}${icon}┊ ${HAS_MARK.test(first) || !first ? first : b(first)}`;
  const rest = lines.slice(1);

  const compact = t.length <= 600 && lines.length <= 14;
  if (compact) {
    const body = rest.map((l) => (l.trim() ? `${st.body}${l.trim()}` : st.pre));
    return [st.top, title, ...body, st.bottom, st.foot(botTag())].join('\n');
  }
  // رد طويل: العنوان في اطار والباقي زي ما هو
  return [st.top, title, st.bottom, ...rest, '', st.foot(botTag())].join('\n');
}

// الاوامر (.امر) جوه كود عشان تتنسخ بلمسة، بس لو بعدها مسافة او نهاية السطر
function codeCommands(text) {
  return text.replace(/(^|\s)(\.[\u0600-\u06FFA-Za-z][\u0600-\u06FFA-Za-z0-9_-]*)(?=\s|$)/g, (_, sp, cmd) => `${sp}${c(cmd)}`);
}

function decorate(text) {
  if (typeof text !== 'string') return text;
  const fixed = text.includes(BAR); // المنيو والرسايل الثابتة بتفضل بنفس الخط
  return fancy(codeCommands(frame(text)), fixed ? 0 : randomFont());
}

module.exports = { b, i, s, c, m, q, BAR, STYLES, FONTS, fancy, frame, footer, decorate };
