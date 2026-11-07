// امر .قناة
// جوه القناة بيطلع الايدي بتاعها
// وبرة القناة لو بعتله لينك قناة بيطلع الايدي بتاعها برضو

const CHANNEL_LINK_RE = /whatsapp\.com\/channel\/([A-Za-z0-9_-]+)/i;

async function newsletterCommand(sock, chatId, message, rawText = '') {
    const inChannel = chatId.endsWith('@newsletter');
    // مفيش رد بالاقتباس جوه القنوات
    const sendOpts = inChannel ? {} : { quoted: message };

    try {
        let jid = null;
        let meta = null;

        const linkMatch = rawText.match(CHANNEL_LINK_RE);

        if (inChannel && !linkMatch) {
            jid = chatId;
            try {
                meta = await sock.newsletterMetadata('jid', chatId);
            } catch (e) {
                meta = null;
            }
        } else if (linkMatch) {
            meta = await sock.newsletterMetadata('invite', linkMatch[1]);
            jid = meta && meta.id;
        } else {
            await sock.sendMessage(chatId, {
                text: 'اكتب الامر جوه القناة بتاعتك عشان اجيبلك الايدي بتاعها\nاو ابعت الامر وبعده لينك القناة\nمثال\n.قناة https://whatsapp.com/channel/xxxxxxxx'
            }, sendOpts);
            return;
        }

        if (!jid) {
            await sock.sendMessage(chatId, {
                text: 'معرفتش القي القناة اتأكد ان اللينك صح'
            }, sendOpts);
            return;
        }

        let text = 'ايدي القناة\n' + jid;
        const name = meta && (meta.name || (meta.thread_metadata && meta.thread_metadata.name && meta.thread_metadata.name.text));
        if (name) text = 'اسم القناة ' + name + '\n\n' + text;
        const subs = meta && (meta.subscribers || (meta.thread_metadata && meta.thread_metadata.subscribers_count));
        if (subs) text += '\n\nعدد المتابعين ' + subs;

        await sock.sendMessage(chatId, { text }, sendOpts);
    } catch (error) {
        console.error('Error in newsletter command:', error);
        await sock.sendMessage(chatId, {
            text: 'معرفتش اجيب ايدي القناة جرب تاني بعد شوية'
        }, sendOpts).catch(() => {});
    }
}

module.exports = newsletterCommand;
