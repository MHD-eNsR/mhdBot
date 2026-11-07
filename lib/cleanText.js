// طبقة الرسايل الطالعة
// الغينا فلتر علامات الترقيم: الرسايل بتتبعت بعلاماتها والايموجي زي ما هي
// وبدل كده بنزغرف الرسايل العادية بزغرفات واتساب (lib/style.js)
// لو الرسالة فيها __noclean او __raw بتتبعت زي ما هي من غير زغرفة

const { decorate, fancy } = require('./style');

function cleanText(text) {
  return text;
}

function cleanContent(content) {
  if (!content || typeof content !== 'object') return content;
  const c = { ...content };
  const raw = c.__noclean === true || c.__raw === true;
  delete c.__noclean;
  delete c.__raw;
  if (raw) return c;
  // __noframe: من غير اطار بس بالخط المميز للانجليزي
  const fn = c.__noframe === true ? fancy : decorate;
  delete c.__noframe;
  if (typeof c.text === 'string') c.text = fn(c.text);
  if (typeof c.caption === 'string') c.caption = fn(c.caption);
  return c;
}

// بيلف sendMessage بتاع السوكيت
// رسايل رفض الصلاحيات: لما البوت يبعتها بنعمل ⛔ ريأكشن على رسالة الامر
const DENY_RE = /للادمنز|لصاحب البوت|للمالك|المساعدين بس|خلي البوت ادمن|انت محظور/;
const denied = new Set();

function wrapSocket(sock) {
  const original = sock.sendMessage.bind(sock);
  sock.sendMessage = (jid, content, ...rest) => {
    try {
      const key = rest[0]?.quoted?.key;
      if (key && typeof content?.text === 'string' && DENY_RE.test(content.text) && !denied.has(key.id)) {
        denied.add(key.id);
        if (denied.size > 500) denied.clear();
        original(jid, { react: { text: '⛔', key } }).catch(() => {});
      }
    } catch (e) {
      // مش مهم
    }
    return original(jid, cleanContent(content), ...rest);
  };
  return sock;
}

module.exports = { cleanText, cleanContent, wrapSocket };
