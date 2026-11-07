require('dotenv').config();

const settings = {
  packname: 'mhdBot',
  author: 'MHD',
  botName: "mhdBot",
  botOwner: 'MHD', // اسم صاحب البوت
  ownerNumber: '201043055323', // رقم صاحب البوت من غير زائد وبكود الدولة
  giphyApiKey: 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq',
  commandMode: "public",
  maxStoreMessages: 20, 
  storeWriteInterval: 10000,
  description: "بوت لادارة الجروبات وتنفيذ المهام تلقائيا",
  version: "3.0.8",
  updateZipUrl: "https://github.com/MHD-eNsR/mhdBot/archive/refs/heads/main.zip",
  // Media / Knight API (song, video, cards, etc.)
  knightApiUrl: process.env.KNIGHT_API_URL || 'https://knightbotapi.stream',
  knightApiKey: process.env.KNIGHT_API_KEY || 'knight',
  mediaApiUrl: process.env.MEDIA_API_URL || 'https://knightbotapi.stream',
  mediaApiKey: process.env.MEDIA_API_KEY || 'knight',
  princeApiUrl: process.env.PRINCE_API_URL || 'https://api.princetechn.com',
  princeApiKey: process.env.PRINCE_API_KEY || 'prince',
};

module.exports = settings;
