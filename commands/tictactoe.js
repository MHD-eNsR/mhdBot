const TicTacToe = require('../lib/tictactoe');

// Store games globally
const games = {};

async function tictactoeCommand(sock, chatId, senderId, text) {
    try {
        // Check if player is already in a game
        if (Object.values(games).find(room => 
            room.id.startsWith('tictactoe') && 
            [room.game.playerX, room.game.playerO].includes(senderId)
        )) {
            await sock.sendMessage(chatId, { 
                text: 'انت لسه في لعبة اكتب استسلام عشان تخرج' 
            });
            return;
        }

        // Look for existing room
        let room = Object.values(games).find(room => 
            room.state === 'WAITING' && 
            (text ? room.name === text : true)
        );

        if (room) {
            // Join existing room
            room.o = chatId;
            room.game.playerO = senderId;
            room.state = 'PLAYING';

            const arr = room.game.render().map(v => ({
                'X': 'X',
                'O': 'O',
                '1': '1',
                '2': '2',
                '3': '3',
                '4': '4',
                '5': '5',
                '6': '6',
                '7': '7',
                '8': '8',
                '9': '9',
            }[v]));

            const str = `\nلعبة اكس او بدأت\n\nمستني @${room.game.currentTurn.split('@')[0]} يلعب\n\n${arr.slice(0, 3).join(' ')}\n${arr.slice(3, 6).join(' ')}\n${arr.slice(6).join(' ')}\n\nرقم الغرفة ${room.id}\nالقواعد\n• كون 3 رموز ورا بعض افقي او رأسي او قطري عشان تكسب\n• اكتب رقم من 1 لـ 9 عشان تحط رمزك\n• اكتب استسلام لو عايز تستسلم\n`;

            // Send message only once to the group
            await sock.sendMessage(chatId, { 
                text: str,
                mentions: [room.game.currentTurn, room.game.playerX, room.game.playerO]
            });

        } else {
            // Create new room
            room = {
                id: 'tictactoe-' + (+new Date),
                x: chatId,
                o: '',
                game: new TicTacToe(senderId, 'o'),
                state: 'WAITING'
            };

            if (text) room.name = text;

            await sock.sendMessage(chatId, { 
                text: `مستني الخصم\nاكتب .اكس-او ${text || ''} عشان تدخل اللعبة`
            });

            games[room.id] = room;
        }

    } catch (error) {
        console.error('Error in tictactoe command:', error);
        await sock.sendMessage(chatId, { 
            text: 'حصل خطأ وانا ببدأ اللعبة جرب تاني' 
        });
    }
}

async function handleTicTacToeMove(sock, chatId, senderId, text) {
    try {
        // Find player's game
        const room = Object.values(games).find(room => 
            room.id.startsWith('tictactoe') && 
            [room.game.playerX, room.game.playerO].includes(senderId) && 
            room.state === 'PLAYING'
        );

        if (!room) return;

        const isSurrender = /^(surrender|give up)$/i.test(text);
        
        if (!isSurrender && !/^[1-9]$/.test(text)) return;

        // Allow surrender at any time, not just during player's turn
        if (senderId !== room.game.currentTurn && !isSurrender) {
            await sock.sendMessage(chatId, { 
                text: 'مش دورك' 
            });
            return;
        }

        let ok = isSurrender ? true : room.game.turn(
            senderId === room.game.playerO,
            parseInt(text) - 1
        );

        if (!ok) {
            await sock.sendMessage(chatId, { 
                text: 'الحركة غلط المكان ده محجوز' 
            });
            return;
        }

        let winner = room.game.winner;
        let isTie = room.game.turns === 9;

        const arr = room.game.render().map(v => ({
            'X': 'X',
            'O': 'O',
            '1': '1',
            '2': '2',
            '3': '3',
            '4': '4',
            '5': '5',
            '6': '6',
            '7': '7',
            '8': '8',
            '9': '9',
        }[v]));

        if (isSurrender) {
            // Set the winner to the opponent of the surrendering player
            winner = senderId === room.game.playerX ? room.game.playerO : room.game.playerX;
            
            // Send a surrender message
            await sock.sendMessage(chatId, { 
                text: `@${senderId.split('@')[0]} استسلم @${winner.split('@')[0]} كسب اللعبة`,
                mentions: [senderId, winner]
            });
            
            // Delete the game immediately after surrender
            delete games[room.id];
            return;
        }

        let gameStatus;
        if (winner) {
            gameStatus = `@${winner.split('@')[0]} كسب اللعبة`;
        } else if (isTie) {
            gameStatus = `اللعبة خلصت بتعادل`;
        } else {
            gameStatus = `الدور على @${room.game.currentTurn.split('@')[0]} ${senderId === room.game.playerX ? 'X' : 'O'}`;
        }

        const str = `\nلعبة اكس او\n\n${gameStatus}\n\n${arr.slice(0, 3).join(' ')}\n${arr.slice(3, 6).join(' ')}\n${arr.slice(6).join(' ')}\n\nاللاعب X @${room.game.playerX.split('@')[0]}\nاللاعب O @${room.game.playerO.split('@')[0]}\n\n${!winner && !isTie ? '• اكتب رقم من 1 لـ 9 عشان تلعب\n• اكتب استسلام عشان تستسلم' : ''}\n`;

        const mentions = [
            room.game.playerX, 
            room.game.playerO,
            ...(winner ? [winner] : [room.game.currentTurn])
        ];

        await sock.sendMessage(room.x, { 
            text: str,
            mentions: mentions
        });

        if (room.x !== room.o) {
            await sock.sendMessage(room.o, { 
                text: str,
                mentions: mentions
            });
        }

        if (winner || isTie) {
            delete games[room.id];
        }

    } catch (error) {
        console.error('Error in tictactoe move:', error);
    }
}

module.exports = {
    tictactoeCommand,
    handleTicTacToeMove
};
