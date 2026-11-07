const axios = require('axios');
const settings = require('../settings'); // Assuming the API key is stored here

async function gifCommand(sock, chatId, query) {
    const apiKey = settings.giphyApiKey; // Replace with your Giphy API Key

    if (!query) {
        await sock.sendMessage(chatId, { text: 'اكتب كلمة البحث عن الجيف' });
        return;
    }

    try {
        const response = await axios.get(`https://api.giphy.com/v1/gifs/search`, {
            params: {
                api_key: apiKey,
                q: query,
                limit: 1,
                rating: 'g'
            }
        });

        const gifUrl = response.data.data[0]?.images?.downsized_medium?.url;

        if (gifUrl) {
            await sock.sendMessage(chatId, { video: { url: gifUrl }, caption: `دي الجيف بتاعتك ${query}` });
        } else {
            await sock.sendMessage(chatId, { text: 'مفيش جيفات للكلمة دي' });
        }
    } catch (error) {
        console.error('Error fetching GIF:', error);
        await sock.sendMessage(chatId, { text: 'معرفتش اجيب الجيف جرب تاني بعد شوية' });
    }
}

module.exports = gifCommand;
