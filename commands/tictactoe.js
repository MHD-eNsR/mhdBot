const TicTacToe = require('../lib/tictactoe');
const { BAR, footer } = require('../lib/style');

// رموز اللعبة: X = ❌ و O = ⭕ والارقام ايموجي
const SYMBOLS = { X: '❌', O: '⭕', 1: '1️⃣', 2: '2️⃣', 3: '3️⃣', 4: '4️⃣', 5: '5️⃣', 6: '6️⃣', 7: '7️⃣', 8: '8️⃣', 9: '9️⃣' };
const LRM = '\u200E'; // علامة اتجاه عشان الصف يتعرض 1 2 3 مش 3 2 1

function boardText(arr) {
    return [arr.slice(0, 3), arr.slice(3, 6), arr.slice(6)].map((row) => LRM + row.join(' ')).join('\n');
}

function gameCard(title, lines) {
    return [BAR, `│🎮┊ *${title}*`, BAR, ...lines, BAR, footer()].join('\n');
}


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

            const arr = room.game.render().map(v => SYMBOLS[v]);

            const str = gameCard('لعبة اكس او بدأت', [
                `⏳ مستني @${room.game.currentTurn.split('@')[0]} يلعب`,
                '',
                boardText(arr),
                '',
                `🔢 رقم الغرفة ${room.id}`,
                '📜 *القواعد*',
                '• كون 3 رموز ورا بعض افقي او رأسي او قطري عشان تكسب',
                '• اكتب رقم من 1 لـ 9 عشان تحط رمزك',
                '• اكتب استسلام لو عايز تستسلم'
            ]);

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

        const isSurrender = /^(surrender|give up|استسلام)$/i.test(text);
        
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

        const arr = room.game.render().map(v => SYMBOLS[v]);

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
            gameStatus = `🏆 @${winner.split('@')[0]} كسب اللعبة`;
        } else if (isTie) {
            gameStatus = `🤝 اللعبة خلصت بتعادل`;
        } else {
            gameStatus = `⏳ الدور على @${room.game.currentTurn.split('@')[0]} ${senderId === room.game.playerX ? '⭕' : '❌'}`;
        }

        const str = gameCard('لعبة اكس او', [
            gameStatus,
            '',
            boardText(arr),
            '',
            `❌ اللاعب @${room.game.playerX.split('@')[0]}`,
            `⭕ اللاعب @${room.game.playerO.split('@')[0]}`,
            ...(!winner && !isTie ? ['', '• اكتب رقم من 1 لـ 9 عشان تلعب', '• اكتب استسلام عشان تستسلم'] : [])
        ]);

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
