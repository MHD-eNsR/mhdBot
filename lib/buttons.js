// طبقة ارسال الازرار التفاعلية
// بتستخدم مكتبة malvin-btns ولو المكتبة مش متسطبة او الارسال فشل بترجع false
// عشان الكود اللي بيناديها يرجع للمنيو النصي

let lib = null;
try {
  lib = require('malvin-btns');
} catch (e) {
  lib = null;
}

function getSender() {
  if (!lib) return null;
  return lib.sendInteractiveMessage || lib.sendButtons || null;
}

function isAvailable() {
  return typeof getSender() === 'function';
}

// ازرار جاهزة
function urlButton(text, url) {
  return {
    name: 'cta_url',
    buttonParamsJson: JSON.stringify({ display_text: text, url, merchant_url: url }),
  };
}

function listButton(text, title, sections) {
  return {
    name: 'single_select',
    buttonParamsJson: JSON.stringify({ title: text, sections: sections.map((s) => ({ title: s.title || title, highlight_label: s.highlight_label || '', rows: s.rows })) }),
  };
}

function quickButton(text, id) {
  return { id, text };
}

// تحويل شكل الزر لشكل native flow
function toNativeButton(b) {
  if (b && b.name && b.buttonParamsJson) return b;
  return { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: b.text, id: b.id }) };
}

// ارسال مباشر عن طريق Baileys نفسه (من غير المكتبة المساعدة)
async function sendNative(sock, chatId, { title, text, footer, buttons }) {
  const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');
  const msg = generateWAMessageFromContent(chatId, {
    viewOnceMessage: {
      message: {
        messageContextInfo: { deviceListMetadata: {}, deviceListMetadataVersion: 2 },
        interactiveMessage: proto.Message.InteractiveMessage.create({
          header: proto.Message.InteractiveMessage.Header.create({ title: title || '', hasMediaAttachment: false }),
          body: proto.Message.InteractiveMessage.Body.create({ text }),
          footer: proto.Message.InteractiveMessage.Footer.create({ text: footer || '' }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
            buttons: buttons.map(toNativeButton),
            messageParamsJson: ''
          })
        })
      }
    }
  }, { userJid: sock.user?.id });

  const nodes = [{
    tag: 'biz',
    attrs: {},
    content: [{
      tag: 'interactive',
      attrs: { type: 'native_flow', v: '1' },
      content: [{ tag: 'native_flow', attrs: { v: '9', name: 'mixed' } }]
    }]
  }];
  if (!String(chatId).endsWith('@g.us')) nodes.push({ tag: 'bot', attrs: { biz_bot: '1' } });

  await sock.relayMessage(chatId, msg.message, { messageId: msg.key.id, additionalNodes: nodes });
}

let loggedExports = false;

// بتبعت رسالة تفاعلية وبترجع true لو نجحت
// الترتيب: المكتبة malvin-btns ثم Baileys مباشرة ولو الاتنين فشلوا بترجع false للمنيو النصي
async function sendInteractive(sock, chatId, { title = '', text = '', footer = '', buttons = [] }) {
  const payload = { title, text, footer, buttons };

  const sender = getSender();
  if (sender) {
    // حسب README المكتبة: sendInteractiveMessage بتاخد interactiveButtons
    // وبنجرب مرة بالعنوان ومرة من غيره لانها ممكن ترفض الحقول الزيادة
    const nativeButtons = buttons.map(toNativeButton);
    const attempts = [
      { text, footer, title, interactiveButtons: nativeButtons },
      { text, footer, interactiveButtons: nativeButtons }
    ];
    for (const data of attempts) {
      try {
        await sender(sock, chatId, data);
        return true;
      } catch (e) {
        console.error('[buttons] malvin-btns فشلت:', e?.formatDetailed ? e.formatDetailed() : (e?.message || e));
      }
    }
    if (!loggedExports && lib) {
      loggedExports = true;
      console.error('[buttons] مكونات المكتبة:', Object.keys(lib).join(', '));
    }
  } else if (!loggedExports) {
    loggedExports = true;
    console.error('[buttons] malvin-btns مش متسطبة او مفيش دالة ارسال فيها');
  }

  try {
    await sendNative(sock, chatId, payload);
    return true;
  } catch (e) {
    console.error('[buttons] الارسال المباشر فشل:', e?.message || e);
    return false;
  }
}

// بتطلع id الاختيار من رد الازرار التفاعلية
function extractResponseId(m) {
  const ir = m && m.interactiveResponseMessage;
  if (!ir) return null;
  const nf = ir.nativeFlowResponseMessage;
  if (nf && typeof nf.paramsJson === 'string') {
    try {
      const p = JSON.parse(nf.paramsJson);
      if (p && (p.id || p.selectedId)) return String(p.id || p.selectedId);
    } catch (e) { /* تجاهل */ }
  }
  if (ir.listResponseMessage?.singleSelectReply?.selectedRowId) return ir.listResponseMessage.singleSelectReply.selectedRowId;
  if (ir.selectedId) return String(ir.selectedId);
  return null;
}

module.exports = { isAvailable, sendInteractive, urlButton, listButton, quickButton, extractResponseId };
