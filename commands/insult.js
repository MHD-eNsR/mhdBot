const insults = [
    "انت زي السحابة لما بتختفي بيبقى يوم جميل",
    "بتفرح الكل اوي لما بتمشي من المكان",
    "كنت هوافقك بس كده احنا الاتنين هنبقى غلطانين",
    "انت مش غبي انت بس بخت التفكير وحش",
    "اسرارك في امان معايا انا اصلا مبسمعهاش",
    "انت دليل ان حتى التطور بياخد اجازة احيانا",
    "فيه حاجة على دقنك لا لا التالتة اللي تحت",
    "انت زي تحديث البرنامج كل ما اشوفك اقول هو انا محتاج ده دلوقتي",
    "بتفرح الكل وانت ماشي",
    "انت زي العملة الصغيرة وشين وقيمتك قليلة",
    "انت في دماغك حاجة لا استنى ولا حاجة",
    "انت السبب ان اتكتب تعليمات على علبة الشامبو",
    "انت زي السحابة بتتحرك من غير هدف",
    "نكتك زي اللبن الفاسد حامضة وتقيلة على المعدة",
    "انت زي الشمعة في الريح ملكش لازمة وقت الشدة",
    "عندك موهبة وهي انك بتضايق الكل بالتساوي",
    "انت زي شبكة الواي فاي بتضعف وقت ما نحتاجها",
    "انت دليل ان مش كل الناس محتاجة فلتر عشان تبان وحشة",
    "طاقتك زي الثقب الاسود بتسحب الحياة من المكان",
    "وشك مناسب للاذاعة",
    "انت زي زحمة المرور محدش عايزك بس انت موجود",
    "انت زي القلم المكسور ملوش لازمة",
    "افكارك اصلية اوي لدرجة اني سمعتها كلها قبل كده",
    "انت دليل حي ان حتى الاخطاء ممكن تبقى منتجة",
    "انت مش كسول انت بس متحمس اوي انك متعملش حاجة",
    "مخك شغال بويندوز 95 بطيء وقديم",
    "انت زي المطب مفيش حد بيحبك بس لازم الكل يتعامل معاك",
    "انت زي سرب البعوض مجرد ازعاج",
    "بتجمع الناس عشان يتكلموا عن قد ايه انت رخم"
];

async function insultCommand(sock, chatId, message) {
    try {
        if (!message || !chatId) {
            console.log('Invalid message or chatId:', { message, chatId });
            return;
        }

        let userToInsult;
        
        // Check for mentioned users
        if (message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.length > 0) {
            userToInsult = message.message.extendedTextMessage.contextInfo.mentionedJid[0];
        }
        // Check for replied message
        else if (message.message?.extendedTextMessage?.contextInfo?.participant) {
            userToInsult = message.message.extendedTextMessage.contextInfo.participant;
        }
        
        if (!userToInsult) {
            await sock.sendMessage(chatId, { 
                text: 'منشن حد او رد على رسالته عشان تهينو'
            });
            return;
        }

        const insult = insults[Math.floor(Math.random() * insults.length)];

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

        await sock.sendMessage(chatId, { 
            text: `يا @${userToInsult.split('@')[0]} ${insult}`,
            mentions: [userToInsult]
        });
    } catch (error) {
        console.error('Error in insult command:', error);
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
                    text: 'حصل خطأ وانا ببعت الاهانة'
                });
            } catch (sendError) {
                console.error('Error sending error message:', sendError);
            }
        }
    }
}

module.exports = { insultCommand };
