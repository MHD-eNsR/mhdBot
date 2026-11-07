const fs = require('fs');

function readJsonSafe(path, fallback) {
    try {
        const txt = fs.readFileSync(path, 'utf8');
        return JSON.parse(txt);
    } catch (_) {
        return fallback;
    }
}

const isOwnerOrSudo = require('../lib/isOwner');

async function settingsCommand(sock, chatId, message) {
    try {
        const senderId = message.key.participant || message.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
        
        if (!message.key.fromMe && !isOwner) {
            await sock.sendMessage(chatId, { text: 'الامر ده لصاحب البوت بس' }, { quoted: message });
            return;
        }

        const isGroup = chatId.endsWith('@g.us');
        const dataDir = './data';

        const mode = readJsonSafe(`${dataDir}/messageCount.json`, { isPublic: true });
        const autoStatus = readJsonSafe(`${dataDir}/autoStatus.json`, { enabled: false });
        const autoread = readJsonSafe(`${dataDir}/autoread.json`, { enabled: false });
        const autotyping = readJsonSafe(`${dataDir}/autotyping.json`, { enabled: false });
        const pmblocker = readJsonSafe(`${dataDir}/pmblocker.json`, { enabled: false });
        const anticall = readJsonSafe(`${dataDir}/anticall.json`, { enabled: false });
        const userGroupData = readJsonSafe(`${dataDir}/userGroupData.json`, {
            antilink: {}, antibadword: {}, welcome: {}, goodbye: {}, chatbot: {}, antitag: {}
        });
        const autoReaction = Boolean(userGroupData.autoReaction);

        // Per-group features
        const groupId = isGroup ? chatId : null;
        const antilinkOn = groupId ? Boolean(userGroupData.antilink && userGroupData.antilink[groupId]) : false;
        const antibadwordOn = groupId ? Boolean(userGroupData.antibadword && userGroupData.antibadword[groupId]) : false;
        const welcomeOn = groupId ? Boolean(userGroupData.welcome && userGroupData.welcome[groupId]) : false;
        const goodbyeOn = groupId ? Boolean(userGroupData.goodbye && userGroupData.goodbye[groupId]) : false;
        const chatbotOn = groupId ? Boolean(userGroupData.chatbot && userGroupData.chatbot[groupId]) : false;
        const antitagCfg = groupId ? (userGroupData.antitag && userGroupData.antitag[groupId]) : null;

        const lines = [];
        lines.push('اعدادات البوت');
        lines.push('');
        lines.push(`الوضع ${mode.isPublic ? 'عام' : 'خاص'}`);
        lines.push(`مشاهدة الحالات ${autoStatus.enabled ? 'شغال' : 'مقفول'}`);
        lines.push(`القراءة التلقائية ${autoread.enabled ? 'شغال' : 'مقفول'}`);
        lines.push(`الكتابة التلقائية ${autotyping.enabled ? 'شغال' : 'مقفول'}`);
        lines.push(`منع الخاص ${pmblocker.enabled ? 'شغال' : 'مقفول'}`);
        lines.push(`منع المكالمات ${anticall.enabled ? 'شغال' : 'مقفول'}`);
        lines.push(`الرد التلقائي ${autoReaction ? 'شغال' : 'مقفول'}`);
        if (groupId) {
            lines.push('');
            lines.push(`الجروب ${groupId}`);
            if (antilinkOn) {
                const al = userGroupData.antilink[groupId];
                lines.push(`منع اللينكات شغال والاجراء ${al.action || 'delete'}`);
            } else {
                lines.push('منع اللينكات مقفول');
            }
            if (antibadwordOn) {
                const ab = userGroupData.antibadword[groupId];
                lines.push(`منع السب شغال والاجراء ${ab.action || 'delete'}`);
            } else {
                lines.push('منع السب مقفول');
            }
            lines.push(`الترحيب ${welcomeOn ? 'شغال' : 'مقفول'}`);
            lines.push(`الوداع ${goodbyeOn ? 'شغال' : 'مقفول'}`);
            lines.push(`الشات بوت ${chatbotOn ? 'شغال' : 'مقفول'}`);
            if (antitagCfg && antitagCfg.enabled) {
                lines.push(`منع المنشن شغال والاجراء ${antitagCfg.action || 'delete'}`);
            } else {
                lines.push('منع المنشن مقفول');
            }
        } else {
            lines.push('');
            lines.push('ملحوظة اعدادات الجروب بتظهر لما تستخدم الامر جوه جروب');
        }

        await sock.sendMessage(chatId, { text: lines.join('\n') }, { quoted: message });
    } catch (error) {
        console.error('Error in settings command:', error);
        await sock.sendMessage(chatId, { text: 'معرفتش اقرا الاعدادات' }, { quoted: message });
    }
}

module.exports = settingsCommand;


