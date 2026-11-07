// بدل ما البوت يبعت ايموجي في رسالة، بيعمل ريأكشن على رسالة المستخدم
const { COMMANDS, ENGLISH_OF } = require('./arabic');

// ايموجي كل قسم (بنفس ترتيب اقسام المنيو)
const SECTION_ICONS = ['🌐', '🛡️', '👑', '🖼️', '🎮', '🤖', '🎭', '✍️', '📥', '🎨', '🌸', '📢'];

const MAP = {
  // عامة
  menu: '📜', help: '📜', ping: '🏓', alive: '💚', tts: '🗣️', owner: '👑', joke: '😂', quote: '💬',
  fact: '💡', weather: '🌦️', news: '📰', attp: '✨', lyrics: '🎵', '8ball': '🎱', groupinfo: 'ℹ️',
  staff: '👮', admins: '👮', vv: '👀', vv2: '👀', trt: '🌐', translate: '🌐', ss: '📸', jid: '🆔',
  url: '🔗', repo: '📦', newsletter: '📢', surrender: '🏳️', sc: '📦', script: '📦', github: '📦',
  // جروب
  ban: '🚫', unban: '✅', promote: '⬆️', demote: '⬇️', mute: '🔇', unmute: '🔊', delete: '🗑️', del: '🗑️',
  kick: '👢', warnings: '⚠️', warn: '⚠️', antilink: '🔗', antibadword: '🤬', clear: '🧹', tag: '📣',
  tagall: '📢', tagnotadmin: '📣', hidetag: '🫥', chatbot: '🤖', resetlink: '🔄', antitag: '🏷️',
  antibot: '🛡️', nobot: '🛡️', welcome: '👋', goodbye: '👋', setgdesc: '📝', setgname: '✏️', setgpp: '🖼️',
  groupstatus: '📊', togstatus: '📊', swgc: '📊', gstatus: '📊', gs: '📊',
  // اونر
  mode: '⚙️', clearsession: '🧹', cleartmp: '🧹', antidelete: '🛡️', update: '🔄', settings: '⚙️',
  setpp: '🖼️', autoreact: '😎', areact: '😎', autostatus: '👁️', savestatus: '💾', savesm: '💾', savest: '💾',
  autotyping: '⌨️', autoread: '👁️', anticall: '📵', pmblocker: '🚷', setmention: '📣', mention: '📣', sudo: '👑',
  // صور وملصقات
  blur: '🌫️', simage: '🖼️', sticker: '🎟️', s: '🎟️', removebg: '✂️', remini: '✨', crop: '✂️', tgsticker: '🎟️',
  meme: '😹', take: '🎟️', emojimix: '🧪', igs: '📸', igsc: '📸', pies: '🖼️',
  // العاب
  tictactoe: '⭕', ttt: '⭕', move: '🎯', hangman: '🔤', guess: '🔤', trivia: '❓', answer: '✅', truth: '🫣', dare: '😈',
  // ذكاء اصطناعي
  ai: '🤖', gpt: '🧠', gemini: '✨', imagine: '🎨', flux: '🎨', sora: '🎬',
  // تسلية
  compliment: '💐', insult: '😤', flirt: '😍', shayari: '📜', goodnight: '🌙', roseday: '🌹', character: '🎭',
  wasted: '💀', ship: '💞', simp: '🥺', stupid: '🤪',
  // خطوط
  metallic: '⚙️', ice: '🧊', snow: '❄️', impressive: '🌟', matrix: '💻', light: '💡', neon: '🌈', devil: '😈',
  purple: '💜', thunder: '⚡', leaves: '🍃', '1917': '🎞️', arena: '🏟️', hacker: '🕶️', sand: '🏖️',
  blackpink: '🖤', glitch: '📺', fire: '🔥',
  // تحميل
  play: '🎧', song: '🎵', spotify: '🟢', instagram: '📸', ig: '📸', facebook: '📘', fb: '📘', twitter: '🐦',
  tiktok: '🎶', video: '🎬', music: '🎼', ytmp3: '🎵', ytmp4: '🎬',
  // متنوعة
  heart: '❤️', horny: '🥵', circle: '⭕', lgbt: '🏳️‍🌈', lolice: '🚔', simpcard: '🪪', tonikawa: '🌸',
  'its-so-stupid': '🤪', namecard: '🪪', oogway: '🐢', oogway2: '🐢', tweet: '🐦', ytcomment: '💬',
  comrade: '🫡', gay: '🌈', glass: '🔍', jail: '⛓️', passed: '🏆', triggered: '😡',
  // انمي
  animu: '🌸', nom: '😋', poke: '👉', cry: '😭', kiss: '💋', pat: '🤗', hug: '🫂', wink: '😉', facepalm: '🤦',
  animuquote: '📖',
};

const KNOWN = new Set([...Object.keys(MAP), ...Object.values(COMMANDS)]);

// بيرجع ايموجي مناسب للرسالة او null لو مش امر معروف
function emojiFor(userMessage) {
  const m = /^\.(\S+)\s*(.*)$/.exec(userMessage || '');
  if (!m) return null;
  // الاسم الداخلي عربي، والجدول تحت بالاسم الانجليزي
  const cmd = (ENGLISH_OF[m[1]] || m[1]).toLowerCase();
  if (cmd === 'menusec') {
    const n = parseInt(m[2], 10);
    return SECTION_ICONS[n - 1] || '📑';
  }
  if (MAP[cmd]) return MAP[cmd];
  return KNOWN.has(cmd) ? '⚡' : null;
}

// بيعمل ريأكشن على رسالة المستخدم، ومبيوقفش الامر لو فشل
async function reactForCommand(sock, chatId, message, userMessage) {
  const emoji = emojiFor(userMessage);
  if (!emoji || !message?.key) return;
  try {
    await sock.sendMessage(chatId, { react: { text: emoji, key: message.key } });
  } catch (e) {
    // الريأكشن مش مهم لدرجة يوقف الامر
  }
}

// ⛔ لما الامر مش هيتنفذ بسبب الصلاحيات (وضع خاص، محظور، مش ادمن...)
async function denyReact(sock, chatId, message, userMessage) {
  if (!message?.key || !emojiFor(userMessage)) return;
  try {
    await sock.sendMessage(chatId, { react: { text: '⛔', key: message.key } });
  } catch (e) {
    // مش مهم
  }
}

module.exports = { emojiFor, reactForCommand, denyReact, SECTION_ICONS };
