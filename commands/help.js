const settings = require('../settings');
const fs = require('fs');
const path = require('path');
const { COMMANDS } = require('../lib/arabic');
const buttons = require('../lib/buttons');
const { b, i, c, BAR, fancy, footer } = require('../lib/style');

const NEWSLETTER_JID = '120363189338764144@newsletter';
const NEWSLETTER_NAME = 'MHD dev';

function formatUptime(sec) {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(Math.floor(sec % 60)).padStart(2, '0');
    return `${h}:${m}:${s}`;
}

// الاقسام بنفس شكل قايمة البوت
const SECTIONS = [
    ['🌐', 'الاوامر العامة', [
        '.المنيو', '.بنج', '.شغال', '.انطق نص', '.المالك', '.نكتة', '.اقتباس', '.معلومة',
        '.الطقس مدينة', '.اخبار', '.متحرك نص', '.كلمات اسم الاغنية', '.كورة سؤال',
        '.الجروب', '.الادمنز', '.فتح', '.ترجم نص كود_اللغة', '.سكرين لينك', '.الايدي', '.رابط',
    ]],
    ['🛡️', 'ادارة الجروب', [
        '.حظر', '.فك-حظر', '.رقي', '.نزل', '.اسكت دقايق', '.اتكلم', '.امسح عدد', '.اطرد',
        '.انذار', '.انذارات', '.منع-لينك', '.منع-سب', '.منع-منشن', '.منع-بوت', '.نضف',
        '.منشن', '.منشن-الكل', '.منشن-الاعضاء', '.منشن-خفي', '.شات', '.لينك-جديد',
        '.ترحيب', '.وداع', '.وصف-الجروب', '.اسم-الجروب', '.صورة-الجروب', '.حالة-الجروب',
    ]],
    ['👑', 'صاحب البوت', [
        '.الوضع عام او خاص', '.تنضيف-السيشن', '.منع-مسح', '.تنضيف-المؤقت', '.تحديث', '.الاعدادات',
        '.صورة-البوت', '.رد-تلقائي', '.مشاهدة-الحالات', '.حفظ-الحالات', '.كتابة-تلقائية',
        '.قراءة-تلقائية', '.منع-مكالمات', '.منع-الخاص', '.ضبط-المنشن', '.منشن-البوت', '.مساعد',
    ]],
    ['🖼️', 'صور وملصقات', [
        '.ملصق', '.لصورة', '.بلور', '.شيل-الخلفية', '.حسن-الصورة', '.قص', '.ملصق-تليجرام لينك',
        '.ميمز', '.خد-ملصق', '.دمج-ايموجي', '.انستا-ستوري لينك', '.انستا-سكرين لينك',
        '.صور البلد', '.صين', '.اندونيسيا', '.يابان', '.كوريا',
    ]],
    ['🎮', 'العاب', [
        '.اكس-او @شخص', '.المشنقة', '.خمن حرف', '.سؤال', '.اجابة', '.صراحة', '.تحدي',
    ]],
    ['🤖', 'ذكاء اصطناعي', [
        '.ذكاء سؤال', '.جيبيتي سؤال', '.جيميني سؤال', '.تخيل وصف', '.فلاكس وصف', '.سورا وصف',
    ]],
    ['🎭', 'تسلية', [
        '.مجاملة @شخص', '.اهانة @شخص', '.غزل', '.شعر', '.تصبح-على-خير', '.وردة', '.شخصية @شخص',
        '.ضايع @شخص', '.حب @شخص', '.سمب @شخص', '.غبي @شخص نص',
    ]],
    ['✍️', 'كتابة بخطوط', [
        '.معدن', '.تلج', '.ثلج', '.مبهر', '.ماتريكس', '.ضوء', '.نيون', '.شيطان', '.بنفسجي',
        '.رعد', '.ورق', '.ارينا', '.هاكر', '.رمل', '.بلاك-بينك', '.جليتش', '.نار',
    ]],
    ['📥', 'تحميل', [
        '.شغل اسم الاغنية', '.اغنية اسم الاغنية', '.سبوتيفاي اسم الاغنية', '.انستجرام لينك',
        '.فيسبوك لينك', '.تويتر لينك', '.تيكتوك لينك', '.فيديو اسم الفيديو',
    ]],
    ['🎨', 'متنوعة', [
        '.قلب', '.دايرة', '.قوس-قزح', '.شرطة', '.كارت-غبي', '.كارت-اسم', '.حكيم', '.تويت',
        '.كومنت-يوتيوب', '.رفيق', '.زجاج', '.سجن', '.نجحت', '.غضب',
    ]],
    ['🌸', 'انمي', [
        '.ياكل', '.نكزة', '.عياط', '.بوسة', '.طبطبة', '.حضن', '.غمزة', '.ضرب-جبهة',
    ]],
    ['📢', 'القنوات والريبو', [
        '.newsletter  جوه القناة بيطلع ايدي القناة',
        '.newsletter لينك_القناة',
        '.ريبو',
    ]],
];

function buildHeader(message) {
    const total = Object.keys(COMMANDS).length;
    const ts = Number(message?.messageTimestamp || 0) * 1000;
    const speed = ts ? Math.max(0, Date.now() - ts) : 0;
    const name = (settings.botName || 'mhdBot').toUpperCase();
    return [
        BAR,
        `│⏱️┊ ${b('المـدة')} 【 ${c(formatUptime(process.uptime()))} 】`,
        `│🚀┊ ${b('السرعة')} 【 ${c(speed + 'ms')} 】`,
        `│⚙️┊ ${b('الاصدار')} 【 ${c('v' + (settings.version || '3.0.0'))} 】`,
        `│👑┊ ${b('اجمالي الاوامر')} 【 ${c(total)} 】`,
        BAR,
        footer(),
    ].join('\n');
}

function buildSections() {
    const out = [];
    const name = (settings.botName || 'mhdBot').toUpperCase();
    out.push(`📜┊ ${b('قائمة البوت')} ┊📜`);
    out.push(`📂┊ ${b(fancy(name + ' MENU'))} ┊📂`);
    SECTIONS.forEach(([icon, title, cmds], idx) => {
        out.push('');
        out.push(`📑┊ ${b('قسم ' + (idx + 1))} :`);
        out.push(`「${icon}┊ ${b(title)} ┊${icon}」`);
        out.push('╭───────────────╮');
        for (const cmd of cmds) out.push(`│⌯ ${c(cmd)}`);
        out.push('╰───────────────╯');
    });
    out.push('');
    out.push(`👑┊ ${b('المطور ' + (settings.botOwner || 'MHD'))} ┊👑`);
    out.push('https://github.com/MHD-eNsR/mhdBot');
    return out.join('\n');
}

const SECTION_DESCS = [
    'اوامر عامة ومعلومات وخدمات سريعة',
    'اوامر ادارة الجروب والاعضاء والحماية',
    'اوامر التحكم الكاملة لصاحب البوت فقط',
    'اوامر صور وملصقات وتصاميم',
    'اوامر العاب تفاعلية وتسلية',
    'اوامر الذكاء الاصطناعي اتكلم معاه واطلب اي حاجة',
    'اوامر تسلية ومرح وردود',
    'اوامر كتابة النصوص بخطوط مزخرفة',
    'اوامر التحميل من السوشيال ميديا',
    'اوامر متنوعة وادوات مفيدة',
    'اوامر الانمي وصوره',
    'قنوات البوت والريبو'
];

const CHANNEL_URL = 'https://whatsapp.com/channel/0029VaG5esaK0IBimQcJ1R2J';

const contextInfo = {
    forwardingScore: 1,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
        newsletterJid: NEWSLETTER_JID,
        newsletterName: NEWSLETTER_NAME,
        serverMessageId: -1
    }
};

// المنيو النصي القديم (احتياطي لو الازرار مش شغالة)
async function sendTextMenu(sock, chatId, message) {
    const header = buildHeader(message);
    const body = buildSections();
    try {
        const imagePath = path.join(__dirname, '../assets/bot_image.jpg');
        if (fs.existsSync(imagePath)) {
            await sock.sendMessage(chatId, {
                image: fs.readFileSync(imagePath),
                caption: header,
                contextInfo
            }, { quoted: message });
        } else {
            await sock.sendMessage(chatId, { text: header, contextInfo }, { quoted: message });
        }
        await sock.sendMessage(chatId, { text: body, __noframe: true });
    } catch (error) {
        console.error('Error in help command:', error);
        await sock.sendMessage(chatId, { text: header + '\n\n' + body, __noframe: true });
    }
}

// المنيو التفاعلي بالازرار
async function helpCommand(sock, chatId, message) {
    const botName = (settings.botName || 'mhdBot').toUpperCase();
    const ownerNumber = String(settings.ownerNumber || '').replace(/\D/g, '');

    const sections = [{
        title: `📂┊ ${fancy(botName + ' MENU')} ┊📂`,
        highlight_label: fancy('DEV MHD'),
        rows: SECTIONS.map(([icon, title], idx) => ({
            header: `📑┊قسم ${idx + 1} :`,
            title: `「${icon}┊${title}┊${icon}」`,
            description: SECTION_DESCS[idx] || '',
            id: `.menusec ${idx + 1}`
        }))
    }];

    const ok = await buttons.sendInteractive(sock, chatId, {
        title: fancy(botName),
        text: fancy(buildHeader(message)),
        footer: fancy(`BY ${botName}`),
        buttons: [
            buttons.listButton('📜┊قائمة البوت┊📜', 'اقسام البوت', sections),
            buttons.urlButton('📢┊قناة البوت┊📢', CHANNEL_URL),
            buttons.urlButton('👑┊مطور البوت┊👑', `https://wa.me/${ownerNumber}`)
        ]
    });

    if (!ok) await sendTextMenu(sock, chatId, message);
}

// اوامر قسم واحد (بتتناده لما حد يختار قسم من القايمة)
async function helpSectionCommand(sock, chatId, message, num) {
    const idx = parseInt(num, 10) - 1;
    const sec = SECTIONS[idx];
    if (!sec) {
        await sock.sendMessage(chatId, { text: `اكتب رقم قسم من 1 لـ ${SECTIONS.length}\nمثال .قسم 1` }, { quoted: message });
        return;
    }
    const [icon, title, cmds] = sec;
    const botName = (settings.botName || 'mhdBot').toUpperCase();
    const out = [
        BAR,
        `📑┊ ${b('قسم ' + (idx + 1))} :`,
        `「${icon}┊ ${b(title)} ┊${icon}」`,
        `> ${SECTION_DESCS[idx] || ''}`,
        BAR,
        '╭╼ 📜 الاوامر ╾╮',
        ...cmds.map((cmd) => `│⌯ ${c(cmd)}`),
        '╰───────────╯',
        '',
        footer(),
        `↩️ للرجوع للقايمة اكتب ${c('.المنيو')}`
    ].join('\n');
    await sock.sendMessage(chatId, { text: out }, { quoted: message });
}

module.exports = helpCommand;
module.exports.helpSectionCommand = helpSectionCommand;
