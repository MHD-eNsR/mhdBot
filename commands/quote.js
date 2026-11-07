const { toArabic } = require('../lib/toArabic');
const fetch = require('node-fetch');

// اقتباسات وحكم عربي محلية (بتتستخدم لو الخدمة الخارجية او الترجمة فشلت)
const QUOTES = [
    'اللي بيبدأ ماشي بيوصل ولو بعد حين',
    'الصبر مفتاح الفرج',
    'اللي مالوش خير في نفسه مالوش خير في غيره',
    'الوقت زي السيف لو مقطعتوش قطعك',
    'ابتسم فالحياة اقصر من انك تضيعها في الزعل',
    'اللي يزرع خير يحصد خير',
    'الصديق وقت الضيق',
    'مفيش مستحيل مع الاصرار',
    'الغلطة اللي بتتعلم منها مش غلطة',
    'كل تأخيرة وفيها خيرة',
    'اللي ملوش ماضي ملوش مستقبل',
    'خليك قد كلمتك واللي وعدت بيه نفذه',
    'القناعة كنز لا يفنى',
    'ابدأ من حيث انت واستخدم اللي معاك وافعل اللي تقدر عليه',
    'الحلم من غير عمل وهم والعمل من غير حلم تعب',
    'الكلمة الطيبة صدقة',
    'اللي يعرف قيمة نفسه ميقللش من قيمة غيره',
    'النجاح مش نهاية الطريق والفشل مش نهاية الدنيا',
    'اتعلم من امبارح وعيش النهاردة وامل في بكرة',
    'الراحة الحقيقية في رضا القلب',
    'مين جد وجد ومين زرع حصد',
    'خليك طيب بس متبقاش ساذج',
    'التواضع بيرفع صاحبه',
    'كل شيء بيبدأ بخطوة',
    'العقل زينة والادب اجمل ما فيه',
    'لا تأجل عمل اليوم لبكرة',
    'القوي مش اللي بيغلب الناس القوي اللي بيغلب نفسه',
    'الحياة مش بتدي كل حاجة مرة واحدة',
    'اللي صبر نال',
    'ما ضاع حق وراه مطالب',
];

const hasArabic = (t) => /[\u0600-\u06FF]/.test(t || '');

module.exports = async function quoteCommand(sock, chatId, message) {
    let quoteMessage = '';
    try {
        // الخدمة الخارجية بتدي اقتباس انجليزي، بنترجمه وبنتأكد انه اتحول لعربي فعلا
        const res = await fetch('https://shizoapi.onrender.com/api/texts/quotes?apikey=shizo', { timeout: 8000 });
        if (res.ok) {
            const json = await res.json();
            const translated = await toArabic(json.result);
            if (hasArabic(translated)) quoteMessage = translated;
        }
    } catch (error) {
        console.error('Error in quote command:', error?.message || error);
    }

    // لو مفيش نتيجة عربي، بنستخدم القايمة المحلية
    if (!quoteMessage) quoteMessage = QUOTES[Math.floor(Math.random() * QUOTES.length)];

    await sock.sendMessage(chatId, { text: `💬 *اقتباس*\n${quoteMessage}` }, { quoted: message });
};
