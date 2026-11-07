const settings = require('../settings');
const { addSudo, removeSudo, getSudoList } = require('../lib/index');
const isOwnerOrSudo = require('../lib/isOwner');

function extractMentionedJid(message) {
    const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentioned.length > 0) return mentioned[0];
    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const match = text.match(/\b(\d{7,15})\b/);
    if (match) return match[1] + '@s.whatsapp.net';
    return null;
}

async function sudoCommand(sock, chatId, message) {
    const senderJid = message.key.participant || message.key.remoteJid;
    const isOwner = message.key.fromMe || await isOwnerOrSudo(senderJid, sock, chatId);

    const rawText = message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const args = rawText.trim().split(' ').slice(1);
    const sub = (args[0] || '').toLowerCase();

    if (!sub || !['add', 'del', 'remove', 'list'].includes(sub)) {
        await sock.sendMessage(chatId, { text: 'طريقة الاستخدام\n.مساعد اضافة وبعدها منشن او رقم\n.مساعد حذف وبعدها منشن او رقم\n.مساعد قائمة' },{quoted :message});
        return;
    }

    if (sub === 'list') {
        const list = await getSudoList();
        if (list.length === 0) {
            await sock.sendMessage(chatId, { text: 'مفيش مساعدين متضافين' },{quoted :message});
            return;
        }
        const text = list.map((j, i) => `${i + 1}. ${j}`).join('\n');
        await sock.sendMessage(chatId, { text: `المساعدين\n${text}` },{quoted :message});
        return;
    }

    if (!isOwner) {
        await sock.sendMessage(chatId, { text: 'صاحب البوت بس يقدر يضيف او يشيل مساعدين استخدم .مساعد قائمة عشان تشوفهم' },{quoted :message});
        return;
    }

    const targetJid = extractMentionedJid(message);
    if (!targetJid) {
        await sock.sendMessage(chatId, { text: 'منشن شخص او اكتب رقم' },{quoted :message});
        return;
    }

    if (sub === 'add') {
        const ok = await addSudo(targetJid);
        await sock.sendMessage(chatId, { text: ok ? `تم اضافة المساعد ${targetJid}` : 'معرفتش اضيف المساعد' },{quoted :message});
        return;
    }

    if (sub === 'del' || sub === 'remove') {
        const ownerJid = settings.ownerNumber + '@s.whatsapp.net';
        if (targetJid === ownerJid) {
            await sock.sendMessage(chatId, { text: 'مينفعش تشيل صاحب البوت' },{quoted :message});
            return;
        }
        const ok = await removeSudo(targetJid);
        await sock.sendMessage(chatId, { text: ok ? `تم حذف المساعد ${targetJid}` : 'معرفتش احذف المساعد' },{quoted :message});
        return;
    }
}

module.exports = sudoCommand;


