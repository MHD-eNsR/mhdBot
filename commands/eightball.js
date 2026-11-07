const eightBallResponses = [
    "ايوه اكيد",
    "مستحيل",
    "اسأل تاني بعدين",
    "اكيد طبعا",
    "احتمال ضعيف جدا",
    "من غير شك",
    "ردي لأ",
    "الاشارات بتقول ايوه"
];

async function eightBallCommand(sock, chatId, question) {
    if (!question) {
        await sock.sendMessage(chatId, { text: 'اكتب سؤالك' });
        return;
    }

    const randomResponse = eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)];
    await sock.sendMessage(chatId, { text: `${randomResponse}` });
}

module.exports = { eightBallCommand };
