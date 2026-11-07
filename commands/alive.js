const settings = require("../settings");
async function aliveCommand(sock, chatId, message) {
    try {
        const message1 = `البوت شغال\n\n` +
                       `الاصدار ${settings.version}\n` +
                       `الحالة اونلاين\n` +
                       `الوضع عام\n\n` +
                       `المميزات\n` +
                       `ادارة الجروبات\n` +
                       `حماية من اللينكات\n` +
                       `اوامر تسلية\n` +
                       `وحاجات تانية كتير\n\n` +
                       `اكتب .المنيو عشان تشوف كل الاوامر`;

        await sock.sendMessage(chatId, {
            text: message1,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363189338764144@newsletter',
                    newsletterName: 'MHD dev',
                    serverMessageId: -1
                }
            }
        }, { quoted: message });
    } catch (error) {
        console.error('Error in alive command:', error);
        await sock.sendMessage(chatId, { text: 'البوت شغال تمام' }, { quoted: message });
    }
}

module.exports = aliveCommand;