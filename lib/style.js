// زغرفة رسايل واتساب: *عريض* _مائل_ ~مشطوب~ `كود` ```مونو```
const b = (t) => `*${t}*`;
const i = (t) => `_${t}_`;
const s = (t) => `~${t}~`;
const c = (t) => '`' + t + '`';
const m = (t) => '```' + t + '```';
const q = (t) => `> ${t}`;

const BAR = '✠───•───〈✤〉───•───✠';

// هل النص فيه زغرفة جاهزة او كود او لينكات بس
function hasFormatting(t) {
  return /[*_~`]/.test(t) || /^https?:\/\/\S+$/i.test(t.trim());
}

const ERR_RE = /^(معرفتش|حصل خطأ|حصل خطا|فشل|مقدرتش|مش قادر|غلط|الامر ده|لازم)/;
const OK_RE = /^(تم|اتفتح|اتقفل|اتشغل|اتحذف|اتمسح|اتطرد|اتغير|اتحفظ|اتضاف)/;

// زغرفة الرسايل العادية: اول سطر عريض + ايموجي حالة + الاوامر جوه كود
function decorate(text) {
  if (typeof text !== 'string') return text;
  const t = text.trim();
  if (!t || t.length > 600 || hasFormatting(t)) return text;
  const lines = t.split('\n');
  if (lines.length > 14) return text;

  let first = lines[0].trim();
  if (ERR_RE.test(first)) first = '⚠️ ' + first;
  else if (OK_RE.test(first)) first = '✅ ' + first;
  lines[0] = b(first);

  const out = lines
    .join('\n')
    .replace(/(^|\s)(\.[\u0600-\u06FFA-Za-z][\u0600-\u06FFA-Za-z0-9_-]*)/g, (_, sp, cmd) => `${sp}${c(cmd)}`);
  return out;
}

module.exports = { b, i, s, c, m, q, BAR, decorate, hasFormatting };
