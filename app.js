// NEON SURVIVAL PROTOCOL - Main App
const STORAGE_KEY = 'nsp_players';

const gameData = [
  { title: 'Storm Run', difficulty: 'Hard', score: 3200, type: 'circle' },
  { title: 'Mind Lock', difficulty: 'Extreme', score: 5100, type: 'triangle' },
  { title: 'Collapse Zone', difficulty: 'Medium', score: 2400, type: 'square' },
  { title: 'Final Reckoning', difficulty: 'Legendary', score: 7600, type: 'diamond' }
];

const difficultyColors = {
  Medium: '#00f7ff',
  Hard: '#ff2e88',
  Extreme: '#ff7a00',
  Legendary: '#b36bff'
};

// Core bootstrapping
function init() {
  createStyles();
  const app = document.getElementById('app');
  app.innerHTML = '';

  app.appendChild(createNavbar());
  app.appendChild(createHero());
  app.appendChild(createGames());
  app.appendChild(createLeaderboard());

  setupParallax();
  setupRevealAnimations();
  setupSmoothScrolling();
  initializeLeaderboard();
  renderLeaderboard();
}

// Dynamic style injection
function createStyles() {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --bg-black: #08070d;
      --bg-deep: #111126;
      --neon-pink: #ff2e88;
      --neon-cyan: #00f7ff;
      --glass: rgba(255, 255, 255, 0.08);
      --glass-border: rgba(255, 255, 255, 0.2);
      --text: #f4f7ff;
      --muted: #9ea9c6;
    }

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }

    body {
      margin: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: var(--text);
      background:
        radial-gradient(circle at 20% 20%, rgba(255, 46, 136, 0.15), transparent 30%),
        radial-gradient(circle at 80% 30%, rgba(0, 247, 255, 0.12), transparent 35%),
        linear-gradient(145deg, var(--bg-black), var(--bg-deep));
      overflow-x: hidden;
      min-height: 100vh;
    }

    #app {
      position: relative;
      isolation: isolate;
    }

    .section {
      width: min(1180px, calc(100% - 2rem));
      margin: 0 auto;
      padding: 4rem 0;
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }

    .section.visible {
      opacity: 1;
      transform: translateY(0);
    }

    .glass {
      background: var(--glass);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.35);
    }

    .mobile-menu {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(8, 7, 13, 0.94);
      z-index: 120;
      padding: 5rem 1.5rem 2rem;
      flex-direction: column;
      gap: 1rem;
    }

    .mobile-menu.open { display: flex; }

    .mobile-menu a {
      color: var(--text);
      text-decoration: none;
      font-size: 1.15rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      padding: 0.85rem 1rem;
      border-radius: 0.8rem;
    }

    .hero {
      min-height: 95vh;
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      gap: 2rem;
      position: relative;
      overflow: hidden;
      padding-top: 6rem;
    }

    .hero-bg-layer {
      position: absolute;
      width: 40vw;
      max-width: 560px;
      aspect-ratio: 1;
      border-radius: 50%;
      filter: blur(70px);
      opacity: 0.45;
      z-index: -1;
      pointer-events: none;
      transition: transform 0.2s ease-out;
    }

    .bg-left { left: -12%; top: 15%; background: rgba(255, 46, 136, 0.35); }
    .bg-right { right: -10%; bottom: 5%; background: rgba(0, 247, 255, 0.3); }

    .hero-content h1 {
      font-size: clamp(2rem, 4vw, 4rem);
      margin-bottom: 1rem;
      letter-spacing: 0.08em;
      line-height: 1.1;
      text-transform: uppercase;
      text-shadow: 0 0 30px rgba(255, 46, 136, 0.5);
    }

    .hero-content p {
      color: var(--muted);
      max-width: 46ch;
      line-height: 1.7;
      font-size: 1.05rem;
      margin-bottom: 2rem;
      white-space: pre-line;
    }

    .cta-btn {
      position: relative;
      border: 1px solid rgba(255,255,255,0.3);
      padding: 1rem 1.8rem;
      border-radius: 999px;
      color: var(--text);
      text-decoration: none;
      font-weight: 700;
      letter-spacing: 0.06em;
      background: linear-gradient(90deg, rgba(255,46,136,0.25), rgba(0,247,255,0.2));
      box-shadow: 0 0 22px rgba(0,247,255,0.25), inset 0 0 22px rgba(255,46,136,0.2);
      animation: pulseGlow 2.2s infinite;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
    }

    @keyframes pulseGlow {
      0%, 100% { transform: scale(1); box-shadow: 0 0 18px rgba(0,247,255,0.24), inset 0 0 16px rgba(255,46,136,0.2); }
      50% { transform: scale(1.03); box-shadow: 0 0 34px rgba(255,46,136,0.45), inset 0 0 24px rgba(0,247,255,0.25); }
    }

    .hero-visual {
      display: flex;
      justify-content: center;
      position: relative;
      min-height: 460px;
    }

    .guardian-wrap {
      width: min(340px, 70vw);
      height: 420px;
      position: relative;
    }

    .guardian-glow {
      position: absolute;
      inset: 20% 8% 5%;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,46,136,0.45), rgba(0,247,255,0.06) 62%, transparent 72%);
      filter: blur(16px);
      animation: float 5s ease-in-out infinite;
    }

    .guardian-hood {
      position: absolute;
      width: 76%;
      height: 70%;
      left: 50%;
      top: 10%;
      transform: translateX(-50%);
      background: linear-gradient(155deg, #171726, #090914);
      border-radius: 52% 52% 44% 44% / 60% 60% 40% 40%;
      border: 1px solid rgba(255,255,255,0.15);
      box-shadow: 0 0 30px rgba(0,0,0,0.6);
    }

    .guardian-face {
      position: absolute;
      width: 34%;
      aspect-ratio: 1;
      border-radius: 50%;
      left: 50%;
      top: 24%;
      transform: translateX(-50%);
      background: radial-gradient(circle at 30% 30%, #1f2a34, #0d1118);
      border: 2px solid rgba(0,247,255,0.45);
      box-shadow: 0 0 24px rgba(0,247,255,0.3), inset 0 0 14px rgba(255,46,136,0.16);
    }

    .guardian-arm {
      position: absolute;
      width: 58%;
      height: 18px;
      left: 50%;
      top: 57%;
      transform-origin: center;
      background: linear-gradient(90deg, rgba(255,46,136,0.45), rgba(0,247,255,0.45));
      border-radius: 999px;
      box-shadow: 0 0 20px rgba(255,46,136,0.4);
    }

    .arm-a { transform: translateX(-50%) rotate(38deg); }
    .arm-b { transform: translateX(-50%) rotate(-38deg); }

    .symbol {
      position: absolute;
      width: 58px;
      height: 58px;
      border: 2px solid;
      filter: drop-shadow(0 0 10px currentColor);
      animation: float 3.8s ease-in-out infinite;
      opacity: 0.95;
    }

    .symbol.circle { border-radius: 50%; color: var(--neon-cyan); }
    .symbol.triangle {
      width: 0;
      height: 0;
      border-left: 30px solid transparent;
      border-right: 30px solid transparent;
      border-bottom: 52px solid var(--neon-pink);
      border-top: 0;
      border-radius: 6px;
      filter: drop-shadow(0 0 12px rgba(255,46,136,0.8));
      background: transparent;
    }
    .symbol.square { color: #7cf8ff; }

    .symbol.s1 { top: 8%; left: 10%; }
    .symbol.s2 { top: 70%; left: 5%; animation-delay: 0.8s; }
    .symbol.s3 { top: 12%; right: 14%; animation-delay: 0.4s; }
    .symbol.s4 { top: 64%; right: 6%; animation-delay: 1.1s; }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }

    .section h2 {
      font-size: clamp(1.5rem, 2.5vw, 2.4rem);
      margin: 0 0 1.25rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }

    .games-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 1rem;
    }

    .game-card {
      padding: 1.1rem;
      border-radius: 1rem;
      position: relative;
      border: 1px solid rgba(255,255,255,0.18);
      background: linear-gradient(150deg, rgba(17,17,33,0.75), rgba(14,14,30,0.35));
      transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
      min-height: 180px;
    }

    .game-card:hover {
      transform: translateY(-8px) rotate(-1.2deg);
      border-color: rgba(0,247,255,0.7);
      box-shadow: 0 0 28px rgba(0,247,255,0.3);
    }

    .game-icon {
      width: 36px;
      height: 36px;
      margin-bottom: 0.8rem;
      position: relative;
    }

    .icon-circle { border-radius: 50%; border: 3px solid var(--neon-cyan); }
    .icon-triangle { width: 0; height: 0; border-left: 18px solid transparent; border-right: 18px solid transparent; border-bottom: 31px solid var(--neon-pink); }
    .icon-square { border: 3px solid #78f9ff; }
    .icon-diamond { border: 3px solid #d38dff; transform: rotate(45deg); }

    .badge {
      position: absolute;
      top: 0.8rem;
      right: 0.8rem;
      font-size: 0.75rem;
      padding: 0.35rem 0.6rem;
      border-radius: 999px;
      border: 1px solid currentColor;
      box-shadow: 0 0 14px rgba(255,255,255,0.15);
    }

    .leaderboard-card {
      border-radius: 1rem;
      padding: 1rem;
    }

    .leaderboard-row {
      display: grid;
      grid-template-columns: 50px 1fr 120px;
      gap: 0.5rem;
      align-items: center;
      padding: 0.65rem 0.55rem;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .leaderboard-row:last-child { border-bottom: none; }

    .leaderboard-actions {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 0.75rem;
    }

    .small-btn {
      border: 1px solid rgba(255,255,255,0.3);
      color: var(--text);
      background: rgba(255,255,255,0.05);
      padding: 0.55rem 0.8rem;
      border-radius: 0.7rem;
      cursor: pointer;
    }

    .small-btn:hover {
      border-color: var(--neon-pink);
      box-shadow: 0 0 18px rgba(255,46,136,0.35);
    }

    .bottom-nav {
      position: fixed;
      left: 50%;
      bottom: 1rem;
      transform: translateX(-50%);
      display: flex;
      gap: 0.35rem;
      border-radius: 999px;
      padding: 0.45rem;
      z-index: 110;
      width: min(720px, calc(100% - 1rem));
      justify-content: center;
    }

    .bottom-nav a {
      text-decoration: none;
      color: var(--text);
      padding: 0.65rem 1rem;
      border-radius: 999px;
      font-size: 0.94rem;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }

    .bottom-nav a:hover {
      border-color: rgba(0,247,255,0.7);
      box-shadow: inset 0 0 18px rgba(0,247,255,0.2), 0 0 20px rgba(255,46,136,0.3);
    }

    .top-nav {
      position: fixed;
      top: 1rem;
      left: 50%;
      transform: translateX(-50%);
      width: min(1140px, calc(100% - 1rem));
      z-index: 130;
      border-radius: 999px;
      padding: 0.5rem 0.8rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .top-nav .brand { font-weight: 700; letter-spacing: 0.09em; font-size: 0.9rem; }
    .top-nav .links { display: flex; gap: 0.9rem; }
    .top-nav .links a { color: var(--text); text-decoration: none; font-size: 0.9rem; }

    .hamburger {
      display: none;
      width: 42px;
      aspect-ratio: 1;
      border-radius: 0.6rem;
      border: 1px solid rgba(255,255,255,0.2);
      background: rgba(255,255,255,0.06);
      color: var(--text);
      font-size: 1.15rem;
    }

    @media (max-width: 980px) {
      .hero { grid-template-columns: 1fr; padding-top: 7rem; }
      .hero-content { text-align: center; }
      .games-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .top-nav .links { display: none; }
      .hamburger { display: inline-grid; place-items: center; }
    }

    @media (max-width: 600px) {
      .section { width: min(1180px, calc(100% - 1.2rem)); }
      .games-grid { grid-template-columns: 1fr; }
      .bottom-nav { bottom: 0.6rem; }
      .bottom-nav a { padding: 0.55rem 0.72rem; font-size: 0.82rem; }
      .leaderboard-row { grid-template-columns: 38px 1fr 90px; }
    }
  `;
  document.head.appendChild(style);
}

// Top navigation + mobile drawer
function createNavbar() {
  const wrapper = document.createElement('div');

  const nav = document.createElement('nav');
  nav.className = 'top-nav glass';
  nav.innerHTML = `
    <div class="brand">NEON SURVIVAL PROTOCOL</div>
    <div class="links">
      <a href="#hero">About</a>
      <a href="#challenges">Challenges</a>
      <a href="#leaderboard">Leaderboard</a>
      <a href="register.html">Register</a>
    </div>
    <button class="hamburger" aria-label="open menu">☰</button>
  `;

  const mobile = document.createElement('div');
  mobile.className = 'mobile-menu';
  mobile.innerHTML = `
    <a href="#hero">About</a>
    <a href="#challenges">Challenges</a>
    <a href="#leaderboard">Leaderboard</a>
    <a href="register.html">Register</a>
  `;

  nav.querySelector('.hamburger').addEventListener('click', () => {
    mobile.classList.toggle('open');
  });

  mobile.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => mobile.classList.remove('open'));
  });

  wrapper.append(nav, mobile, createBottomBar());
  return wrapper;
}

// Bottom glass navigation bar
function createBottomBar() {
  const bar = document.createElement('div');
  bar.className = 'bottom-nav glass';
  bar.innerHTML = `
    <a href="#hero">About</a>
    <a href="#challenges">Challenges</a>
    <a href="#leaderboard">Leaderboard</a>
    <a href="register.html">Register</a>
  `;
  return bar;
}

// Hero section composition
function createHero() {
  const hero = document.createElement('section');
  hero.id = 'hero';
  hero.className = 'section hero visible';

  const bgL = document.createElement('div');
  bgL.className = 'hero-bg-layer bg-left';
  const bgR = document.createElement('div');
  bgR.className = 'hero-bg-layer bg-right';

  const content = document.createElement('div');
  content.className = 'hero-content';
  content.innerHTML = `
    <h1>NEON SURVIVAL PROTOCOL</h1>
    <p>Once you enter the arena, there is no exit.
Only precision. Only survival.</p>
    <a class="cta-btn" href="register.html">ENTER THE PROTOCOL <span>→</span></a>
  `;

  const visual = document.createElement('div');
  visual.className = 'hero-visual';
  visual.appendChild(createCharacter());
  createSymbols().forEach((symbol) => visual.appendChild(symbol));

  hero.append(bgL, bgR, content, visual);
  return hero;
}

// Floating symbols with CSS geometry
function createSymbols() {
  const s1 = document.createElement('div');
  s1.className = 'symbol circle s1';

  const s2 = document.createElement('div');
  s2.className = 'symbol triangle s2';

  const s3 = document.createElement('div');
  s3.className = 'symbol square s3';

  const s4 = document.createElement('div');
  s4.className = 'symbol triangle s4';

  return [s1, s2, s3, s4];
}

// Main guardian character built from CSS shapes
function createCharacter() {
  const wrap = document.createElement('div');
  wrap.className = 'guardian-wrap';
  wrap.innerHTML = `
    <div class="guardian-glow"></div>
    <div class="guardian-hood"></div>
    <div class="guardian-face"></div>
    <div class="guardian-arm arm-a"></div>
    <div class="guardian-arm arm-b"></div>
  `;
  return wrap;
}

// Challenges cards section
function createGames() {
  const section = document.createElement('section');
  section.id = 'challenges';
  section.className = 'section';

  const title = document.createElement('h2');
  title.textContent = 'Survival Arena Challenges';

  const grid = document.createElement('div');
  grid.className = 'games-grid';

  gameData.forEach((game) => {
    const card = document.createElement('article');
    card.className = 'game-card glass';

    const icon = document.createElement('div');
    icon.className = `game-icon icon-${game.type}`;

    const badge = document.createElement('div');
    badge.className = 'badge';
    badge.textContent = game.difficulty;
    badge.style.color = difficultyColors[game.difficulty] || '#00f7ff';

    const h3 = document.createElement('h3');
    h3.textContent = game.title;

    const p = document.createElement('p');
    p.textContent = `Recommended score target: ${game.score.toLocaleString()} pts`;
    p.style.color = 'var(--muted)';

    card.append(icon, badge, h3, p);
    grid.appendChild(card);
  });

  section.append(title, grid);
  return section;
}

// Leaderboard section shell
function createLeaderboard() {
  const section = document.createElement('section');
  section.id = 'leaderboard';
  section.className = 'section';

  section.innerHTML = `
    <h2>Leaderboard</h2>
    <div class="leaderboard-card glass">
      <div class="leaderboard-actions">
        <button class="small-btn" id="random-player">+ Random Player</button>
      </div>
      <div id="leaderboard-list"></div>
    </div>
  `;

  section.querySelector('#random-player').addEventListener('click', () => {
    const players = getPlayers();
    const nick = `Runner-${Math.floor(Math.random() * 900 + 100)}`;
    players.push({ name: nick, score: Math.floor(Math.random() * 9000 + 800) });
    setPlayers(players);
    renderLeaderboard();
  });

  return section;
}

// Player storage setup
function initializeLeaderboard() {
  if (localStorage.getItem(STORAGE_KEY)) return;
  const defaults = [
    { name: 'Nova Vex', score: 9250 },
    { name: 'Cipher-7', score: 8110 },
    { name: 'Lumen Drift', score: 7640 },
    { name: 'Kairo Flux', score: 7010 }
  ];
  setPlayers(defaults);
}

function getPlayers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function setPlayers(players) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(players));
}

// Score animation + sorted render
function renderLeaderboard() {
  const list = document.getElementById('leaderboard-list');
  if (!list) return;

  const players = getPlayers().sort((a, b) => b.score - a.score);
  setPlayers(players);
  list.innerHTML = '';

  players.forEach((player, index) => {
    const row = document.createElement('div');
    row.className = 'leaderboard-row';

    const rank = document.createElement('strong');
    rank.textContent = `#${index + 1}`;

    const name = document.createElement('span');
    name.textContent = player.name;

    const score = document.createElement('strong');
    animateCount(score, player.score, 700 + index * 120);

    row.append(rank, name, score);
    list.appendChild(row);
  });
}

function animateCount(el, target, duration = 800) {
  const start = performance.now();
  const startVal = 0;

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(startVal + (target - startVal) * eased);
    el.textContent = value.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

// Parallax background movement
function setupParallax() {
  const layers = Array.from(document.querySelectorAll('.hero-bg-layer'));
  window.addEventListener('mousemove', (event) => {
    const xRatio = event.clientX / window.innerWidth - 0.5;
    const yRatio = event.clientY / window.innerHeight - 0.5;
    layers.forEach((layer, idx) => {
      const factor = (idx + 1) * 22;
      layer.style.transform = `translate(${xRatio * factor}px, ${yRatio * factor}px)`;
    });
  });
}

// Fade in sections on scroll
function setupRevealAnimations() {
  const sections = Array.from(document.querySelectorAll('.section'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  sections.forEach((sec) => {
    if (!sec.classList.contains('hero')) observer.observe(sec);
  });
}

// Smooth scrolling binding
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

init();
