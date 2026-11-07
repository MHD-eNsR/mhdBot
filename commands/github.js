const moment = require('moment-timezone');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');


async function githubCommand(sock, chatId, message) {
  try {
    const res = await fetch('https://api.github.com/repos/MHD-eNsR/mhdBot');
    if (!res.ok) throw new Error('Error fetching repository data');
    const json = await res.json();

    let txt = `mhdBot\n\n`;
    txt += `الاسم ${json.name}\n`;
    txt += `المتابعين ${json.watchers_count}\n`;
    txt += `الحجم ${(json.size / 1024).toFixed(2)} ميجا\n`;
    txt += `اخر تحديث ${moment(json.updated_at).format('DD/MM/YY - HH:mm:ss')}\n`;
    txt += `الرابط ${json.html_url}\n`;
    txt += `النسخ ${json.forks_count}\n`;
    txt += `النجوم ${json.stargazers_count}\n\n`;
    txt += `mhdBot`;

    // Use the local asset image
    const imgPath = path.join(__dirname, '../assets/bot_image.jpg');
    const imgBuffer = fs.readFileSync(imgPath);

    await sock.sendMessage(chatId, { image: imgBuffer, caption: txt }, { quoted: message });
  } catch (error) {
    await sock.sendMessage(chatId, { text: 'حصل خطأ وانا بجيب معلومات الريبو' }, { quoted: message });
  }
}

module.exports = githubCommand; 