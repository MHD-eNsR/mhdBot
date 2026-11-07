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
// رسايل رفض الصلاحيات: ⛔ ريأكشن + رسالة بشكل "قناة معاد توجيهها" وبطاقة رابط البوت
const fs = require('fs');
const path = require('path');

const DENY_RE = /للادمنز|لصاحب البوت|للمالك|المساعدين بس|خلي البوت ادمن|انت محظور/;
const denied = new Set();

const NEWSLETTER_JID = '120363189338764144@newsletter';
const NEWSLETTER_NAME = 'MHD dev';
const REPO_URL = 'https://github.com/MHD-eNsR/mhdBot';

let thumb;
function getThumb() {
  if (thumb !== undefined) return thumb;
  try {
    thumb = fs.readFileSync(path.join(__dirname, '../assets/bot_image.jpg'));
  } catch (e) {
    thumb = null;
  }
  return thumb;
}

// اسم الامر من رسالة المستخدم المقتبسة (بعد الترجمة الداخلية بيبقى عربي)
function commandName(quoted) {
  const m = quoted?.message;
  const t = m?.conversation || m?.extendedTextMessage?.text || m?.imageMessage?.caption || m?.videoMessage?.caption || '';
  const first = String(t).trim().split(/\s+/)[0] || '';
  return first.startsWith('.') ? first.slice(1) : '';
}

// نص الرفض حسب نوعه
function denyText(kind, name) {
  const cmd = name ? `${name} ` : 'ده ';
  if (kind === 'botadmin') return `لازم البوت يبقى مشرف في الجروب عشان ينفذ الامر ${cmd}💀`;
  if (kind === 'owner') return `الامر ${cmd}حصري لصاحب البوت والمساعدين 💀`;
  if (kind === 'banned') return `انت محظور من استخدام البوت 💀`;
  return `الامر ${cmd}حصري لمشرفي المجموعة 💀`;
}

function denyKind(text) {
  if (/خلي البوت ادمن/.test(text)) return 'botadmin';
  if (/انت محظور/.test(text)) return 'banned';
  if (/للادمنز/.test(text)) return 'admin';
  return 'owner';
}

function denyContext(extra) {
  const ctx = {
    ...(extra || {}),
    forwardingScore: 1,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: NEWSLETTER_JID,
      newsletterName: NEWSLETTER_NAME,
      serverMessageId: -1,
    },
    externalAdReply: {
      title: fancy('MHDBOT'),
      body: fancy('BY MHD'),
      mediaType: 1,
      renderLargerThumbnail: false,
      showAdAttribution: false,
      sourceUrl: REPO_URL,
      ...(getThumb() ? { thumbnail: getThumb() } : {}),
    },
  };
  return ctx;
}

function wrapSocket(sock) {
  const original = sock.sendMessage.bind(sock);
  sock.sendMessage = (jid, content, ...rest) => {
    try {
      const quoted = rest[0]?.quoted;
      const key = quoted?.key;
      if (key && typeof content?.text === 'string' && DENY_RE.test(content.text)) {
        if (!denied.has(key.id)) {
          denied.add(key.id);
          if (denied.size > 500) denied.clear();
          original(jid, { react: { text: '⛔', key } }).catch(() => {});
        }
        const kind = denyKind(content.text);
        const newContent = {
          ...content,
          text: denyText(kind, commandName(quoted)),
          contextInfo: denyContext(content.contextInfo),
          __raw: true,
        };
        return original(jid, cleanContent(newContent), ...rest);
      }
    } catch (e) {
      // مش مهم
    }
    return original(jid, cleanContent(content), ...rest);
  };
  return sock;
}

module.exports = { cleanText, cleanContent, wrapSocket };
