/* =========================================================
   I Love You, Kavi  —  script.js
   Vanilla JS. No libraries. Just love.
   ========================================================= */
(() => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TOUCH   = window.matchMedia('(hover: none)').matches;

  /* ════════════════════════════════════════════════
     ⚙️  SETTINGS — edit these two lines if you want
     ════════════════════════════════════════════════ */
  // When did your love story start?  (YYYY, Month-1, Day, Hour, Min)
  const LOVE_START = new Date(2023, 0, 1, 0, 0, 0);
  // ════════════════════════════════════════════════ */


  /* ═══════════ 1. PRELOADER ═══════════ */
  window.addEventListener('load', () => {
    setTimeout(() => $('#loader').classList.add('hide'), 900);
    document.body.style.overflow = '';
  });
  document.body.style.overflow = 'hidden';
  setTimeout(() => {                                   // safety net
    $('#loader').classList.add('hide');
    document.body.style.overflow = '';
  }, 4500);


  /* ═══════════ 2. SCROLL REVEAL ═══════════ */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (!e.isIntersecting) return;
      setTimeout(() => e.target.classList.add('in'), i * 90);
      revealIO.unobserve(e.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  $$('.reveal').forEach(el => revealIO.observe(el));


  /* ═══════════ 3. SCROLL PROGRESS ═══════════ */
  const bar = $('#progressBar');
  const onScroll = () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ═══════════ 4. TYPEWRITER LETTER ═══════════ */
  const tw = $('#typewriter');
  const fullText = tw.dataset.text || '';
  let typed = false;

  function runTypewriter() {
    if (typed) return;
    typed = true;
    let i = 0;
    const caret = document.createElement('span');
    caret.className = 'caret';
    tw.textContent = '';
    tw.appendChild(caret);

    (function step() {
      if (i < fullText.length) {
        caret.insertAdjacentText('beforebegin', fullText[i]);
        i++;
        // slight rhythm: pause a touch longer on punctuation
        const ch = fullText[i - 1];
        const delay = /[.,!?]/.test(ch) ? 240 : 26 + Math.random() * 34;
        setTimeout(step, REDUCED ? 0 : delay);
      } else {
        setTimeout(() => caret.remove(), 1400);
      }
    })();
  }
  new IntersectionObserver((e, o) => {
    if (e[0].isIntersecting) { runTypewriter(); o.disconnect(); }
  }, { threshold: 0.35 }).observe(tw);


  /* ═══════════ 5. LOVE CLOCK ═══════════ */
  const pad = n => String(n).padStart(2, '0');
  const clockEls = { d: $('#cDays'), h: $('#cHours'), m: $('#cMins'), s: $('#cSecs') };
  function tickClock() {
    const diff = Math.max(0, Date.now() - LOVE_START.getTime());
    const s = Math.floor(diff / 1000);
    clockEls.d.textContent = Math.floor(s / 86400);
    clockEls.h.textContent = pad(Math.floor(s % 86400 / 3600));
    clockEls.m.textContent = pad(Math.floor(s % 3600 / 60));
    clockEls.s.textContent = pad(s % 60);
  }
  tickClock();
  setInterval(tickClock, 1000);


  /* ═══════════ 6. FLIP CARDS (tap support) ═══════════ */
  $$('.flip').forEach(card => {
    card.addEventListener('click', () => card.classList.toggle('flipped'));
  });


  /* ═══════════ 7. CURSOR GLOW + HEART TRAIL ═══════════ */
  const glow = $('#cursorGlow');
  const trail = $('#trail');
  const EMOJI = ['💖', '💗', '✨', '💕', '🌸', '💞'];
  let lastTrail = 0;

  if (!TOUCH && !REDUCED) {
    window.addEventListener('pointermove', (e) => {
      glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;

      const now = performance.now();
      if (now - lastTrail < 70) return;
      lastTrail = now;

      const s = document.createElement('i');
      s.textContent = EMOJI[(Math.random() * EMOJI.length) | 0];
      s.style.left = e.clientX + 'px';
      s.style.top  = e.clientY + 'px';
      s.style.fontSize = (10 + Math.random() * 10) + 'px';
      trail.appendChild(s);
      setTimeout(() => s.remove(), 950);
    }, { passive: true });

    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { glow.style.opacity = '.55'; });
  } else {
    glow.style.display = 'none';
  }


  /* ═══════════ 8. AMBIENT CANVAS HEARTS ═══════════ */
  const canvas = $('#bg');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, DPR = 1;
  let hearts = [], sparks = [];

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width  = Math.floor(innerWidth  * DPR);
    H = canvas.height = Math.floor(innerHeight * DPR);
    canvas.style.width  = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    buildParticles();
  }

  function heartPath(x, y, size, rot, alpha, hue) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(size / 16, size / 16);
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.bezierCurveTo(0, 1, -3, -2, -6, -2);
    ctx.bezierCurveTo(-12, -2, -12, 5, -12, 5);
    ctx.bezierCurveTo(-12, 9, -7, 13.5, 0, 18);
    ctx.bezierCurveTo(7, 13.5, 12, 9, 12, 5);
    ctx.bezierCurveTo(12, 5, 12, -2, 6, -2);
    ctx.bezierCurveTo(3, -2, 0, 1, 0, 4);
    ctx.closePath();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = `hsla(${hue}, 92%, 68%, 1)`;
    ctx.shadowBlur = 18;
    ctx.shadowColor = `hsla(${hue}, 95%, 62%, .9)`;
    ctx.fill();
    ctx.restore();
  }

  function buildParticles() {
    const density = Math.round((innerWidth * innerHeight) / 26000);
    const count = Math.max(26, Math.min(110, density));

    hearts = Array.from({ length: count }, () => makeHeart(true));
    sparks = Array.from({ length: Math.round(count * 0.6) }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: Math.random() * 1.6 + 0.5,
      vy: -(Math.random() * 0.22 + 0.05),
      vx: (Math.random() - 0.5) * 0.16,
      a: Math.random() * 0.6 + 0.15,
      tw: Math.random() * Math.PI * 2
    }));
  }

  function makeHeart(spread) {
    const hue = 320 + Math.random() * 60;           // pink → violet
    return {
      x: Math.random() * innerWidth,
      y: spread ? Math.random() * innerHeight : innerHeight + 40,
      size: Math.random() * 15 + 7,
      vy: -(Math.random() * 0.5 + 0.22),
      vx: (Math.random() - 0.5) * 0.32,
      rot: (Math.random() - 0.5) * 0.6,
      vr: (Math.random() - 0.5) * 0.012,
      a: Math.random() * 0.4 + 0.16,
      hue,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.012 + 0.004
    };
  }

  let mx = -9999, my = -9999;
  window.addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });

  function draw() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    // sparkles
    for (const s of sparks) {
      s.tw += 0.05;
      s.x += s.vx; s.y += s.vy;
      if (s.y < -10) { s.y = innerHeight + 10; s.x = Math.random() * innerWidth; }
      ctx.globalAlpha = s.a * (0.55 + 0.45 * Math.sin(s.tw));
      ctx.fillStyle = '#ffd6f0';
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // hearts
    for (const h of hearts) {
      h.sway += h.swaySpeed;
      h.x += h.vx + Math.sin(h.sway) * 0.5;
      h.y += h.vy;
      h.rot += h.vr;

      // gentle repel from the cursor
      const dx = h.x - mx, dy = h.y - my;
      const d2 = dx * dx + dy * dy;
      if (d2 < 14000 && d2 > 0.01) {
        const f = (1 - d2 / 14000) * 1.7;
        const d = Math.sqrt(d2);
        h.x += (dx / d) * f;
        h.y += (dy / d) * f;
      }

      if (h.y < -60 || h.x < -90 || h.x > innerWidth + 90) {
        Object.assign(h, makeHeart(false), { x: Math.random() * innerWidth });
      }
      heartPath(h.x, h.y, h.size, h.rot, h.a, h.hue);
    }
    ctx.globalAlpha = 1;

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  if (!REDUCED) requestAnimationFrame(draw);
  else { /* draw a single static frame */ drawOnce(); }
  function drawOnce() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    hearts.forEach(h => heartPath(h.x, h.y, h.size, h.rot, h.a, h.hue));
  }


  /* ═══════════ 9. BUTTON RIPPLES ═══════════ */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn');
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height);
    const rip = document.createElement('span');
    rip.className = 'ripple';
    rip.style.width = rip.style.height = size + 'px';
    rip.style.left = (e.clientX - r.left - size / 2) + 'px';
    rip.style.top  = (e.clientY - r.top  - size / 2) + 'px';
    btn.appendChild(rip);
    setTimeout(() => rip.remove(), 700);
  });


  /* ═══════════ 10. THE PROPOSAL  (Yes / No) ═══════════ */
  const yesBtn = $('#yesBtn');
  const noBtn  = $('#noBtn');
  const btns   = $('#btns');
  const hint   = $('#hint');

  const NO_TEXTS = [
    'No', 'Are you sure? 🥺', 'Really sure?', 'Think again!', 'Last chance…',
    'Surely not?', 'You might regret this!', 'Give it another thought…',
    'Are you positive?', 'Please? 🥹', "Don't do this to me…",
    "I'm gonna cry 💧", "You're breaking my heart 💔", 'Ok fine — just say Yes 😌'
  ];

  let noCount = 0;
  let yesScale = 1;

  function moveNo() {
    if (noCount >= NO_TEXTS.length - 1) {
      // final stage: the "No" gives up
      noBtn.style.opacity = '0';
      noBtn.style.pointerEvents = 'none';
      hint.textContent = 'See? There was only ever one answer. 💗';
      return;
    }
    noCount++;

    noBtn.classList.add('escaped');
    noBtn.textContent = NO_TEXTS[noCount];

    const w = noBtn.offsetWidth || 120;
    const h = noBtn.offsetHeight || 50;
    const pad = 14;
    const x = pad + Math.random() * Math.max(0, innerWidth  - w - pad * 2);
    const y = pad + Math.random() * Math.max(0, innerHeight - h - pad * 2);
    noBtn.style.left = x + 'px';
    noBtn.style.top  = y + 'px';
    noBtn.style.transform = `rotate(${(Math.random() - 0.5) * 22}deg)`;

    // the No shrinks… the Yes grows
    const noScale = Math.max(0.55, 1 - noCount * 0.06);
    noBtn.style.fontSize = (1 * noScale) + 'rem';
    noBtn.style.padding = `${15 * noScale}px ${42 * noScale}px`;

    yesScale = Math.min(2.1, yesScale + 0.13);
    yesBtn.style.transform = `scale(${yesScale})`;

    const playful = ['Hmm, wrong button 😌', 'Try again 👀', 'It keeps running…', 'Not that one!',
                     'Yes is right there 👉', 'Nope, can’t catch me!', 'Getting warm…'];
    hint.textContent = playful[noCount % playful.length];
  }

  // Desktop: dodge on hover. Mobile: dodge on tap.
  noBtn.addEventListener('mouseenter', moveNo);
  noBtn.addEventListener('click', (e) => { e.preventDefault(); moveNo(); });
  noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); moveNo(); }, { passive: false });


  /* ═══════════ 11. CELEBRATION ═══════════ */
  const celebrate = $('#celebrate');
  const confetti  = $('#confetti');

  function burstConfetti(amount = 110) {
    const glyphs = ['💖', '💗', '💕', '💞', '✨', '🌸', '💘', '⭐', '🤍', '💝'];
    const colors = ['#ff2d78', '#ff5fa2', '#ffd6a5', '#c4b5fd', '#a855f7', '#fff'];
    for (let i = 0; i < amount; i++) {
      const el = document.createElement('i');
      const useEmoji = Math.random() > 0.35;
      el.textContent = useEmoji ? glyphs[(Math.random() * glyphs.length) | 0] : '';
      if (!useEmoji) {
        el.style.width = el.style.height = (6 + Math.random() * 8) + 'px';
        el.style.background = colors[(Math.random() * colors.length) | 0];
        el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      } else {
        el.style.fontSize = (14 + Math.random() * 24) + 'px';
      }
      el.style.left = Math.random() * 100 + '%';
      el.style.animationDuration = (3.2 + Math.random() * 3.4) + 's';
      el.style.animationDelay = (Math.random() * 1.6) + 's';
      el.style.setProperty('--dx', (Math.random() * 220 - 110) + 'px');
      el.style.setProperty('--rot', (Math.random() * 1080 - 540) + 'deg');
      confetti.appendChild(el);
      setTimeout(() => el.remove(), 8600);
    }
  }

  function openCelebration() {
    celebrate.classList.add('show');
    celebrate.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    burstConfetti(140);
    setTimeout(() => burstConfetti(70), 1200);
    setTimeout(() => burstConfetti(70), 2600);
  }
  function closeCelebration() {
    celebrate.classList.remove('show');
    celebrate.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    confetti.innerHTML = '';
  }

  yesBtn.addEventListener('click', openCelebration);
  $('#againBtn').addEventListener('click', () => { confetti.innerHTML = ''; burstConfetti(150); });
  $('#closeBtn').addEventListener('click', closeCelebration);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCelebration(); });


  /* ═══════════ 12. ROMANTIC MUSIC (Web Audio, no files) ═══════════ */
  const musicBtn = $('#musicBtn');
  let audio = null, master = null, delay = null, playing = false;
  let scheduler = null, nextBarTime = 0, barIndex = 0;

  // Gentle progression: Am – F – C – G  (frequencies in Hz)
  const PROG = [
    { pad: [220.00, 261.63, 329.63], root: 110.00 },  // Am
    { pad: [174.61, 220.00, 261.63], root:  87.31 },  // F
    { pad: [261.63, 329.63, 392.00], root: 130.81 },  // C
    { pad: [196.00, 246.94, 293.66], root:  98.00 }   // G
  ];
  const MELODY = [659.25, 587.33, 523.25, 493.88, 440.00, 392.00, 329.63, 293.66];

  function initAudio() {
    const AC = window.AudioContext || window.webkitAudioContext;
    audio = new AC();
    master = audio.createGain();
    master.gain.value = 0.0001;

    // a soft echo for space
    delay = audio.createDelay(1.0);
    delay.delayTime.value = 0.36;
    const fb = audio.createGain(); fb.gain.value = 0.32;
    const wet = audio.createGain(); wet.gain.value = 0.35;
    delay.connect(fb); fb.connect(delay);
    delay.connect(wet); wet.connect(master);

    master.connect(audio.destination);
  }

  function tone(freq, time, dur, type, gain, sendToDelay) {
    const osc = audio.createOscillator();
    const g = audio.createGain();
    osc.type = type;
    osc.frequency.value = freq;

    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(gain, time + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(g);
    g.connect(master);
    if (sendToDelay) g.connect(delay);

    osc.start(time);
    osc.stop(time + dur + 0.05);
  }

  function scheduleBar(startTime) {
    const bar = PROG[barIndex % PROG.length];
    const beat = 0.5;                 // 8th notes @ 60bpm-ish
    const barLen = beat * 8;

    // Pad chord
    bar.pad.forEach((f, i) => {
      const osc = audio.createOscillator();
      const g = audio.createGain();
      const filt = audio.createBiquadFilter();
      filt.type = 'lowpass';
      filt.frequency.value = 1400;
      osc.type = i === 0 ? 'triangle' : 'sine';
      osc.frequency.value = f;
      osc.detune.value = (Math.random() - 0.5) * 8;
      g.gain.setValueAtTime(0.0001, startTime);
      g.gain.linearRampToValueAtTime(0.055, startTime + 0.6);
      g.gain.linearRampToValueAtTime(0.0001, startTime + barLen);
      osc.connect(filt); filt.connect(g); g.connect(master);
      if (i === 0) g.connect(delay);
      osc.start(startTime); osc.stop(startTime + barLen + 0.1);
    });

    // Arpeggio (harp-like)
    const pattern = [0, 1, 2, 1, 2, 0, 1, 2];
    for (let i = 0; i < 8; i++) {
      const f = bar.pad[pattern[i]] * 2;
      tone(f, startTime + i * beat, 1.1, 'sine', 0.05, true);
    }

    // Sparse melody note
    if (Math.random() > 0.35) {
      const m = MELODY[(Math.random() * MELODY.length) | 0];
      tone(m, startTime + (Math.random() > 0.5 ? 0 : beat * 4), 1.6, 'triangle', 0.035, true);
    }

    barIndex++;
    return barLen;
  }

  function startMusic() {
    if (!audio) initAudio();
    if (audio.state === 'suspended') audio.resume();
    playing = true;
    musicBtn.classList.add('on');
    musicBtn.setAttribute('aria-label', 'Pause romantic music');

    master.gain.cancelScheduledValues(audio.currentTime);
    master.gain.setValueAtTime(master.gain.value || 0.0001, audio.currentTime);
    master.gain.exponentialRampToValueAtTime(0.5, audio.currentTime + 2.2);

    nextBarTime = audio.currentTime + 0.12;
    scheduler = setInterval(() => {
      while (nextBarTime < audio.currentTime + 1.6) {
        nextBarTime += scheduleBar(nextBarTime);
      }
    }, 300);
  }

  function stopMusic() {
    if (!audio) return;
    playing = false;
    musicBtn.classList.remove('on');
    musicBtn.setAttribute('aria-label', 'Play romantic music');
    master.gain.cancelScheduledValues(audio.currentTime);
    master.gain.setValueAtTime(master.gain.value, audio.currentTime);
    master.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.9);
    clearInterval(scheduler);
    scheduler = null;
  }

  musicBtn.addEventListener('click', () => playing ? stopMusic() : startMusic());


  /* ═══════════ 13. SMOOTH ANCHOR SCROLL ═══════════ */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      t.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
    });
  });


  /* ═══════════ 14. KONAMI-ISH EASTER EGG 🎁 ═══════════ */
  let seq = '';
  window.addEventListener('keydown', (e) => {
    if (e.target.matches('input,textarea')) return;
    seq = (seq + e.key.toLowerCase()).slice(-4);
    if (seq === 'love') {
      burstConfetti(90);
      document.body.animate(
        [{ filter: 'hue-rotate(0deg)' }, { filter: 'hue-rotate(45deg)' }, { filter: 'hue-rotate(0deg)' }],
        { duration: 1200 }
      );
    }
  });

  console.log('%c💖 I Love You, Kavi 💖', 'font-size:20px;font-weight:700;color:#ff5fa2;');
  console.log('%cYou found the console. Of course you did. 😌', 'color:#c4b5fd;');
})();
