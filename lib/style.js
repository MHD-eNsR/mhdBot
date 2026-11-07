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

// ---------- الخط المميز للانجليزي: 𝑯𝒆𝒍𝒍𝒐 𝑾𝒐𝒓𝒍𝒅 ----------
const UP = 0x1d468; // 𝑨
const LO = 0x1d482; // 𝒂

function fancyWord(str) {
  return str.replace(/[A-Za-z]/g, (ch) => {
    const code = ch.charCodeAt(0);
    return code <= 90
      ? String.fromCodePoint(UP + code - 65)
      : String.fromCodePoint(LO + code - 97);
  });
}

// اجزاء بتتساب زي ما هي: كود ولينكات وايميلات ومنشن وايديهات
const PROTECTED_RE = /```[\s\S]*?```|`[^`\n]*`|https?:\/\/\S+|www\.\S+|\S*@\S*/g;

function fancy(text) {
  if (typeof text !== 'string' || !text) return text;
  let out = '';
  let last = 0;
  let mt;
  PROTECTED_RE.lastIndex = 0;
  while ((mt = PROTECTED_RE.exec(text))) {
    out += fancyWord(text.slice(last, mt.index)) + mt[0];
    last = mt.index + mt[0].length;
  }
  out += fancyWord(text.slice(last));
  return out;
}

// ---------- الاطار ----------
function botTag() {
  return String(settings.botName || 'mhdBot').toUpperCase();
}

function footer() {
  return `╭╼ ${i('BY ' + botTag())} ╾╮`;
}

const ERR_RE = /^(معرفتش|حصل خطأ|حصل خطا|فشل|مقدرتش|مش قادر|غلط|الامر ده|لازم)/;
const OK_RE = /^(تم|اتفتح|اتقفل|اتشغل|اتحذف|اتمسح|اتطرد|اتغير|اتحفظ|اتضاف)/;
const EMOJI_START = /^(\p{Extended_Pictographic}\uFE0F?)\s*/u;
const HAS_MARK = /[*_~`]/;

// بيلبس الرد الاطار بتاع البوت
function frame(text) {
  if (typeof text !== 'string') return text;
  const t = text.trim();
  if (!t) return text;
  if (t.includes(BAR)) return text; // مزخرف اصلا
  if (/^(https?:\/\/|www\.)\S+$/i.test(t)) return text; // لينك لوحده

  const lines = t.split('\n');
  let first = lines[0].trim();
  let icon = '💬';
  const em = first.match(EMOJI_START);
  if (em) {
    icon = em[1];
    first = first.slice(em[0].length);
  } else if (ERR_RE.test(first)) icon = '⚠️';
  else if (OK_RE.test(first)) icon = '✅';

  const title = `│${icon}┊ ${HAS_MARK.test(first) || !first ? first : b(first)}`;
  const rest = lines.slice(1);

  const compact = t.length <= 600 && lines.length <= 14;
  if (compact) {
    const body = rest.map((l) => (l.trim() ? `│⌯ ${l.trim()}` : '│'));
    return [BAR, title, ...body, BAR, footer()].join('\n');
  }
  // رد طويل: عنوان في اطار والباقي زي ما هو
  return [BAR, title, BAR, ...rest, '', footer()].join('\n');
}

// الاوامر (.امر) جوه كود عشان تتنسخ بلمسة، بس لو بعدها مسافة او نهاية السطر
function codeCommands(text) {
  return text.replace(/(^|\s)(\.[\u0600-\u06FFA-Za-z][\u0600-\u06FFA-Za-z0-9_-]*)(?=\s|$)/g, (_, sp, cmd) => `${sp}${c(cmd)}`);
}

function decorate(text) {
  if (typeof text !== 'string') return text;
  return fancy(codeCommands(frame(text)));
}

module.exports = { b, i, s, c, m, q, BAR, fancy, frame, footer, decorate };
