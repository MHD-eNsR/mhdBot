// مشرف العملية: بيشغل البوت كعملية فرعية وبيعيد تشغيلها لو وقفت
// السبب: لما البوت بيعمل process.exit(0) بعد .تحديث، لوحة الاستضافة بتعتبره ايقاف عادي
// وبتسيب السيرفر Offline. هنا العملية الاساسية بتفضل شغالة وبتعيد تشغيل البوت بنفسها.
const { spawn } = require('child_process');

const CHILD_FLAG = 'MHD_BOT_CHILD';
const RAPID_WINDOW_MS = 60_000; // لو وقع كتير في الدقيقة دي نوقف بدل ما نلف في دايرة
const RAPID_MAX = 6;

// بترجع true لو الملف ده اتحول لمشرف (يعني index.js يوقف هنا)، وfalse لو ده البوت الفعلي
function start() {
  if (process.env[CHILD_FLAG] === '1' || process.env.MHD_NO_SUPERVISOR === '1') return false;

  let child = null;
  let stopping = false;
  const exits = [];

  const launch = () => {
    child = spawn(process.execPath, [...process.execArgv, ...process.argv.slice(1)], {
      stdio: 'inherit',
      env: { ...process.env, [CHILD_FLAG]: '1' },
    });

    child.on('exit', (code, signal) => {
      child = null;
      if (stopping) return process.exit(code ?? 0);

      const now = Date.now();
      exits.push(now);
      while (exits.length && now - exits[0] > RAPID_WINDOW_MS) exits.shift();
      if (exits.length >= RAPID_MAX) {
        console.error(`[supervisor] البوت وقع ${RAPID_MAX} مرات في دقيقة، هوقف عشان مفيش لف في دايرة`);
        return process.exit(code || 1);
      }

      // خروج عادي (تحديث/ريستارت) بسرعة، وانهيار بتأخير بسيط
      const delay = code === 0 ? 1000 : 4000;
      console.log(`[supervisor] البوت وقف (code=${code ?? signal}) هعيد تشغيله بعد ${delay / 1000} ثانية`);
      setTimeout(launch, delay);
    });
  };

  // ايقاف من لوحة الاستضافة: وقّف البوت الفرعي وبعدين اطلع
  for (const sig of ['SIGTERM', 'SIGINT', 'SIGHUP']) {
    process.on(sig, () => {
      stopping = true;
      if (child) child.kill(sig);
      else process.exit(0);
      // لو الفرعي ماخلصش في 8 ثواني اقفله بالقوة
      setTimeout(() => process.exit(0), 8000).unref();
    });
  }

  launch();
  return true;
}

module.exports = { start };
