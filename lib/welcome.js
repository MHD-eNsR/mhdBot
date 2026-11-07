const { addWelcome, delWelcome, isWelcomeOn, addGoodbye, delGoodBye, isGoodByeOn } = require('../lib/index');
const { delay } = require('@whiskeysockets/baileys');

async function handleWelcome(sock, chatId, message, match) {
    if (!match) {
        return sock.sendMessage(chatId, {
            text: `اعدادات رسالة الترحيب\n\n.ترحيب تشغيل  لتشغيل رسايل الترحيب\n.ترحيب ضبط وبعدها رسالتك  لتحديد رسالة ترحيب خاصة\n.ترحيب ايقاف  لايقاف رسايل الترحيب\n\nالمتغيرات المتاحة\n• {user}  بيعمل منشن للعضو الجديد\n• {group}  بيكتب اسم الجروب\n• {description}  بيكتب وصف الجروب`,
            quoted: message
        });
    }

    const [command, ...args] = match.split(' ');
    const lowerCommand = command.toLowerCase();
    const customMessage = args.join(' ');

    if (lowerCommand === 'on') {
        if (await isWelcomeOn(chatId)) {
            return sock.sendMessage(chatId, { text: 'رسايل الترحيب شغالة بالفعل', quoted: message });
        }
        await addWelcome(chatId, true, 'اهلا {user} في {group}');
        return sock.sendMessage(chatId, { text: 'رسايل الترحيب اشتغلت برسالة بسيطة استخدم .ترحيب ضبط وبعدها رسالتك عشان تغيرها', quoted: message });
    }

    if (lowerCommand === 'off') {
        if (!(await isWelcomeOn(chatId))) {
            return sock.sendMessage(chatId, { text: 'رسايل الترحيب مقفولة بالفعل', quoted: message });
        }
        await delWelcome(chatId);
        return sock.sendMessage(chatId, { text: 'رسايل الترحيب اتقفلت في الجروب ده', quoted: message });
    }

    if (lowerCommand === 'set') {
        if (!customMessage) {
            return sock.sendMessage(chatId, { text: 'اكتب رسالة الترحيب بعد الامر\nمثال .ترحيب ضبط اهلا بيك في الجروب', quoted: message });
        }
        await addWelcome(chatId, true, customMessage);
        return sock.sendMessage(chatId, { text: 'رسالة الترحيب اتحفظت بنجاح', quoted: message });
    }

    // If no valid command is provided
    return sock.sendMessage(chatId, {
        text: `الامر غلط استخدم\n.ترحيب تشغيل  للتشغيل\n.ترحيب ضبط وبعدها رسالتك  لرسالة خاصة\n.ترحيب ايقاف  للايقاف`,
        quoted: message
    });
}

async function handleGoodbye(sock, chatId, message, match) {
    const lower = match?.toLowerCase();

    if (!match) {
        return sock.sendMessage(chatId, {
            text: `اعدادات رسالة الوداع\n\n.وداع تشغيل  لتشغيل رسايل الوداع\n.وداع ضبط وبعدها رسالتك  لتحديد رسالة وداع خاصة\n.وداع ايقاف  لايقاف رسايل الوداع\n\nالمتغيرات المتاحة\n• {user}  بيعمل منشن للعضو اللي مشي\n• {group}  بيكتب اسم الجروب`,
            quoted: message
        });
    }

    if (lower === 'on') {
        if (await isGoodByeOn(chatId)) {
            return sock.sendMessage(chatId, { text: 'رسايل الوداع شغالة بالفعل', quoted: message });
        }
        await addGoodbye(chatId, true, 'مع السلامة {user}');
        return sock.sendMessage(chatId, { text: 'رسايل الوداع اشتغلت برسالة بسيطة استخدم .وداع ضبط وبعدها رسالتك عشان تغيرها', quoted: message });
    }

    if (lower === 'off') {
        if (!(await isGoodByeOn(chatId))) {
            return sock.sendMessage(chatId, { text: 'رسايل الوداع مقفولة بالفعل', quoted: message });
        }
        await delGoodBye(chatId);
        return sock.sendMessage(chatId, { text: 'رسايل الوداع اتقفلت في الجروب ده', quoted: message });
    }

    if (lower.startsWith('set ')) {
        const customMessage = match.substring(4);
        if (!customMessage) {
            return sock.sendMessage(chatId, { text: 'اكتب رسالة الوداع بعد الامر\nمثال .وداع ضبط مع السلامة', quoted: message });
        }
        await addGoodbye(chatId, true, customMessage);
        return sock.sendMessage(chatId, { text: 'رسالة الوداع اتحفظت بنجاح', quoted: message });
    }

    // If no valid command is provided
    return sock.sendMessage(chatId, {
        text: `الامر غلط استخدم\n.وداع تشغيل  للتشغيل\n.وداع ضبط وبعدها رسالتك  لرسالة خاصة\n.وداع ايقاف  للايقاف`,
        quoted: message
    });
}

module.exports = { handleWelcome, handleGoodbye };
// This code handles welcome and goodbye messages in a WhatsApp group using the Baileys library.