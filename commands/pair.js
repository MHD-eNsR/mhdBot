const axios = require('axios');
const { sleep } = require('../lib/myfunc');

async function pairCommand(sock, chatId, message, q) {
    try {
        if (!q) {
            return await sock.sendMessage(chatId, {
                text: "اكتب رقم واتساب صحيح\nمثال .pair 20100XXXXXXX",
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363189338764144@newsletter',
                        newsletterName: 'MHD dev',
                        serverMessageId: -1
                    }
                }
            });
        }

        const numbers = q.split(',')
            .map((v) => v.replace(/[^0-9]/g, ''))
            .filter((v) => v.length > 5 && v.length < 20);

        if (numbers.length === 0) {
            return await sock.sendMessage(chatId, {
                text: "الرقم غلط اكتبه بالصيغة الصح",
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363189338764144@newsletter',
                        newsletterName: 'MHD dev',
                        serverMessageId: -1
                    }
                }
            });
        }

        for (const number of numbers) {
            const whatsappID = number + '@s.whatsapp.net';
            const result = await sock.onWhatsApp(whatsappID);

            if (!result[0]?.exists) {
                return await sock.sendMessage(chatId, {
                    text: `الرقم ده مش مسجل على واتساب`,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363189338764144@newsletter',
                            newsletterName: 'MHD dev',
                            serverMessageId: -1
                        }
                    }
                });
            }

            await sock.sendMessage(chatId, {
                text: "استنى شوية لحد ما الكود يجهز",
                contextInfo: {
                    forwardingScore: 1,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363189338764144@newsletter',
                        newsletterName: 'MHD dev',
                        serverMessageId: -1
                    }
                }
            });

            try {
                const response = await axios.get(`https://knight-bot-paircode.onrender.com/code?number=${number}`);
                
                if (response.data && response.data.code) {
                    const code = response.data.code;
                    if (code === "الخدمة مش متاحة") {
                        throw new Error('Service Unavailable');
                    }
                    
                    await sleep(5000);
                    await sock.sendMessage(chatId, {
                        text: `كود الربط بتاعك ${code}`,
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363189338764144@newsletter',
                                newsletterName: 'MHD dev',
                                serverMessageId: -1
                            }
                        }
                    });
                } else {
                    throw new Error('Invalid response from server');
                }
            } catch (apiError) {
                console.error('API Error:', apiError);
                const errorMessage = apiError.message === 'الخدمة مش متاحة' 
                    ? "الخدمة مش متاحة دلوقتي جرب تاني بعد شوية"
                    : "معرفتش اعمل كود الربط جرب تاني بعد شوية";
                
                await sock.sendMessage(chatId, {
                    text: errorMessage,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363189338764144@newsletter',
                            newsletterName: 'MHD dev',
                            serverMessageId: -1
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error(error);
        await sock.sendMessage(chatId, {
            text: "حصل خطأ جرب تاني بعد شوية",
            contextInfo: {
                forwardingScore: 1,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363189338764144@newsletter',
                    newsletterName: 'MHD dev',
                    serverMessageId: -1
                }
            }
        });
    }
}

module.exports = pairCommand; 