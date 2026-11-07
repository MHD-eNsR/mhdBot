const compliments = [
    "انت جامد على طبيعتك",
    "عندك حس فكاهة جامد",
    "انت حنين وطيب جدا",
    "انت اقوى مما تتخيل",
    "وجودك بينور المكان",
    "انت صاحب جدع بجد",
    "انت بتلهمني",
    "ابداعك ملوش حدود",
    "قلبك دهب",
    "انت بتفرق في الدنيا",
    "طاقتك الايجابية بتعدي لغيرك",
    "انت شغال بضمير وجهد كبير",
    "انت بتطلع احسن ما في الناس",
    "ضحكتك بتفرح اللي حواليك",
    "انت موهوب في كل حاجة بتعملها",
    "طيبتك بتخلي الدنيا احلى",
    "عندك نظرة مختلفة وجميلة",
    "حماسك بجد بيشجع",
    "انت قادر تعمل حاجات كبيرة",
    "انت دايما عارف تحسس اللي قدامك انه مميز",
    "ثقتك في نفسك تتحسد عليها",
    "روحك جميلة",
    "كرمك ملوش حدود",
    "عينك دقيقة في التفاصيل",
    "شغفك بيحمس بجد",
    "انت مستمع جامد",
    "انت اقوى مما انت فاكر",
    "ضحكتك بتعدي",
    "عندك موهبة طبيعية انك تحسس الناس بقيمتها",
    "مجرد وجودك بيخلي الدنيا احلى"
];

async function complimentCommand(sock, chatId, message) {
    try {
        if (!message || !chatId) {
            console.log('Invalid message or chatId:', { message, chatId });
            return;
        }

        let userToCompliment;
        
        // Check for mentioned users
        if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            userToCompliment = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        // Check for replied message
        else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToCompliment = message.message.extendedTextMessage.contextInfo.participant;
        }
        
        if (!userToCompliment) {
            await sock.sendMessage(chatId, { 
                text: 'منشن حد او رد على رسالته عشان تجاملو'
            });
            return;
        }

        const compliment = compliments[Math.floor(Math.random() * compliments.length)];

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

        await sock.sendMessage(chatId, { 
            text: `يا @${userToCompliment.split('@')[0]} ${compliment}`,
            mentions: [userToCompliment]
        });
    } catch (error) {
        console.error('Error in compliment command:', error);
        if (error.data === 429) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            try {
                await sock.sendMessage(chatId, { 
                    text: 'جرب تاني بعد كام ثانية'
                });
            } catch (retryError) {
                console.error('Error sending retry message:', retryError);
            }
        } else {
            try {
                await sock.sendMessage(chatId, { 
                    text: 'حصل خطأ وانا ببعت المجاملة'
                });
            } catch (sendError) {
                console.error('Error sending error message:', sendError);
            }
        }
    }
}

module.exports = { complimentCommand };
