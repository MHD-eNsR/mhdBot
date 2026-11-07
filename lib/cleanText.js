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
function wrapSocket(sock) {
  const original = sock.sendMessage.bind(sock);
  sock.sendMessage = (jid, content, ...rest) => original(jid, cleanContent(content), ...rest);
  return sock;
}

module.exports = { cleanText, cleanContent, wrapSocket };
