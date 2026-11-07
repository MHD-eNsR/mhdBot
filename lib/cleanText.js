// فلتر الرسايل الطالعة
// بيشيل علامات الترقيم اللي في الجمل بس زي النقطة والفاصلة وعلامة الاستفهام والتعجب
// وبيسيب الزخرفة والرموز والايموجي والاوامر واللينكات والمنشن والارقام زي ما هي
// لو الرسالة فيها __noclean بتتبعت زي ما هي من غير اي تعديل

const URL_RE = /(?:https?:\/\/|www\.)[^\s]*[^\s.,;:!?)\]}"'،؟]/gi;
const SENTENCE_PUNCT = new Set(['.', ',', ';', ':', '!', '?', '،', '؛', '؟', '…', '。', '！', '？']);
const AN_RE = /[\p{L}\p{N}]/u;
const DIGIT_RE = /\p{N}/u;

function cleanText(text) {
  if (typeof text !== 'string' || !text) return text;

  const urls = [];
  const t = text.replace(URL_RE, (m) => {
    urls.push(m);
    return '\uE000' + (urls.length - 1) + '\uE001';
  });

  const chars = Array.from(t);
  let out = '';
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    if (!SENTENCE_PUNCT.has(c)) { out += c; continue; }

    const prev = chars[i - 1] || '\n';
    const next = chars[i + 1] || '\n';
    const prevAN = AN_RE.test(prev);
    const nextAN = AN_RE.test(next);

    // نقطة جوه رقم او اسم ملف او بادئة امر
    if (c === '.' && ((prevAN && nextAN) || (/\s/.test(prev) && nextAN))) { out += c; continue; }
    // وقت او تاريخ او رقم كبير
    if ((c === ':' || c === ',') && DIGIT_RE.test(prev) && DIGIT_RE.test(next)) { out += c; continue; }

    out += ' ';
  }

  out = out.replace(/\uE000(\d+)\uE001/g, (_, n) => urls[Number(n)] || '');
  out = out
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').replace(/\s+$/, ''))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return out || text;
}

function cleanContent(content) {
  if (!content || typeof content !== 'object') return content;
  const c = { ...content };
  const raw = c.__noclean === true;
  delete c.__noclean;
  if (raw) return c;
  if (typeof c.text === 'string') c.text = cleanText(c.text);
  if (typeof c.caption === 'string') c.caption = cleanText(c.caption);
  return c;
}

// بيلف sendMessage بتاع السوكيت
function wrapSocket(sock) {
  const original = sock.sendMessage.bind(sock);
  sock.sendMessage = (jid, content, ...rest) => original(jid, cleanContent(content), ...rest);
  return sock;
}

module.exports = { cleanText, cleanContent, wrapSocket };
