const { toArabic } = require('../lib/toArabic');
const axios = require('axios');

module.exports = async function (sock, chatId) {
    try {
        const apiKey = 'dcd720a6f1914e2d9dba9790c188c08c';  // Replace with your NewsAPI key
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
        const articles = response.data.articles.slice(0, 5); // Get top 5 articles
        let newsMessage = 'اخر الاخبار\n\n';
        for (let index = 0; index < articles.length; index++) {
            const article = articles[index];
            const title = await toArabic(article.title || '');
            const description = await toArabic(article.description || '');
            newsMessage += `${index + 1} ${title}\n${description}\n\n`;
        }
        await sock.sendMessage(chatId, { text: newsMessage });
    } catch (error) {
        console.error('Error fetching news:', error);
        await sock.sendMessage(chatId, { text: 'معرفتش اجيب الاخبار دلوقتي' });
    }
};
