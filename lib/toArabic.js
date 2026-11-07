// بيترجم اي نص جاي من خدمات خارجية للعربي
// لو الترجمة فشلت بيرجع النص الاصلي زي ما هو
const axios = require('axios');

async function toArabic(text) {
  if (typeof text !== 'string' || !text.trim()) return text;
  if (/[\u0600-\u06FF]/.test(text)) return text; // عربي اصلا
  try {
    const res = await axios.get('https://translate.googleapis.com/translate_a/single', {
      params: { client: 'gtx', sl: 'auto', tl: 'ar', dt: 't', q: text },
      timeout: 8000,
    });
    const parts = res.data && res.data[0];
    if (!Array.isArray(parts)) return text;
    const out = parts.map((p) => (p && p[0]) || '').join('');
    return out || text;
  } catch (e) {
    return text;
  }
}

module.exports = { toArabic };
