/**
 * Post image/video/audio/text as a WhatsApp group status.
 * Admin + bot-admin only.
 */

const crypto = require('crypto');
const { PassThrough } = require('stream');
const ffmpeg = require('fluent-ffmpeg');
const {
  generateWAMessageContent,
  generateWAMessageFromContent,
  downloadContentFromMessage,
  downloadMediaMessage,
} = require('@whiskeysockets/baileys');
const isAdmin = require('../lib/isAdmin');

const PURPLE_COLOR = '#9C27B0';

function unwrapMessage(message) {
  if (!message || typeof message !== 'object') return message;
  if (message.ephemeralMessage?.message) return unwrapMessage(message.ephemeralMessage.message);
  if (message.viewOnceMessage?.message) return unwrapMessage(message.viewOnceMessage.message);
  if (message.viewOnceMessageV2?.message) return unwrapMessage(message.viewOnceMessageV2.message);
  if (message.viewOnceMessageV2Extension?.message) {
    return unwrapMessage(message.viewOnceMessageV2Extension.message);
  }
  return message;
}

function resolveMedia(msg) {
  const own = unwrapMessage(msg.message);
  if (own?.imageMessage) {
    return { kind: 'image', targetMessage: msg, mediaMsg: own.imageMessage };
  }
  if (own?.videoMessage) {
    return { kind: 'video', targetMessage: msg, mediaMsg: own.videoMessage };
  }
  if (own?.audioMessage) {
    return { kind: 'audio', targetMessage: msg, mediaMsg: own.audioMessage };
  }
  if (own?.stickerMessage) {
    return { kind: 'sticker', targetMessage: msg, mediaMsg: own.stickerMessage };
  }
  if (own?.documentMessage && /^image\//i.test(own.documentMessage.mimetype || '')) {
    return { kind: 'image', targetMessage: msg, mediaMsg: own.documentMessage };
  }

  const ctx =
    own?.extendedTextMessage?.contextInfo ||
    own?.imageMessage?.contextInfo ||
    own?.videoMessage?.contextInfo ||
    msg.message?.extendedTextMessage?.contextInfo;

  const quoted = unwrapMessage(ctx?.quotedMessage);
  if (!quoted || !ctx?.stanzaId) return null;

  const targetMessage = {
    key: {
      remoteJid: msg.key.remoteJid,
      id: ctx.stanzaId,
      participant: ctx.participant,
    },
    message: quoted,
  };

  if (quoted.imageMessage) {
    return { kind: 'image', targetMessage, mediaMsg: quoted.imageMessage };
  }
  if (quoted.videoMessage) {
    return { kind: 'video', targetMessage, mediaMsg: quoted.videoMessage };
  }
  if (quoted.audioMessage) {
    return { kind: 'audio', targetMessage, mediaMsg: quoted.audioMessage };
  }
  if (quoted.stickerMessage) {
    return { kind: 'sticker', targetMessage, mediaMsg: quoted.stickerMessage };
  }
  if (quoted.documentMessage && /^image\//i.test(quoted.documentMessage.mimetype || '')) {
    return { kind: 'image', targetMessage, mediaMsg: quoted.documentMessage };
  }

  return null;
}

async function downloadMediaFallback(msgObj, type) {
  const mediaMsg = msgObj[`رسالة ${type}`] || msgObj.documentMessage || msgObj;
  const stream = await downloadContentFromMessage(
    mediaMsg,
    type === 'sticker' ? 'sticker' : type
  );
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}

async function groupStatus(sock, jid, content) {
  const payload = { ...content };
  const { backgroundColor } = payload;
  delete payload.backgroundColor;

  const inside = await generateWAMessageContent(payload, {
    upload: sock.waUploadToServer,
    backgroundColor: backgroundColor || PURPLE_COLOR,
  });

  const secret = crypto.randomBytes(32);
  const msg = generateWAMessageFromContent(
    jid,
    {
      messageContextInfo: { messageSecret: secret },
      groupStatusMessageV2: {
        message: {
          ...inside,
          messageContextInfo: { messageSecret: secret },
        },
      },
    },
    {}
  );

  await sock.relayMessage(jid, msg.message, { messageId: msg.key.id });
  return msg;
}

function toVN(buffer) {
  return new Promise((resolve, reject) => {
    const input = new PassThrough();
    const output = new PassThrough();
    const chunks = [];
    input.end(buffer);

    ffmpeg(input)
      .noVideo()
      .audioCodec('libopus')
      .format('ogg')
      .audioChannels(1)
      .audioFrequency(48000)
      .on('error', reject)
      .on('end', () => resolve(Buffer.concat(chunks)))
      .pipe(output);

    output.on('data', (c) => chunks.push(c));
  });
}

function generateWaveform(buffer, bars = 64) {
  return new Promise((resolve, reject) => {
    const input = new PassThrough();
    input.end(buffer);
    const chunks = [];

    ffmpeg(input)
      .audioChannels(1)
      .audioFrequency(16000)
      .format('s16le')
      .on('error', reject)
      .on('end', () => {
        const raw = Buffer.concat(chunks);
        const samples = raw.length / 2;
        const amps = [];
        for (let i = 0; i < samples; i++) {
          amps.push(Math.abs(raw.readInt16LE(i * 2)) / 32768);
        }
        const size = Math.floor(amps.length / bars);
        if (size === 0) return resolve(undefined);
        const avg = Array.from(
          { length: bars },
          (_, i) => amps.slice(i * size, (i + 1) * size).reduce((a, b) => a + b, 0) / size
        );
        const max = Math.max(...avg);
        if (max === 0) return resolve(undefined);
        resolve(Buffer.from(avg.map((v) => Math.floor((v / max) * 100))).toString('base64'));
      })
      .pipe()
      .on('data', (c) => chunks.push(c));
  });
}

async function groupstatusCommand(sock, chatId, message, senderId) {
  const reply = (text) => sock.sendMessage(chatId, { text }, { quoted: message });

  try {
    if (!chatId.endsWith('@g.us')) {
      return reply('الامر ده بيشتغل في الجروبات بس');
    }

    const adminStatus = await isAdmin(sock, chatId, senderId);
    if (!adminStatus.isBotAdmin) {
      return reply('خلي البوت ادمن عشان ينزل حالة في الجروب');
    }
    if (!message.key.fromMe && !adminStatus.isSenderAdmin) {
      return reply('الامر ده للادمنز بس');
    }

    const raw =
      message.message?.conversation ||
      message.message?.extendedTextMessage?.text ||
      message.message?.imageMessage?.caption ||
      message.message?.videoMessage?.caption ||
      '';
    const caption = raw
      .replace(/^\.\S+\s*/, '')
      .trim();
    const media = resolveMedia(message);

    if (!media) {
      if (!caption) {
        return reply(
          'طريقة نشر حالة الجروب\n\n' +
            '• ابعت صورة او فيديو او صوت مع كابشن\n' +
            '  .حالة-الجروب والكابشن لو عايز\n' +
            '• او رد على صورة او فيديو او صوت او ملصق بالامر\n' +
            '  .حالة-الجروب والكابشن لو عايز\n' +
            '• او حالة نصية بس\n' +
            '  .حالة-الجروب النص بتاعك هنا\n\n' +
            'الحالات النصية خلفيتها بنفسجي بشكل افتراضي'
        );
      }

      await reply('بنزل الحالة النصية في الجروب');
      try {
        await groupStatus(sock, chatId, { text: caption, backgroundColor: PURPLE_COLOR });
        return reply('الحالة النصية اتنزلت في الجروب');
      } catch (e) {
        console.error('[groupstatus] text:', e?.message || e);
        return reply('معرفتش انزل الحالة النصية في الجروب ' + (e.message || e));
      }
    }

    let buf;
    try {
      buf = await downloadMediaMessage(
        media.targetMessage,
        'buffer',
        {},
        { logger: undefined, reuploadRequest: sock.updateMediaMessage }
      );
    } catch (dlErr) {
      try {
        const type =
          media.kind === 'sticker'
            ? 'sticker'
            : media.kind === 'video'
              ? 'video'
              : media.kind === 'audio'
                ? 'audio'
                : 'image';
        buf = await downloadMediaFallback(media.targetMessage.message, type);
      } catch (e2) {
        console.error('[groupstatus] download:', dlErr?.message || dlErr, e2?.message || e2);
        return reply('معرفتش احمل الميديا');
      }
    }

    if (!buf?.length) return reply('مقدرتش احمل الميديا');

    if (media.kind === 'image' || media.kind === 'sticker') {
      await reply('بنزل حالة الصورة في الجروب');
      try {
        await groupStatus(sock, chatId, { image: buf, caption: caption || '' });
        return reply('حالة الصورة اتنزلت في الجروب');
      } catch (e) {
        console.error('[groupstatus] image:', e?.message || e);
        return reply('معرفتش انزل حالة الصورة في الجروب ' + (e.message || e));
      }
    }

    if (media.kind === 'video') {
      await reply('بنزل حالة الفيديو في الجروب');
      try {
        await groupStatus(sock, chatId, { video: buf, caption: caption || '' });
        return reply('حالة الفيديو اتنزلت في الجروب');
      } catch (e) {
        console.error('[groupstatus] video:', e?.message || e);
        return reply('معرفتش انزل حالة الفيديو في الجروب ' + (e.message || e));
      }
    }

    if (media.kind === 'audio') {
      await reply('بنزل حالة الصوت في الجروب');
      let vn;
      try {
        vn = await toVN(buf);
      } catch {
        vn = buf;
      }
      let waveform;
      try {
        waveform = await generateWaveform(buf);
      } catch {
        waveform = undefined;
      }
      try {
        await groupStatus(sock, chatId, {
          audio: vn,
          mimetype: 'audio/ogg; codecs=opus',
          ptt: true,
          waveform,
        });
        return reply('حالة الصوت اتنزلت في الجروب');
      } catch (e) {
        console.error('[groupstatus] audio:', e?.message || e);
        return reply('معرفتش انزل حالة الصوت في الجروب ' + (e.message || e));
      }
    }

    return reply('نوع الميديا مش مدعوم ابعت او رد على صورة او فيديو او صوت');
  } catch (e) {
    console.error('[groupstatus]', e?.message || e);
    return reply('حصل خطأ ' + (e.message || e));
  }
}

module.exports = groupstatusCommand;
