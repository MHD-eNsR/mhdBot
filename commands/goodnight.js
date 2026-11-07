const { toArabic } = require('../lib/toArabic');
const fetch = require('node-fetch');

async function goodnightCommand(sock, chatId, message) {
    try {
        const shizokeys = 'shizo';
        const res = await fetch(`https://shizoapi.onrender.com/api/texts/lovenight?apikey=${shizokeys}`);
        
        if (!res.ok) {
            throw await res.text();
        }
        
        const json = await res.json();
        const goodnightMessage = await toArabic(json.result);

        // Send the goodnight message
        await sock.sendMessage(chatId, { text: goodnightMessage }, { quoted: message });
    } catch (error) {
        console.error('Error in goodnight command:', error);
        await sock.sendMessage(chatId, { text: 'معرفتش اجيب رسالة تصبح على خير جرب تاني بعد شوية' }, { quoted: message });
    }
}

module.exports = { goodnightCommand }; 