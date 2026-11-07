const fs = require('fs');
const isOwnerOrSudo = require('../lib/isOwner');

const PMBLOCKER_PATH = './data/pmblocker.json';

function readState() {
    try {
        if (!fs.existsSync(PMBLOCKER_PATH)) return { enabled: false, message: 'الرسايل الخاصة مقفولة\nمينفعش تكلم البوت في الخاص كلم صاحب البوت في الجروبات بس' };
        const raw = fs.readFileSync(PMBLOCKER_PATH, 'utf8');
        const data = JSON.parse(raw || '{}');
        return {
            enabled: !!data.enabled,
            message: typeof data.message === 'string' && data.message.trim() ? data.message : 'الرسايل الخاصة مقفولة\nمينفعش تكلم البوت في الخاص كلم صاحب البوت في الجروبات بس'
        };
    } catch {
        return { enabled: false, message: 'الرسايل الخاصة مقفولة\nمينفعش تكلم البوت في الخاص كلم صاحب البوت في الجروبات بس' };
    }
}

function writeState(enabled, message) {
    try {
        if (!fs.existsSync('./data')) fs.mkdirSync('./data', { recursive: true });
        const current = readState();
        const payload = {
            enabled: !!enabled,
            message: typeof message === 'string' && message.trim() ? message : current.message
        };
        fs.writeFileSync(PMBLOCKER_PATH, JSON.stringify(payload, null, 2));
    } catch {}
}

async function pmblockerCommand(sock, chatId, message, args) {
    const senderId = message.key.participant || message.key.remoteJid;
    const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
    
    if (!message.key.fromMe && !isOwner) {
        await sock.sendMessage(chatId, { text: 'الامر ده لصاحب البوت بس' }, { quoted: message });
        return;
    }
    
    const argStr = (args || '').trim();
    const [sub, ...rest] = argStr.split(' ');
    const state = readState();

    if (!sub || !['on', 'off', 'status', 'setmsg'].includes(sub.toLowerCase())) {
        await sock.sendMessage(chatId, { text: 'منع الخاص لصاحب البوت بس\n\n.منعالخاص تشغيل  لتشغيل الحظر التلقائي في الخاص\n.منعالخاص ايقاف  لايقافه\n.منعالخاص حالة  لعرض الحالة\n.منعالخاص رسالة وبعدها النص  لتغيير رسالة التحذير' }, { quoted: message });
        return;
    }

    if (sub.toLowerCase() === 'status') {
        await sock.sendMessage(chatId, { text: `منع الخاص دلوقتي ${state.enabled ? 'شغال' : 'مقفول'}\nالرسالة ${state.message}` }, { quoted: message });
        return;
    }

    if (sub.toLowerCase() === 'setmsg') {
        const newMsg = rest.join(' ').trim();
        if (!newMsg) {
            await sock.sendMessage(chatId, { text: 'اكتب .منعالخاص رسالة وبعدها الرسالة' }, { quoted: message });
            return;
        }
        writeState(state.enabled, newMsg);
        await sock.sendMessage(chatId, { text: 'رسالة منع الخاص اتحدثت' }, { quoted: message });
        return;
    }

    const enable = sub.toLowerCase() === 'on';
    writeState(enable);
    await sock.sendMessage(chatId, { text: `منع الخاص دلوقتي ${enable ? 'شغال' : 'مقفول'}` }, { quoted: message });
}

module.exports = { pmblockerCommand, readState };


