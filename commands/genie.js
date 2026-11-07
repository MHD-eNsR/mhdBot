// لعبة المارد الأزرق: المارد بيخمن الشخصية اللي في بالك بأسئلة وانت بتجاوب بالأزرار
// اللعبة محلية بالكامل (بتشتغل من غير نت) والشخصيات والأسئلة في assets/genie.json

const fs = require('fs');
const path = require('path');
const buttons = require('../lib/buttons');

// الملف في assets (مش data) عشان امر .تحديث بيتخطى مجلد data كله
const DATA_FILE = path.join(__dirname, '../assets/genie.json');
const SESSION_TTL = 10 * 60 * 1000;
const MAX_QUESTIONS = 16;

// الاجابات: القيمة بتمثل درجة "نعم" (1) لـ "لا" (0)
const ANSWERS = {
    'نعم': 1,
    'لا': 0,
    'لااعرف': 0.5,
    'ربما': 0.75,
    'ربمالا': 0.25,
};

const sessions = new Map(); // chatId -> session

let DB = null;
function db() {
    if (DB) return DB;
    const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    DB = {
        questions: raw.questions,
        characters: raw.characters.map((c) => ({ name: c.name, tags: new Set(c.tags) })),
    };
    return DB;
}

// ---------------- محرك التخمين ----------------

// بيحسب درجة كل شخصية حسب الاجابات اللي فاتت
function scoreAll(session) {
    const { characters } = db();
    return characters.map((ch, i) => {
        if (session.excluded.has(i)) return 0;
        let s = 1;
        for (const { q, a } of session.answers) {
            if (a === 0.5) continue; // "لا أعرف" مبتغيرش حاجة
            const t = ch.tags.has(q) ? 1 : 0;
            s *= Math.max(0.04, 1 - Math.abs(t - a)); // بنسيب مجال صغير للغلط
        }
        return s;
    });
}

// السؤال اللي بيقسم الشخصيات المحتملة لأقرب نصفين
function nextQuestion(session, scores) {
    const { questions, characters } = db();
    const asked = new Set(session.answers.map((x) => x.q));
    const total = scores.reduce((x, y) => x + y, 0);
    if (total <= 0) return null;

    let best = [];
    let bestGain = 0.02; // لو السؤال مش بيفرق تقريبا منسألوش
    for (const q of Object.keys(questions)) {
        if (asked.has(q)) continue;
        let yes = 0;
        characters.forEach((ch, i) => { if (ch.tags.has(q)) yes += scores[i]; });
        const p = yes / total;
        const gain = p * (1 - p);
        if (gain > bestGain + 1e-9) { bestGain = gain; best = [q]; }
        else if (Math.abs(gain - bestGain) < 1e-9 && best.length) best.push(q);
    }
    return best.length ? best[Math.floor(Math.random() * best.length)] : null;
}

function topGuess(scores) {
    const total = scores.reduce((x, y) => x + y, 0);
    if (total <= 0) return null;
    let idx = 0;
    scores.forEach((s, i) => { if (s > scores[idx]) idx = i; });
    return { idx, prob: scores[idx] / total };
}

// بيقرر: سؤال جديد ولا تخمين
function advance(session) {
    const scores = scoreAll(session);
    const guess = topGuess(scores);
    if (!guess) return { type: 'lost' };
    const steps = session.answers.length;
    const q = nextQuestion(session, scores);
    const confident = guess.prob >= 0.75 && steps >= 4;
    const sole = scores.filter((s) => s > 0.001 * scores[guess.idx]).length === 1 && steps >= 3;
    if (confident || sole || steps >= MAX_QUESTIONS || !q) {
        return { type: 'guess', idx: guess.idx, prob: guess.prob };
    }
    return { type: 'question', q };
}

// ---------------- الواجهة ----------------

const TITLE = '🧞 *لعبة المارد الأزرق..*';

const q = (text, id) => buttons.quickButton(text, id);

async function sendCard(sock, chatId, text, btns, fallbackHint) {
    const ok = await buttons.sendInteractive(sock, chatId, {
        title: '',
        text,
        footer: 'BY MHDBOT',
        buttons: btns,
    });
    if (!ok) {
        await sock.sendMessage(chatId, { text: `${text}\n\n${fallbackHint}`, __noframe: true });
    }
}

async function sendStart(sock, chatId) {
    await sendCard(
        sock, chatId,
        `${TITLE}\n\n🧞 هل تريد بدء لعبة المارد؟\n_اختر أحد الخيارات التالية :_`,
        [q('📘 المساعدة', '.مارد مساعدة'), q('🎮 بدء اللعبة', '.مارد بدء')],
        'اكتب `.مارد بدء` عشان تبدأ او `.مارد مساعدة`'
    );
}

async function sendHelp(sock, chatId) {
    const text = [
        TITLE,
        '',
        '📘 *طريقة اللعب*',
        '• فكر في شخصية (حقيقية او كرتونية) ومتقولش لحد',
        '• المارد هيسألك أسئلة وانت جاوب بالأزرار',
        '• ✅ نعم ❌ لا 🤔 لا أعرف 💭 ربما 🚫 ربما لا',
        '• ↩️ رجوع بيرجعك للسؤال اللي فات',
        '• 🗑️ حذف بيلغي اللعبة',
        '',
        '_المارد بيخمن من الشخصيات اللي يعرفها بس_',
    ].join('\n');
    await sendCard(sock, chatId, text, [q('🎮 بدء اللعبة', '.مارد بدء')], 'اكتب `.مارد بدء` عشان تبدأ');
}

const ANSWER_BUTTONS = [
    q('✅ نعم', '.مارد نعم'),
    q('❌ لا', '.مارد لا'),
    q('🤔 لا أعرف', '.مارد لااعرف'),
    q('💭 ربما', '.مارد ربما'),
    q('🚫 ربما لا', '.مارد ربمالا'),
    q('↩️ رجوع', '.مارد رجوع'),
    q('🗑️ حذف', '.مارد حذف'),
];

async function sendQuestion(sock, chatId, session, qKey) {
    session.current = { type: 'question', q: qKey };
    const n = session.answers.length + 1;
    const text = `${TITLE}\n\n🧞 ${db().questions[qKey]}\n_سؤال رقم ${n} · اختر الإجابة المناسبة:_`;
    await sendCard(
        sock, chatId, text, ANSWER_BUTTONS,
        'جاوب بـ: `.مارد نعم` او `.مارد لا` او `.مارد لااعرف` او `.مارد ربما` او `.مارد ربمالا`\n`.مارد رجوع` للرجوع و`.مارد حذف` للالغاء'
    );
}

async function sendGuess(sock, chatId, session, idx, prob) {
    session.current = { type: 'guess', idx };
    const name = db().characters[idx].name;
    const pct = Math.max(1, Math.min(99, Math.round(prob * 100)));
    const text = `${TITLE}\n\n🧞 أظن انك بتفكر في:\n\n✨ *${name}* ✨\n_نسبة التأكد ${pct}%_\n\nهل تخميني صح؟`;
    await sendCard(
        sock, chatId, text,
        [q('✅ صح', '.مارد صح'), q('❌ مش صح', '.مارد غلط'), q('↩️ رجوع', '.مارد رجوع'), q('🗑️ حذف', '.مارد حذف')],
        'اكتب `.مارد صح` او `.مارد غلط`'
    );
}

async function step(sock, chatId, session) {
    const next = advance(session);
    if (next.type === 'question') return sendQuestion(sock, chatId, session, next.q);
    if (next.type === 'guess') return sendGuess(sock, chatId, session, next.idx, next.prob);
    sessions.delete(chatId);
    await sock.sendMessage(chatId, {
        text: `${TITLE}\n\n🧞 غلبتني المرة دي! الشخصية دي مش عندي 😅\n_تقدر تزود شخصيات في ملف assets/genie.json_`,
        __noframe: true,
    });
}

// ---------------- نقطة الدخول ----------------

function activeSession(chatId) {
    const s = sessions.get(chatId);
    if (s && Date.now() - s.ts > SESSION_TTL) { sessions.delete(chatId); return null; }
    return s || null;
}

async function genieCommand(sock, chatId, message, senderId, args = '') {
    const sub = String(args || '').trim().split(/\s+/)[0] || '';
    const session = activeSession(chatId);

    try {
        if (!sub) return await sendStart(sock, chatId);
        if (sub === 'مساعدة') return await sendHelp(sock, chatId);

        if (sub === 'بدء') {
            if (session && session.player !== senderId) {
                await sock.sendMessage(chatId, { react: { text: '⛔', key: message.key } });
                return await sock.sendMessage(chatId, { text: '🧞 في لعبة مارد شغالة في الشات دلوقتي، استنى لحد ما تخلص' }, { quoted: message });
            }
            const fresh = { player: senderId, answers: [], excluded: new Set(), ts: Date.now(), current: null };
            sessions.set(chatId, fresh);
            return await step(sock, chatId, fresh);
        }

        if (!session) {
            return await sock.sendMessage(chatId, { text: '🧞 مفيش لعبة شغالة. اكتب `.مارد` عشان تبدأ' }, { quoted: message });
        }
        if (session.player !== senderId) {
            await sock.sendMessage(chatId, { react: { text: '⛔', key: message.key } });
            return await sock.sendMessage(chatId, { text: '🧞 دي لعبة حد تاني. ابدأ لعبتك بعد ما تخلص' }, { quoted: message });
        }
        session.ts = Date.now();

        if (sub === 'حذف') {
            sessions.delete(chatId);
            return await sock.sendMessage(chatId, { text: '🗑️ اتلغت لعبة المارد' }, { quoted: message });
        }

        if (sub === 'رجوع') {
            // نمسح اخر اجابة ونرجع للسؤال اللي قبلها
            if (session.answers.length) session.answers.pop();
            return await step(sock, chatId, session);
        }

        if (sub === 'صح') {
            if (session.current?.type !== 'guess') return;
            const name = db().characters[session.current.idx].name;
            sessions.delete(chatId);
            return await sock.sendMessage(chatId, { text: `🧞 قلتلك انا المارد! 🎉\nالشخصية هي *${name}*`, __noframe: true }, { quoted: message });
        }

        if (sub === 'غلط') {
            if (session.current?.type !== 'guess') return;
            session.excluded.add(session.current.idx);
            return await step(sock, chatId, session);
        }

        if (sub in ANSWERS) {
            if (session.current?.type !== 'question') return;
            session.answers.push({ q: session.current.q, a: ANSWERS[sub] });
            return await step(sock, chatId, session);
        }

        await sock.sendMessage(chatId, { text: '🧞 مفهمتش. اكتب `.مارد` عشان تبدأ' }, { quoted: message });
    } catch (e) {
        console.error('[genie] خطأ:', e);
        sessions.delete(chatId);
        await sock.sendMessage(chatId, { text: 'حصل خطأ في لعبة المارد' }, { quoted: message });
    }
}

module.exports = genieCommand;
module.exports._engine = { db, scoreAll, nextQuestion, topGuess, advance, ANSWERS };
