const fs = require('fs');
const path = require('path');
const os = require('os');
const isOwnerOrSudo = require('../lib/isOwner');

const channelInfo = {
    contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363189338764144@newsletter',
            newsletterName: 'MHD dev',
            serverMessageId: -1
        }
    }
};

async function clearSessionCommand(sock, chatId, msg) {
    try {
        const senderId = msg.key.participant || msg.key.remoteJid;
        const isOwner = await isOwnerOrSudo(senderId, sock, chatId);
        
        if (!msg.key.fromMe && !isOwner) {
            await sock.sendMessage(chatId, { 
                text: 'الامر ده لصاحب البوت بس',
                ...channelInfo
            });
            return;
        }

        // Define session directory
        const sessionDir = path.join(__dirname, '../session');

        if (!fs.existsSync(sessionDir)) {
            await sock.sendMessage(chatId, { 
                text: 'مفيش فولدر للسيشن',
                ...channelInfo
            });
            return;
        }

        let filesCleared = 0;
        let errors = 0;
        let errorDetails = [];

        // Send initial status
        await sock.sendMessage(chatId, { 
            text: `بظبط ملفات السيشن عشان الاداء يبقى احسن`,
            ...channelInfo
        });

        const files = fs.readdirSync(sessionDir);
        
        // Count files by type for optimization
        let appStateSyncCount = 0;
        let preKeyCount = 0;

        for (const file of files) {
            if (file.startsWith('app-state-sync-')) appStateSyncCount++;
            if (file.startsWith('pre-key-')) preKeyCount++;
        }

        // Delete files
        for (const file of files) {
            if (file === 'creds.json') {
                // Skip creds.json file
                continue;
            }
            try {
                const filePath = path.join(sessionDir, file);
                fs.unlinkSync(filePath);
                filesCleared++;
            } catch (error) {
                errors++;
                errorDetails.push(`معرفتش امسح ${file} ${error.message}`);
            }
        }

        // Send completion message
        const message = `ملفات السيشن اتمسحت بنجاح\n\n` +
                       `الاحصائيات\n` +
                       `عدد الملفات اللي اتمسحت ${filesCleared}\n` +
                       `ملفات مزامنة الحالة ${appStateSyncCount}\n` +
                       `ملفات المفاتيح الاولية ${preKeyCount}\n` +
                       (errors > 0 ? `\nحصلت اخطاء ${errors}\n${errorDetails.join('\n')}` : '');

        await sock.sendMessage(chatId, { 
            text: message,
            ...channelInfo
        });

    } catch (error) {
        console.error('Error in clearsession command:', error);
        await sock.sendMessage(chatId, { 
            text: 'معرفتش امسح ملفات السيشن',
            ...channelInfo
        });
    }
}

module.exports = clearSessionCommand; 