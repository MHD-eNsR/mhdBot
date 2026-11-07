async function resetlinkCommand(sock, chatId, senderId) {
    try {
        // Check if sender is admin
        const groupMetadata = await sock.groupMetadata(chatId);
        const isAdmin = groupMetadata.participants
            .filter(p => p.admin)
            .map(p => p.id)
            .includes(senderId);

        // Check if bot is admin
        const botId = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        const isBotAdmin = groupMetadata.participants
            .filter(p => p.admin)
            .map(p => p.id)
            .includes(botId);

        if (!isAdmin) {
            await sock.sendMessage(chatId, { text: 'الامر ده للادمنز بس' });
            return;
        }

        if (!isBotAdmin) {
            await sock.sendMessage(chatId, { text: 'لازم البوت يبقى ادمن عشان يغير لينك الجروب' });
            return;
        }

        // Reset the group link
        const newCode = await sock.groupRevokeInvite(chatId);
        
        // Send the new link
        await sock.sendMessage(chatId, { 
            text: `لينك الجروب اتغير بنجاح\n\nاللينك الجديد\nhttps://chat.whatsapp.com/${newCode}`
        });

    } catch (error) {
        console.error('Error in resetlink command:', error);
        await sock.sendMessage(chatId, { text: 'معرفتش اغير لينك الجروب' });
    }
}

module.exports = resetlinkCommand; 