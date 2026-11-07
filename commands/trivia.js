const axios = require('axios');

let triviaGames = {};

async function startTrivia(sock, chatId) {
    if (triviaGames[chatId]) {
        sock.sendMessage(chatId, { text: 'فيه لعبة اسئلة شغالة بالفعل' });
        return;
    }

    try {
        const response = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
        const questionData = response.data.results[0];

        triviaGames[chatId] = {
            question: questionData.question,
            correctAnswer: questionData.correct_answer,
            options: [...questionData.incorrect_answers, questionData.correct_answer].sort(),
        };

        sock.sendMessage(chatId, {
            text: `وقت الاسئلة\n\nالسؤال ${triviaGames[chatId].question}\nالاختيارات\n${triviaGames[chatId].options.join('\n')}`
        });
    } catch (error) {
        sock.sendMessage(chatId, { text: 'حصل خطأ وانا بجيب السؤال جرب تاني بعد شوية' });
    }
}

function answerTrivia(sock, chatId, answer) {
    if (!triviaGames[chatId]) {
        sock.sendMessage(chatId, { text: 'مفيش لعبة اسئلة شغالة' });
        return;
    }

    const game = triviaGames[chatId];

    if (answer.toLowerCase() === game.correctAnswer.toLowerCase()) {
        sock.sendMessage(chatId, { text: `اجابة صح الاجابة هي ${game.correctAnswer}` });
    } else {
        sock.sendMessage(chatId, { text: `اجابة غلط الاجابة الصح كانت ${game.correctAnswer}` });
    }

    delete triviaGames[chatId];
}

module.exports = { startTrivia, answerTrivia };
