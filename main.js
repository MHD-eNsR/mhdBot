// 🧹 Fix for ENOSPC / temp overflow in hosted panels
const fs = require('fs');
const path = require('path');

// Redirect temp storage away from system /tmp
const customTemp = path.join(process.cwd(), 'temp');
if (!fs.existsSync(customTemp)) fs.mkdirSync(customTemp, { recursive: true });
process.env.TMPDIR = customTemp;
process.env.TEMP = customTemp;
process.env.TMP = customTemp;

// Auto-cleaner every 3 hours
setInterval(() => {
    fs.readdir(customTemp, (err, files) => {
        if (err) return;
        for (const file of files) {
            const filePath = path.join(customTemp, file);
            fs.stat(filePath, (err, stats) => {
                if (!err && Date.now() - stats.mtimeMs > 3 * 60 * 60 * 1000) {
                    fs.unlink(filePath, () => { });
                }
            });
        }
    });
    console.log('🧹 Temp folder auto-cleaned');
}, 3 * 60 * 60 * 1000);

const settings = require('./settings');
require('./config.js');
const { isBanned } = require('./lib/isBanned');
const yts = require('yt-search');
const { fetchBuffer } = require('./lib/myfunc');
const fetch = require('node-fetch');
const ytdl = require('ytdl-core');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const { isSudo } = require('./lib/index');
const isOwnerOrSudo = require('./lib/isOwner');
const { autotypingCommand, isAutotypingEnabled, handleAutotypingForMessage, handleAutotypingForCommand, showTypingAfterCommand } = require('./commands/autotyping');
const { autoreadCommand, isAutoreadEnabled, handleAutoread } = require('./commands/autoread');

// Command imports
const tagAllCommand = require('./commands/tagall');
const { reactForCommand, denyReact } = require('./lib/cmdReact');
const helpCommand = require('./commands/help');
const banCommand = require('./commands/ban');
const { promoteCommand } = require('./commands/promote');
const { demoteCommand } = require('./commands/demote');
const muteCommand = require('./commands/mute');
const unmuteCommand = require('./commands/unmute');
const stickerCommand = require('./commands/sticker');
const isAdmin = require('./lib/isAdmin');
const warnCommand = require('./commands/warn');
const warningsCommand = require('./commands/warnings');
const ttsCommand = require('./commands/tts');
const { tictactoeCommand, handleTicTacToeMove } = require('./commands/tictactoe');
const { incrementMessageCount, topMembers } = require('./commands/topmembers');
const ownerCommand = require('./commands/owner');
const deleteCommand = require('./commands/delete');
const { handleAntilinkCommand, handleLinkDetection } = require('./commands/antilink');
const { handleAntitagCommand, handleTagDetection } = require('./commands/antitag');
const { Antilink } = require('./lib/antilink');
const { handleMentionDetection, mentionToggleCommand, setMentionCommand } = require('./commands/mention');
const memeCommand = require('./commands/meme');
const tagCommand = require('./commands/tag');
const tagNotAdminCommand = require('./commands/tagnotadmin');
const hideTagCommand = require('./commands/hidetag');
const jokeCommand = require('./commands/joke');
const quoteCommand = require('./commands/quote');
const factCommand = require('./commands/fact');
const weatherCommand = require('./commands/weather');
const newsCommand = require('./commands/news');
const kickCommand = require('./commands/kick');
const simageCommand = require('./commands/simage');
const attpCommand = require('./commands/attp');
const { startHangman, guessLetter } = require('./commands/hangman');
const { startTrivia, answerTrivia } = require('./commands/trivia');
const { complimentCommand } = require('./commands/compliment');
const { insultCommand } = require('./commands/insult');
const { eightBallCommand } = require('./commands/eightball');
const { lyricsCommand } = require('./commands/lyrics');
const { dareCommand } = require('./commands/dare');
const { truthCommand } = require('./commands/truth');
const { clearCommand } = require('./commands/clear');
const pingCommand = require('./commands/ping');
const aliveCommand = require('./commands/alive');
const blurCommand = require('./commands/img-blur');
const { welcomeCommand, handleJoinEvent } = require('./commands/welcome');
const { goodbyeCommand, handleLeaveEvent } = require('./commands/goodbye');
const githubCommand = require('./commands/github');
const { handleAntiBadwordCommand, handleBadwordDetection } = require('./lib/antibadword');
const antibadwordCommand = require('./commands/antibadword');
const { handleChatbotCommand, handleChatbotResponse } = require('./commands/chatbot');
const takeCommand = require('./commands/take');
const { flirtCommand } = require('./commands/flirt');
const characterCommand = require('./commands/character');
const wastedCommand = require('./commands/wasted');
const shipCommand = require('./commands/ship');
const groupInfoCommand = require('./commands/groupinfo');
const resetlinkCommand = require('./commands/resetlink');
const staffCommand = require('./commands/staff');
const unbanCommand = require('./commands/unban');
const emojimixCommand = require('./commands/emojimix');
const { handlePromotionEvent } = require('./commands/promote');
const { handleDemotionEvent } = require('./commands/demote');
const viewOnceCommand = require('./commands/viewonce');
const vv2Command = require('./commands/vv2');
const clearSessionCommand = require('./commands/clearsession');
const { autoStatusCommand, handleStatusUpdate } = require('./commands/autostatus');
const savestatusCommand = require('./commands/savestatus');
const { autoSave: savestatusAutoSave } = savestatusCommand;
const groupstatusCommand = require('./commands/groupstatus');
const antibotCommand = require('./commands/antibot');
const { handleAntibotDetection } = antibotCommand;
const { simpCommand } = require('./commands/simp');
const { stupidCommand } = require('./commands/stupid');
const stickerTelegramCommand = require('./commands/stickertelegram');
const textmakerCommand = require('./commands/textmaker');
const { handleAntideleteCommand, handleMessageRevocation, storeMessage } = require('./commands/antidelete');
const clearTmpCommand = require('./commands/cleartmp');
const setProfilePicture = require('./commands/setpp');
const { setGroupDescription, setGroupName, setGroupPhoto } = require('./commands/groupmanage');
const instagramCommand = require('./commands/instagram');
const facebookCommand = require('./commands/facebook');
const twitterCommand = require('./commands/twitter');
const spotifyCommand = require('./commands/spotify');
const playCommand = require('./commands/play');
const tiktokCommand = require('./commands/tiktok');
const songCommand = require('./commands/song');
const aiCommand = require('./commands/ai');
const urlCommand = require('./commands/url');
const { handleTranslateCommand } = require('./commands/translate');
const { handleSsCommand } = require('./commands/ss');
const { addCommandReaction, handleAreactCommand } = require('./lib/reactions');
const { goodnightCommand } = require('./commands/goodnight');
const { shayariCommand } = require('./commands/shayari');
const { rosedayCommand } = require('./commands/roseday');
const imagineCommand = require('./commands/imagine');
const videoCommand = require('./commands/video');
const sudoCommand = require('./commands/sudo');
const { miscCommand, handleHeart } = require('./commands/misc');
const { animeCommand } = require('./commands/anime');
const { piesCommand, piesAlias } = require('./commands/pies');
const stickercropCommand = require('./commands/stickercrop');
const updateCommand = require('./commands/update');
const removebgCommand = require('./commands/removebg');
const { reminiCommand } = require('./commands/remini');
const { igsCommand } = require('./commands/igs');
const { anticallCommand, readState: readAnticallState } = require('./commands/anticall');
const { pmblockerCommand, readState: readPmBlockerState } = require('./commands/pmblocker');
const settingsCommand = require('./commands/settings');
const { normalizeMessage, isCmd, argsOf, toEnglish } = require('./lib/arabic');
const newsletterCommand = require('./commands/newsletter');
const soraCommand = require('./commands/sora');

// Global settings
global.packname = settings.packname;
global.author = settings.author;
global.channelLink = "https://github.com/MHD-eNsR/mhdBot";
global.ytch = "MHD";

// Add this near the top of main.js with other global configurations
const channelInfo = {
    contextInfo: {
        forwardingScore: 1,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363189338764144@newsletter',
            newsletterName: 'MHD dev',
            serverMessageId: -1
        }
    }
};

async function handleMessages(sock, messageUpdate, printLog) {
    try {
        const { messages, type } = messageUpdate;
        const message = messages[0];
        if (!message?.message) return;
        if (type !== 'notify') return;

        // تحويل الاوامر العربي لاسمها الاصلي
        normalizeMessage(message);

        // Handle autoread functionality
        await handleAutoread(sock, message);

        // Store message for antidelete feature
        if (message.message) {
            storeMessage(sock, message);
        }

        // Handle message revocation
        if (message.message?.protocolMessage?.type === 0) {
            await handleMessageRevocation(sock, message);
            return;
        }

        const chatId = message.key.remoteJid;
        const senderId = message.key.participant || message.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const senderIsSudo = await isSudo(senderId);
        const senderIsOwnerOrSudo = await isOwnerOrSudo(senderId, sock, chatId);

        // Handle button responses
        if (message.message?.buttonsResponseMessage) {
            const buttonId = message.message.buttonsResponseMessage.selectedButtonId;
            const chatId = message.key.remoteJid;

            if (buttonId === 'channel') {
                await sock.sendMessage(chatId, {
                    text: 'ريبو البوت على جيت هب\nhttps://github.com/MHD-eNsR/mhdBot'
                }, { quoted: message });
                return;
            } else if (buttonId === 'owner') {
                const ownerCommand = require('./commands/owner');
                await ownerCommand(sock, chatId);
                return;
            } else if (buttonId === 'support') {
                await sock.sendMessage(chatId, {
                    text: `الدعم\n\nكلم المطور MHD`
                }, { quoted: message });
                return;
            }
        }

        const userMessage = (
            message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            message.message?.buttonsResponseMessage?.selectedButtonId?.trim() ||
            ''
        ).toLowerCase().replace(/\.\s+/g, '.').trim();

        // Preserve raw message for commands like .tag that need original casing
        const rawText = message.message?.conversation?.trim() ||
            message.message?.extendedTextMessage?.text?.trim() ||
            message.message?.imageMessage?.caption?.trim() ||
            message.message?.videoMessage?.caption?.trim() ||
            '';

        // امر ايدي القناة بيشتغل الاول قبل اي فلاتر عشان يشتغل جوه القنوات
        if (userMessage === '.قناة' || isCmd(userMessage, '.قناة')) {
            await newsletterCommand(sock, chatId, message, rawText);
            return;
        }

        // Only log command usage
        if (userMessage.startsWith('.')) {
            console.log(`📝 Command used in ${isGroup ? 'group' : 'private'}: ${userMessage}`);
        }
        // Read bot mode once; don't early-return so moderation can still run in private mode
        let isPublic = true;
        try {
            const data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof data.isPublic === 'boolean') isPublic = data.isPublic;
        } catch (error) {
            console.error('Error checking access mode:', error);
            // default isPublic=true on error
        }
        const isOwnerOrSudoCheck = message.key.fromMe || senderIsOwnerOrSudo;
        // Check if user is banned (skip ban check for unban command)
        if (isBanned(senderId) && !isCmd(userMessage, '.فكحظر')) {
            denyReact(sock, chatId, message, userMessage);
            // Only respond occasionally to avoid spam
            if (Math.random() < 0.1) {
                await sock.sendMessage(chatId, {
                    text: 'انت محظور من استخدام البوت كلم ادمن عشان يفك الحظر',
                    ...channelInfo
                });
            }
            return;
        }

        // First check if it's a game move
        if (/^[1-9]$/.test(userMessage) || userMessage === 'استسلام') {
            await handleTicTacToeMove(sock, chatId, senderId, userMessage);
            return;
        }

        /*  // Basic message response in private chat
          if (!isGroup && (userMessage === 'hi' || userMessage === 'hello' || userMessage === 'bot' || userMessage === 'hlo' || userMessage === 'hey' || userMessage === 'bro')) {
              await sock.sendMessage(chatId, {
                  text: 'Hi, How can I help you?\nYou can use .menu for more info and commands.',
                  ...channelInfo
              });
              return;
          } */

        if (!message.key.fromMe) incrementMessageCount(chatId, senderId);

        // Check for bad words and antilink FIRST, before ANY other processing
        // Always run moderation in groups, regardless of mode
        if (isGroup) {
            // Catch non-BAE5 bot IDs (3EB0 etc.) that weren't dropped in index.js
            await handleAntibotDetection(sock, message);
            if (userMessage) {
                await handleBadwordDetection(sock, chatId, message, userMessage, senderId);
            }
            // Antilink checks message text internally, so run it even if userMessage is empty
            await Antilink(message, sock);
        }

        // PM blocker: block non-owner DMs when enabled (do not ban)
        if (!isGroup && !message.key.fromMe && !senderIsSudo) {
            try {
                const pmState = readPmBlockerState();
                if (pmState.enabled) {
                    // Inform user, delay, then block without banning globally
                    await sock.sendMessage(chatId, { text: pmState.message || 'الرسايل الخاصة مقفولة كلم صاحب البوت في الجروبات بس' });
                    await new Promise(r => setTimeout(r, 1500));
                    try { await sock.updateBlockStatus(chatId, 'block'); } catch (e) { }
                    return;
                }
            } catch (e) { }
        }

        // Then check for command prefix
        if (!userMessage.startsWith('.')) {
            // Show typing indicator if autotyping is enabled
            await handleAutotypingForMessage(sock, chatId, userMessage);

            if (isGroup) {
                // Always run moderation features (antitag) regardless of mode
                await handleTagDetection(sock, chatId, message, senderId);
                await handleMentionDetection(sock, chatId, message);

                // Only run chatbot in public mode or for owner/sudo
                if (isPublic || isOwnerOrSudoCheck) {
                    await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                }
            }
            return;
        }
        // In private mode, only owner/sudo can run commands
        if (!isPublic && !isOwnerOrSudoCheck) {
            denyReact(sock, chatId, message, userMessage);
            return;
        }

        // List of admin commands
        const adminCommands = ['.اسكت', '.اتكلم', '.حظر', '.فكحظر', '.رقي', '.نزل', '.اطرد', '.منشنالكل', '.منشنالاعضاء', '.منشنخفي', '.منعلينك', '.منعمنشن', '.منعبوت', '.منعبوت', '.وصفالجروب', '.اسمالجروب', '.صورةالجروب', '.حالةالجروب', '.حالةالجروب', '.حالةالجروب', '.حالةالجروب', '.حالةالجروب'];
        const isAdminCommand = adminCommands.some(cmd => isCmd(userMessage, cmd));

        // List of owner commands
        const ownerCommands = ['.الوضع', '.مشاهدةالحالات', '.حفظالحالات', '.حفظالحالات', '.حفظالحالات', '.منعمسح', '.تنضيفالمؤقت', '.صورةالبوت', '.تنضيفالسيشن', '.رداتلقائي', '.ردتلقائي', '.كتابةتلقائية', '.قراءةتلقائية', '.منعالخاص'];
        const isOwnerCommand = ownerCommands.some(cmd => isCmd(userMessage, cmd));

        let isSenderAdmin = false;
        let isBotAdmin = false;

        // Check admin status only for admin commands in groups
        if (isGroup && isAdminCommand) {
            const adminStatus = await isAdmin(sock, chatId, senderId);
            isSenderAdmin = adminStatus.isSenderAdmin;
            isBotAdmin = adminStatus.isBotAdmin;

            if (!isBotAdmin) {
                await sock.sendMessage(chatId, { text: 'خلي البوت ادمن عشان تستخدم اوامر الادمن', ...channelInfo }, { quoted: message });
                return;
            }

            if (
                isCmd(userMessage, '.اسكت') ||
                userMessage === '.اتكلم' ||
                isCmd(userMessage, '.حظر') ||
                isCmd(userMessage, '.فكحظر') ||
                isCmd(userMessage, '.رقي') ||
                isCmd(userMessage, '.نزل')
            ) {
                if (!isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, {
                        text: 'الامر ده للادمنز بس',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
            }
        }

        // Check owner status for owner commands
        if (isOwnerCommand) {
            if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                await sock.sendMessage(chatId, { text: 'الامر ده لصاحب البوت والمساعدين بس' }, { quoted: message });
                return;
            }
        }

        // Command handlers - Execute commands immediately without waiting for typing indicator
        // We'll show typing indicator after command execution if needed
        // ريأكشن مناسب على رسالة الامر (البنج بيعمل الريأكشن بتاعه بنفسه)
        if (!isCmd(userMessage, '.بنج') && !userMessage.startsWith('.بنج')) {
            reactForCommand(sock, chatId, message, userMessage);
        }

        let commandExecuted = false;

        switch (true) {
            case userMessage === '.لصورة': {
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                if (quotedMessage?.stickerMessage) {
                    await simageCommand(sock, quotedMessage, chatId);
                } else {
                    await sock.sendMessage(chatId, { text: 'رد على ملصق بالامر .لصورة عشان يتحول', ...channelInfo }, { quoted: message });
                }
                commandExecuted = true;
                break;
            }
            case isCmd(userMessage, '.اطرد'):
                const mentionedJidListKick = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await kickCommand(sock, chatId, senderId, mentionedJidListKick, message);
                break;
            case isCmd(userMessage, '.اسكت'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const muteArg = parts[1];
                    const muteDuration = muteArg !== undefined ? parseInt(muteArg, 10) : undefined;
                    if (muteArg !== undefined && (isNaN(muteDuration) || muteDuration <= 0)) {
                        await sock.sendMessage(chatId, { text: 'اكتب عدد دقايق صحيح او استخدم .اسكت من غير رقم عشان تكتم فورا', ...channelInfo }, { quoted: message });
                    } else {
                        await muteCommand(sock, chatId, senderId, message, muteDuration);
                    }
                }
                break;
            case userMessage === '.اتكلم':
                await unmuteCommand(sock, chatId, senderId);
                break;
            case isCmd(userMessage, '.حظر'):
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: 'امر الحظر في الخاص لصاحب البوت والمساعدين بس' }, { quoted: message });
                        break;
                    }
                }
                await banCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.فكحظر'):
                if (!isGroup) {
                    if (!message.key.fromMe && !senderIsSudo) {
                        await sock.sendMessage(chatId, { text: 'امر فك الحظر في الخاص لصاحب البوت والمساعدين بس' }, { quoted: message });
                        break;
                    }
                }
                await unbanCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.قسم'):
                await helpCommand.helpSectionCommand(sock, chatId, message, userMessage.split(/\s+/)[1]);
                commandExecuted = true;
                break;
            case userMessage === '.مساعدة' || userMessage === '.المنيو' || userMessage === '.مساعدة' || userMessage === '.مساعدة':
                await helpCommand(sock, chatId, message, global.channelLink);
                commandExecuted = true;
                break;
            case userMessage === '.ملصق' || userMessage === '.ملصق':
                await stickerCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case isCmd(userMessage, '.انذارات'):
                const mentionedJidListWarnings = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warningsCommand(sock, chatId, mentionedJidListWarnings);
                break;
            case isCmd(userMessage, '.انذار'):
                const mentionedJidListWarn = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await warnCommand(sock, chatId, senderId, mentionedJidListWarn, message);
                break;
            case isCmd(userMessage, '.انطق'):
                const text = argsOf(userMessage);
                await ttsCommand(sock, chatId, text, message);
                break;
            case isCmd(userMessage, '.امسح') || isCmd(userMessage, '.امسح'):
                await deleteCommand(sock, chatId, message, senderId);
                break;
            case isCmd(userMessage, '.متحرك'):
                await attpCommand(sock, chatId, message);
                break;

            case userMessage === '.الاعدادات':
                await settingsCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.الوضع'):
                // Check if sender is the owner
                if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                    await sock.sendMessage(chatId, { text: 'الامر ده لصاحب البوت بس', ...channelInfo }, { quoted: message });
                    return;
                }
                // Read current data first
                let data;
                try {
                    data = JSON.parse(fs.readFileSync('./data/messageCount.json'));
                } catch (error) {
                    console.error('Error reading access mode:', error);
                    await sock.sendMessage(chatId, { text: 'معرفتش اقرا وضع البوت', ...channelInfo });
                    return;
                }

                const action = userMessage.split(' ')[1]?.toLowerCase();
                // If no argument provided, show current status
                if (!action) {
                    const currentMode = data.isPublic ? 'public' : 'private';
                    await sock.sendMessage(chatId, {
                        text: `وضع البوت الحالي ${currentMode}\n\nطريقة الاستخدام .الوضع عام او خاص\n\nمثال\n.الوضع عام  الكل يقدر يستخدم البوت\n.الوضع خاص  صاحب البوت بس`,
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                if (action !== 'public' && action !== 'private') {
                    await sock.sendMessage(chatId, {
                        text: 'طريقة الاستخدام .الوضع عام او خاص\n\nمثال\n.الوضع عام  الكل يقدر يستخدم البوت\n.الوضع خاص  صاحب البوت بس',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }

                try {
                    // Update access mode
                    data.isPublic = action === 'public';

                    // Save updated data
                    fs.writeFileSync('./data/messageCount.json', JSON.stringify(data, null, 2));

                    await sock.sendMessage(chatId, { text: `البوت دلوقتي في الوضع ${action}`, ...channelInfo });
                } catch (error) {
                    console.error('Error updating access mode:', error);
                    await sock.sendMessage(chatId, { text: 'معرفتش اغير وضع البوت', ...channelInfo });
                }
                break;
            case isCmd(userMessage, '.منعمكالمات'):
                if (!message.key.fromMe && !senderIsOwnerOrSudo) {
                    await sock.sendMessage(chatId, { text: 'منع المكالمات لصاحب البوت والمساعدين بس' }, { quoted: message });
                    break;
                }
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await anticallCommand(sock, chatId, message, args);
                }
                break;
            case isCmd(userMessage, '.منعالخاص'):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    await pmblockerCommand(sock, chatId, message, args);
                }
                commandExecuted = true;
                break;
            case userMessage === '.المالك':
                await ownerCommand(sock, chatId);
                break;
            case userMessage === '.منشنالكل':
                await tagAllCommand(sock, chatId, senderId, message);
                break;
            case userMessage === '.منشنالاعضاء':
                await tagNotAdminCommand(sock, chatId, senderId, message);
                break;
            case isCmd(userMessage, '.منشنخفي'):
                {
                    const messageText = argsOf(rawText);
                    const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                    await hideTagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                }
                break;
            case isCmd(userMessage, '.منشن'):
                const messageText = argsOf(rawText);  // use rawText here, not userMessage
                const replyMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
                await tagCommand(sock, chatId, senderId, messageText, replyMessage, message);
                break;
            case isCmd(userMessage, '.منعبوت') || isCmd(userMessage, '.منعبوت'):
                await antibotCommand(sock, chatId, message, senderId);
                break;
            case isCmd(userMessage, '.منعلينك'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'الامر ده بيشتغل في الجروبات بس',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'خلي البوت ادمن الاول',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                await handleAntilinkCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                break;
            case isCmd(userMessage, '.منعمنشن'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, {
                        text: 'الامر ده بيشتغل في الجروبات بس',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, {
                        text: 'خلي البوت ادمن الاول',
                        ...channelInfo
                    }, { quoted: message });
                    return;
                }
                await handleAntitagCommand(sock, chatId, userMessage, senderId, isSenderAdmin, message);
                break;
            case userMessage === '.ميمز':
                await memeCommand(sock, chatId, message);
                break;
            case userMessage === '.نكتة':
                await jokeCommand(sock, chatId, message);
                break;
            case userMessage === '.اقتباس':
                await quoteCommand(sock, chatId, message);
                break;
            case userMessage === '.معلومة':
                await factCommand(sock, chatId, message, message);
                break;
            case isCmd(userMessage, '.الطقس'):
                const city = argsOf(userMessage);
                if (city) {
                    await weatherCommand(sock, chatId, message, city);
                } else {
                    await sock.sendMessage(chatId, { text: 'اكتب اسم المدينة مثال .الطقس القاهرة', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage === '.اخبار':
                await newsCommand(sock, chatId);
                break;
            case isCmd(userMessage, '.اكساو') || isCmd(userMessage, '.اكساو'):
                const tttText = userMessage.split(' ').slice(1).join(' ');
                await tictactoeCommand(sock, chatId, senderId, tttText);
                break;
            case isCmd(userMessage, '.حرك'):
                const position = parseInt(userMessage.split(' ')[1]);
                if (isNaN(position)) {
                    await sock.sendMessage(chatId, { text: 'اكتب رقم صحيح للعب في اكس او', ...channelInfo }, { quoted: message });
                } else {
                    tictactoeMove(sock, chatId, senderId, position);
                }
                break;
            case userMessage === '.اعلىالاعضاء':
                topMembers(sock, chatId, isGroup);
                break;
            case isCmd(userMessage, '.المشنقة'):
                startHangman(sock, chatId);
                break;
            case isCmd(userMessage, '.خمن'):
                const guessedLetter = userMessage.split(' ')[1];
                if (guessedLetter) {
                    guessLetter(sock, chatId, guessedLetter);
                } else {
                    sock.sendMessage(chatId, { text: 'خمن حرف بالامر .خمن وبعده الحرف', ...channelInfo }, { quoted: message });
                }
                break;
            case isCmd(userMessage, '.سؤال'):
                startTrivia(sock, chatId);
                break;
            case isCmd(userMessage, '.اجابة'):
                const answer = userMessage.split(' ').slice(1).join(' ');
                if (answer) {
                    answerTrivia(sock, chatId, answer);
                } else {
                    sock.sendMessage(chatId, { text: 'اكتب اجابتك بالامر .اجابة وبعدها الاجابة', ...channelInfo }, { quoted: message });
                }
                break;
            case isCmd(userMessage, '.مجاملة'):
                await complimentCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.اهانة'):
                await insultCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.كورة'):
                const question = userMessage.split(' ').slice(1).join(' ');
                await eightBallCommand(sock, chatId, question);
                break;
            case isCmd(userMessage, '.كلمات'):
                const songTitle = userMessage.split(' ').slice(1).join(' ');
                await lyricsCommand(sock, chatId, songTitle, message);
                break;
            case isCmd(userMessage, '.سمب'):
                const quotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await simpCommand(sock, chatId, quotedMsg, mentionedJid, senderId);
                break;
            case isCmd(userMessage, '.غبي') || isCmd(userMessage, '.غبي') || isCmd(userMessage, '.غبي'):
                const stupidQuotedMsg = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                const stupidMentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
                const stupidArgs = userMessage.split(' ').slice(1);
                await stupidCommand(sock, chatId, stupidQuotedMsg, stupidMentionedJid, senderId, stupidArgs);
                break;
            case userMessage === '.تحدي':
                await dareCommand(sock, chatId, message);
                break;
            case userMessage === '.صراحة':
                await truthCommand(sock, chatId, message);
                break;
            case userMessage === '.نضف':
                if (isGroup) await clearCommand(sock, chatId);
                break;
            case isCmd(userMessage, '.رقي'):
                const mentionedJidListPromote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await promoteCommand(sock, chatId, mentionedJidListPromote, message);
                break;
            case isCmd(userMessage, '.نزل'):
                const mentionedJidListDemote = message.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                await demoteCommand(sock, chatId, mentionedJidListDemote, message);
                break;
            case userMessage === '.بنج':
                await pingCommand(sock, chatId, message);
                break;
            case userMessage === '.شغال':
                await aliveCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.منشنالبوت'):
                {
                    const args = userMessage.split(' ').slice(1).join(' ');
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await mentionToggleCommand(sock, chatId, message, args, isOwner);
                }
                break;
            case userMessage === '.ضبطالمنشن':
                {
                    const isOwner = message.key.fromMe || senderIsSudo;
                    await setMentionCommand(sock, chatId, message, isOwner);
                }
                break;
            case isCmd(userMessage, '.بلور'):
                const quotedMessage = message.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                await blurCommand(sock, chatId, message, quotedMessage);
                break;
            case isCmd(userMessage, '.ترحيب'):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await welcomeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'الامر ده للادمنز بس', ...channelInfo }, { quoted: message });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'الامر ده بيشتغل في الجروبات بس', ...channelInfo }, { quoted: message });
                }
                break;
            case isCmd(userMessage, '.وداع'):
                if (isGroup) {
                    // Check admin status if not already checked
                    if (!isSenderAdmin) {
                        const adminStatus = await isAdmin(sock, chatId, senderId);
                        isSenderAdmin = adminStatus.isSenderAdmin;
                    }

                    if (isSenderAdmin || message.key.fromMe) {
                        await goodbyeCommand(sock, chatId, message);
                    } else {
                        await sock.sendMessage(chatId, { text: 'الامر ده للادمنز بس', ...channelInfo }, { quoted: message });
                    }
                } else {
                    await sock.sendMessage(chatId, { text: 'الامر ده بيشتغل في الجروبات بس', ...channelInfo }, { quoted: message });
                }
                break;
            case userMessage === '.ريبو':
            case userMessage === '.ريبو':
            case userMessage === '.ريبو':
            case userMessage === '.ريبو':
            case userMessage === '.ريبو':
                await githubCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.منعسب'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'الامر ده بيشتغل في الجروبات بس', ...channelInfo }, { quoted: message });
                    return;
                }

                const adminStatus = await isAdmin(sock, chatId, senderId);
                isSenderAdmin = adminStatus.isSenderAdmin;
                isBotAdmin = adminStatus.isBotAdmin;

                if (!isBotAdmin) {
                    await sock.sendMessage(chatId, { text: 'لازم البوت يبقى ادمن عشان تستخدم الميزة دي', ...channelInfo }, { quoted: message });
                    return;
                }

                await antibadwordCommand(sock, chatId, message, senderId, isSenderAdmin);
                break;
            case isCmd(userMessage, '.شات'):
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'الامر ده بيشتغل في الجروبات بس', ...channelInfo }, { quoted: message });
                    return;
                }

                // Check if sender is admin or bot owner
                const chatbotAdminStatus = await isAdmin(sock, chatId, senderId);
                if (!chatbotAdminStatus.isSenderAdmin && !message.key.fromMe) {
                    await sock.sendMessage(chatId, { text: 'للادمنز وصاحب البوت بس', ...channelInfo }, { quoted: message });
                    return;
                }

                const match = argsOf(userMessage);
                await handleChatbotCommand(sock, chatId, message, match);
                break;
            case isCmd(userMessage, '.خدملصق') || isCmd(userMessage, '.خدملصق'):
                {
                    const isSteal = isCmd(userMessage, '.خدملصق');
                    const sliceLen = isSteal ? 6 : 5; // '.steal' vs '.take'
                    const takeArgs = rawText.slice(sliceLen).trim().split(' ');
                    await takeCommand(sock, chatId, message, takeArgs);
                }
                break;
            case userMessage === '.غزل':
                await flirtCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.شخصية'):
                await characterCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.ضايع'):
                await wastedCommand(sock, chatId, message);
                break;
            case userMessage === '.حب':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'الامر ده بيشتغل في الجروبات بس', ...channelInfo }, { quoted: message });
                    return;
                }
                await shipCommand(sock, chatId, message);
                break;
            case userMessage === '.الجروب' || userMessage === '.الجروب' || userMessage === '.الجروب':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'الامر ده بيشتغل في الجروبات بس', ...channelInfo }, { quoted: message });
                    return;
                }
                await groupInfoCommand(sock, chatId, message);
                break;
            case userMessage === '.لينكجديد' || userMessage === '.لينكجديد' || userMessage === '.لينكجديد':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'الامر ده بيشتغل في الجروبات بس', ...channelInfo }, { quoted: message });
                    return;
                }
                await resetlinkCommand(sock, chatId, senderId);
                break;
            case userMessage === '.الادمنز' || userMessage === '.الادمنز' || userMessage === '.الادمنز':
                if (!isGroup) {
                    await sock.sendMessage(chatId, { text: 'الامر ده بيشتغل في الجروبات بس', ...channelInfo }, { quoted: message });
                    return;
                }
                await staffCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.رابط') || isCmd(userMessage, '.رابط'):
                await urlCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.دمجايموجي') || isCmd(userMessage, '.دمجايموجي'):
                await emojimixCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.ملصقتليجرام') || isCmd(userMessage, '.ملصقتليجرام') || isCmd(userMessage, '.ملصقتليجرام') || isCmd(userMessage, '.ملصقتليجرام'):
                await stickerTelegramCommand(sock, chatId, message);
                break;

            case userMessage === '.فتح':
                await viewOnceCommand(sock, chatId, message);
                break;
            case userMessage === '.فتح2':
                await vv2Command(sock, chatId, message, senderId);
                break;
            case userMessage === '.تنضيفالسيشن' || userMessage === '.تنضيفالسيشن':
                await clearSessionCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.مشاهدةالحالات'):
                const autoStatusArgs = userMessage.split(' ').slice(1);
                await autoStatusCommand(sock, chatId, message, autoStatusArgs);
                break;
            case isCmd(userMessage, '.حفظالحالات') || isCmd(userMessage, '.حفظالحالات') || isCmd(userMessage, '.حفظالحالات'):
                await savestatusCommand(sock, chatId, message, senderId);
                break;
            case isCmd(userMessage, '.حالةالجروب') || isCmd(userMessage, '.حالةالجروب') || isCmd(userMessage, '.حالةالجروب') || isCmd(userMessage, '.حالةالجروب') || userMessage === '.حالةالجروب' || isCmd(userMessage, '.حالةالجروب'):
                await groupstatusCommand(sock, chatId, message, senderId);
                break;
            case isCmd(userMessage, '.سمب'):
                await simpCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.معدن'):
                await textmakerCommand(sock, chatId, message, userMessage, 'metallic');
                break;
            case isCmd(userMessage, '.تلج'):
                await textmakerCommand(sock, chatId, message, userMessage, 'ice');
                break;
            case isCmd(userMessage, '.ثلج'):
                await textmakerCommand(sock, chatId, message, userMessage, 'snow');
                break;
            case isCmd(userMessage, '.مبهر'):
                await textmakerCommand(sock, chatId, message, userMessage, 'impressive');
                break;
            case isCmd(userMessage, '.ماتريكس'):
                await textmakerCommand(sock, chatId, message, userMessage, 'matrix');
                break;
            case isCmd(userMessage, '.ضوء'):
                await textmakerCommand(sock, chatId, message, userMessage, 'light');
                break;
            case isCmd(userMessage, '.نيون'):
                await textmakerCommand(sock, chatId, message, userMessage, 'neon');
                break;
            case isCmd(userMessage, '.شيطان'):
                await textmakerCommand(sock, chatId, message, userMessage, 'devil');
                break;
            case isCmd(userMessage, '.بنفسجي'):
                await textmakerCommand(sock, chatId, message, userMessage, 'purple');
                break;
            case isCmd(userMessage, '.رعد'):
                await textmakerCommand(sock, chatId, message, userMessage, 'thunder');
                break;
            case isCmd(userMessage, '.ورق'):
                await textmakerCommand(sock, chatId, message, userMessage, 'leaves');
                break;
            case isCmd(userMessage, '.فيلم1917'):
                await textmakerCommand(sock, chatId, message, userMessage, '1917');
                break;
            case isCmd(userMessage, '.ارينا'):
                await textmakerCommand(sock, chatId, message, userMessage, 'arena');
                break;
            case isCmd(userMessage, '.هاكر'):
                await textmakerCommand(sock, chatId, message, userMessage, 'hacker');
                break;
            case isCmd(userMessage, '.رمل'):
                await textmakerCommand(sock, chatId, message, userMessage, 'sand');
                break;
            case isCmd(userMessage, '.بلاكبينك'):
                await textmakerCommand(sock, chatId, message, userMessage, 'blackpink');
                break;
            case isCmd(userMessage, '.جليتش'):
                await textmakerCommand(sock, chatId, message, userMessage, 'glitch');
                break;
            case isCmd(userMessage, '.نار'):
                await textmakerCommand(sock, chatId, message, userMessage, 'fire');
                break;
            case isCmd(userMessage, '.منعمسح'):
                const antideleteMatch = argsOf(userMessage);
                await handleAntideleteCommand(sock, chatId, message, antideleteMatch);
                break;
            case userMessage === '.استسلام':
                // Handle surrender command for tictactoe game
                await handleTicTacToeMove(sock, chatId, senderId, 'استسلام');
                break;
            case userMessage === '.تنضيفالمؤقت':
                await clearTmpCommand(sock, chatId, message);
                break;
            case userMessage === '.صورةالبوت':
                await setProfilePicture(sock, chatId, message);
                break;
            case isCmd(userMessage, '.وصفالجروب'):
                {
                    const text = argsOf(rawText);
                    await setGroupDescription(sock, chatId, senderId, text, message);
                }
                break;
            case isCmd(userMessage, '.اسمالجروب'):
                {
                    const text = argsOf(rawText);
                    await setGroupName(sock, chatId, senderId, text, message);
                }
                break;
            case isCmd(userMessage, '.صورةالجروب'):
                await setGroupPhoto(sock, chatId, senderId, message);
                break;
            case isCmd(userMessage, '.انستجرام') || isCmd(userMessage, '.انستجرام') || (userMessage === '.انستجرام' || isCmd(userMessage, '.انستجرام')):
                await instagramCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.انستاسكرين'):
                await igsCommand(sock, chatId, message, true);
                break;
            case isCmd(userMessage, '.انستاستوري'):
                await igsCommand(sock, chatId, message, false);
                break;
            case isCmd(userMessage, '.فيسبوك') || isCmd(userMessage, '.فيسبوك'):
                await facebookCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.تويتر') || isCmd(userMessage, '.تويتر') || userMessage === '.تويتر' || isCmd(userMessage, '.تويتر') || isCmd(userMessage, '.تويتر'):
                await twitterCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.موسيقى'):
                await playCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.سبوتيفاي'):
                await spotifyCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.شغل') || isCmd(userMessage, '.شغل') || isCmd(userMessage, '.شغل') || isCmd(userMessage, '.اغنية'):
                await songCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.فيديو') || isCmd(userMessage, '.فيديو'):
                await videoCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.تيكتوك') || isCmd(userMessage, '.تيكتوك'):
                await tiktokCommand(sock, chatId, message);
                break;
            case userMessage === '.ذكاء' || isCmd(userMessage, '.ذكاء') || isCmd(userMessage, '.جيبيتي') || isCmd(userMessage, '.جيميني'):
                await aiCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.ترجم') || isCmd(userMessage, '.ترجم'):
                await handleTranslateCommand(sock, chatId, message, ' ' + argsOf(userMessage));
                return;
            case isCmd(userMessage, '.سكرين') || isCmd(userMessage, '.سكرين') || isCmd(userMessage, '.سكرين'):
                await handleSsCommand(sock, chatId, message, argsOf(userMessage));
                break;
            case isCmd(userMessage, '.رداتلقائي') || isCmd(userMessage, '.ردتلقائي') || isCmd(userMessage, '.رداتلقائي'):
                await handleAreactCommand(sock, chatId, message, isOwnerOrSudoCheck);
                break;
            case isCmd(userMessage, '.مساعد'):
                await sudoCommand(sock, chatId, message);
                break;
            case userMessage === '.تصبحعلىخير' || userMessage === '.تصبحعلىخير' || userMessage === '.تصبحعلىخير':
                await goodnightCommand(sock, chatId, message);
                break;
            case userMessage === '.شعر' || userMessage === '.شعر':
                await shayariCommand(sock, chatId, message);
                break;
            case userMessage === '.وردة':
                await rosedayCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.تخيل') || isCmd(userMessage, '.فلاكس') || isCmd(userMessage, '.تخيل'): await imagineCommand(sock, chatId, message);
                break;
            case userMessage === '.الايدي': await groupJidCommand(sock, chatId, message);
                break;
            case isCmd(userMessage, '.كتابةتلقائية'):
                await autotypingCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case isCmd(userMessage, '.قراءةتلقائية'):
                await autoreadCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case isCmd(userMessage, '.قلب'):
                await handleHeart(sock, chatId, message);
                break;
            case isCmd(userMessage, '.مثير'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['horny', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case isCmd(userMessage, '.دايرة'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['circle', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case isCmd(userMessage, '.قوسقزح'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['lgbt', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case isCmd(userMessage, '.شرطة'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['lolice', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case isCmd(userMessage, '.كارتسمب'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['simpcard', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case isCmd(userMessage, '.تونيكاوا'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['tonikawa', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case isCmd(userMessage, '.كارتغبي'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['its-so-stupid', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case isCmd(userMessage, '.كارتاسم'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['namecard', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;

            case isCmd(userMessage, '.حكيم2'):
            case isCmd(userMessage, '.حكيم'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = isCmd(userMessage, '.حكيم2') ? 'oogway2' : 'oogway';
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case isCmd(userMessage, '.تويت'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['tweet', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case isCmd(userMessage, '.كومنتيوتيوب'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = ['youtube-comment', ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case isCmd(userMessage, '.رفيق'):
            case isCmd(userMessage, '.قزح'):
            case isCmd(userMessage, '.زجاج'):
            case isCmd(userMessage, '.سجن'):
            case isCmd(userMessage, '.نجحت'):
            case isCmd(userMessage, '.غضب'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const sub = toEnglish(userMessage.slice(1).split(/\s+/)[0]);
                    const args = [sub, ...parts.slice(1)];
                    await miscCommand(sock, chatId, message, args);
                }
                break;
            case isCmd(userMessage, '.انمي'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await animeCommand(sock, chatId, message, args);
                }
                break;
            // animu aliases
            case isCmd(userMessage, '.ياكل'):
            case isCmd(userMessage, '.نكزة'):
            case isCmd(userMessage, '.عياط'):
            case isCmd(userMessage, '.بوسة'):
            case isCmd(userMessage, '.طبطبة'):
            case isCmd(userMessage, '.حضن'):
            case isCmd(userMessage, '.غمزة'):
            case isCmd(userMessage, '.ضربجبهة'):
            case isCmd(userMessage, '.ضربجبهة'):
            case isCmd(userMessage, '.اقتباسانمي'):
            case isCmd(userMessage, '.اقتباس'):
            case isCmd(userMessage, '.لولي'):
                {
                    const parts = userMessage.trim().split(/\s+/);
                    let sub = toEnglish(parts[0].slice(1));
                    if (sub === 'facepalm') sub = 'face-palm';
                    if (sub === 'quote' || sub === 'animuquote') sub = 'quote';
                    await animeCommand(sock, chatId, message, [sub]);
                }
                break;
            case userMessage === '.قص':
                await stickercropCommand(sock, chatId, message);
                commandExecuted = true;
                break;
            case isCmd(userMessage, '.صور'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const args = parts.slice(1);
                    await piesCommand(sock, chatId, message, args);
                    commandExecuted = true;
                }
                break;
            case userMessage === '.صين':
                await piesAlias(sock, chatId, message, 'china');
                commandExecuted = true;
                break;
            case userMessage === '.اندونيسيا':
                await piesAlias(sock, chatId, message, 'indonesia');
                commandExecuted = true;
                break;
            case userMessage === '.يابان':
                await piesAlias(sock, chatId, message, 'japan');
                commandExecuted = true;
                break;
            case userMessage === '.كوريا':
                await piesAlias(sock, chatId, message, 'korea');
                commandExecuted = true;
                break;
            case userMessage === '.هند':
                await piesAlias(sock, chatId, message, 'india');
                commandExecuted = true;
                break;
            case userMessage === '.ماليزيا':
                await piesAlias(sock, chatId, message, 'malaysia');
                commandExecuted = true;
                break;
            case userMessage === '.تايلاند':
                await piesAlias(sock, chatId, message, 'thailand');
                commandExecuted = true;
                break;
            case isCmd(userMessage, '.تحديث'):
                {
                    const parts = rawText.trim().split(/\s+/);
                    const zipArg = parts[1] && parts[1].startsWith('http') ? parts[1] : '';
                    await updateCommand(sock, chatId, message, zipArg);
                }
                commandExecuted = true;
                break;
            case isCmd(userMessage, '.شيلالخلفية') || isCmd(userMessage, '.شيلالخلفية') || isCmd(userMessage, '.شيلالخلفية'):
                await removebgCommand.exec(sock, message, userMessage.split(' ').slice(1));
                break;
            case isCmd(userMessage, '.حسنالصورة') || isCmd(userMessage, '.حسنالصورة') || isCmd(userMessage, '.حسنالصورة'):
                await reminiCommand(sock, chatId, message, userMessage.split(' ').slice(1));
                break;
            case isCmd(userMessage, '.سورا'):
                await soraCommand(sock, chatId, message);
                break;
            default:
                if (isGroup) {
                    // Handle non-command group messages
                    if (userMessage) {  // Make sure there's a message
                        await handleChatbotResponse(sock, chatId, message, userMessage, senderId);
                    }
                    await handleTagDetection(sock, chatId, message, senderId);
                    await handleMentionDetection(sock, chatId, message);
                }
                commandExecuted = false;
                break;
        }

        // If a command was executed, show typing status after command execution
        if (commandExecuted !== false) {
            // Command was executed, now show typing status after command execution
            await showTypingAfterCommand(sock, chatId);
        }

        // Function to handle .groupjid command
        async function groupJidCommand(sock, chatId, message) {
            const groupJid = message.key.remoteJid;

            if (!groupJid.endsWith('@g.us')) {
                return await sock.sendMessage(chatId, {
                    text: "الامر ده بيشتغل في الجروبات بس"
                });
            }

            await sock.sendMessage(chatId, {
                text: `ايدي الجروب ${groupJid}`
            }, {
                quoted: message
            });
        }

        if (userMessage.startsWith('.')) {
            // After command is processed successfully
            await addCommandReaction(sock, message);
        }
    } catch (error) {
        console.error('❌ Error in message handler:', error.message);
        // Only try to send error message if we have a valid chatId
        if (chatId) {
            await sock.sendMessage(chatId, {
                text: 'معرفتش انفذ الامر',
                ...channelInfo
            });
        }
    }
}

async function handleGroupParticipantUpdate(sock, update) {
    try {
        const { id, participants, action, author } = update;

        // Check if it's a group
        if (!id.endsWith('@g.us')) return;

        // Respect bot mode: only announce promote/demote in public mode
        let isPublic = true;
        try {
            const modeData = JSON.parse(fs.readFileSync('./data/messageCount.json'));
            if (typeof modeData.isPublic === 'boolean') isPublic = modeData.isPublic;
        } catch (e) {
            // If reading fails, default to public behavior
        }

        // Handle promotion events
        if (action === 'promote') {
            if (!isPublic) return;
            await handlePromotionEvent(sock, id, participants, author);
            return;
        }

        // Handle demotion events
        if (action === 'demote') {
            if (!isPublic) return;
            await handleDemotionEvent(sock, id, participants, author);
            return;
        }

        // Handle join events
        if (action === 'add') {
            await handleJoinEvent(sock, id, participants);
        }

        // Handle leave events
        if (action === 'remove') {
            await handleLeaveEvent(sock, id, participants);
        }
    } catch (error) {
        console.error('Error in handleGroupParticipantUpdate:', error);
    }
}

// Instead, export the handlers along with handleMessages
module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus: async (sock, status) => {
        await handleStatusUpdate(sock, status);
        try {
            // Only full status messages (messages.upsert) — never reactions / empty updates
            const msg = status.messages?.[0];
            if (msg?.message && msg.key?.remoteJid === 'status@broadcast') {
                await savestatusAutoSave(sock, msg);
            }
        } catch (e) {
            console.error('[savestatus] hook:', e?.message || e);
        }
    }
};