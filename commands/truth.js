const { toArabic } = require('../lib/toArabic');
const fetch = require('node-fetch');

async function truthCommand(sock, chatId, message) {
    try {
        const shizokeys = 'shizo';
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/truth?apikey=${shizokeys}`);
        
        if (!res.ok) {
            throw await res.text();
        }
        
        const json = await res.json();
        const truthMessage = await toArabic(json.result);

        // Send the truth message
        await sock.sendMessage(chatId, { text: truthMessage }, { quoted: message });
    } catch (error) {
        console.error('Error in truth command:', error);
        await sock.sendMessage(chatId, { text: 'معرفتش اجيب سؤال صراحة جرب تاني بعد شوية' }, { quoted: message });
    }
}

module.exports = { truthCommand };
