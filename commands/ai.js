const APIs = require('../lib/api');

async function aiCommand(sock, chatId, message) {
  try {
    const text =
      message.message?.conversation || message.message?.extendedTextMessage?.text || '';
    const query = text.replace(/^\.(?:ai|gpt|gemini)\s*/i, '').trim();

    if (!query) {
      return sock.sendMessage(
        chatId,
        { text: 'اكتب الامر وبعده سؤالك\nمثال\n.ذكاء اكتبلي صفحة اتش تي ام ال بسيطة' },
        { quoted: message }
      );
    }

    await sock.sendMessage(chatId, { react: { text: '🤖', key: message.key } });

    let answer;
    const steps = [
      ['mhdBot', () => APIs.knightChatAI(query)],
      ['mhdBot', () => APIs.knightGptAI(query)],
      ['fallback', () => APIs.fallbackChatAI(query)],
    ];

    for (const [name, run] of steps) {
      try {
        answer = await run();
        if (answer) {
          console.log(`[ai] OK via ${name}`);
          break;
        }
      } catch (err) {
        console.log(`[ai] ${name} failed:`, err?.message || err);
      }
    }

    if (!answer) {
      return sock.sendMessage(
        chatId,
        { text: 'معرفتش اجيب رد من الذكاء الاصطناعي جرب تاني بعد شوية' },
        { quoted: message }
      );
    }

    await sock.sendMessage(chatId, { text: answer }, { quoted: message });
  } catch (err) {
    console.error('[ai]', err?.message || err);
    await sock.sendMessage(
      chatId,
      { text: 'حصل خطأ جرب تاني بعد شوية' },
      { quoted: message }
    );
  }
}

module.exports = aiCommand;
