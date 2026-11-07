const os = require('os');
const settings = require('../settings.js');
const { b, i, c } = require('../lib/style');

function formatTime(seconds) {
    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds = seconds % (24 * 60 * 60);
    const hours = Math.floor(seconds / (60 * 60));
    seconds = seconds % (60 * 60);
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);

    let time = '';
    if (days > 0) time += `${days} يوم `;
    if (hours > 0) time += `${hours} ساعة `;
    if (minutes > 0) time += `${minutes} دقيقة `;
    if (seconds > 0 || time === '') time += `${seconds} ثانية`;

    return time.trim();
}

async function pingCommand(sock, chatId, message) {
    try {
        const start = Date.now();
        await sock.sendMessage(chatId, { text: '🏓', __raw: true }, { quoted: message });
        const end = Date.now();
        const ping = Math.round((end - start) / 2);
        const uptimeFormatted = formatTime(process.uptime());

        const botInfo = [
            `🏓 ${b('بنج:')} ${c(ping + 'ms')}`,
            `⏱️ ${b('مدة التشغيل:')} ${i(uptimeFormatted)}`,
            `⚙️ ${b('الاصدار:')} ${c('v' + settings.version)}`,
            `👑 ${b('المطور:')} ${settings.botOwner || 'MHD'}`
        ].join('\n');

        await sock.sendMessage(chatId, { text: botInfo }, { quoted: message });
    } catch (error) {
        console.error('Error in ping command:', error);
        await sock.sendMessage(chatId, { text: 'معرفتش اجيب حالة البوت' });
    }
}

module.exports = pingCommand;
