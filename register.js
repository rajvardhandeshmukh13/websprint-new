// NEON SURVIVAL PROTOCOL - Register Page
const STORAGE_KEY = 'nsp_players';

function init() {
  createStyles();
  const app = document.getElementById('app');
  app.innerHTML = '';
  app.appendChild(createNavbar());
  app.appendChild(createRegisterForm());
}

function createStyles() {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --bg-black: #08070d;
      --bg-deep: #111126;
      --neon-pink: #ff2e88;
      --neon-cyan: #00f7ff;
      --text: #f4f7ff;
      --muted: #9ea9c6;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: var(--text);
      min-height: 100vh;
      background:
        radial-gradient(circle at 15% 20%, rgba(255, 46, 136, 0.14), transparent 28%),
        radial-gradient(circle at 80% 78%, rgba(0, 247, 255, 0.12), transparent 34%),
        linear-gradient(130deg, var(--bg-black), var(--bg-deep));
      display: grid;
      place-items: center;
      padding: 5rem 1rem 2rem;
    }

    .glass {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.2);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.4);
    }

    .top-nav {
      position: fixed;
      top: 1rem;
      left: 50%;
      transform: translateX(-50%);
      width: min(980px, calc(100% - 1rem));
      border-radius: 999px;
      padding: 0.5rem 0.85rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 20;
    }

    .top-nav a { color: var(--text); text-decoration: none; }

    .register-wrap {
      width: min(620px, 100%);
      border-radius: 1.1rem;
      padding: 1.4rem;
    }

    h1 {
      margin-top: 0;
      margin-bottom: 0.7rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .subtitle {
      margin-top: 0;
      color: var(--muted);
      margin-bottom: 1.4rem;
    }

    .field {
      position: relative;
      margin-bottom: 1.1rem;
    }

    .field input {
      width: 100%;
      padding: 0.95rem 0.85rem;
      border-radius: 0.8rem;
      border: 1px solid rgba(255,255,255,0.2);
      outline: none;
      color: var(--text);
      background: rgba(255,255,255,0.03);
      transition: box-shadow 0.2s ease, border-color 0.2s ease;
      font-size: 1rem;
    }

    .field input:focus {
      border-color: var(--neon-cyan);
      box-shadow: 0 0 24px rgba(0,247,255,0.25), inset 0 0 16px rgba(255,46,136,0.14);
    }

    .field label {
      position: absolute;
      left: 0.9rem;
      top: 0.95rem;
      color: var(--muted);
      pointer-events: none;
      transition: all 0.18s ease;
      background: transparent;
      padding: 0 0.2rem;
    }

    .field input:focus + label,
    .field input:not(:placeholder-shown) + label {
      top: -0.58rem;
      font-size: 0.78rem;
      color: var(--neon-pink);
      background: rgba(8, 7, 13, 0.7);
      border-radius: 999px;
    }

    .submit-btn {
      width: 100%;
      border: 1px solid rgba(255,255,255,0.3);
      color: var(--text);
      background: linear-gradient(90deg, rgba(255,46,136,0.28), rgba(0,247,255,0.24));
      border-radius: 0.85rem;
      padding: 0.92rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      cursor: pointer;
      animation: pulse 2.1s infinite;
    }

    .message {
      min-height: 1.2rem;
      margin-top: 0.8rem;
      color: var(--neon-cyan);
      font-size: 0.95rem;
    }

    .error { color: #ff6f7b; }

    @keyframes pulse {
      0%, 100% { box-shadow: 0 0 14px rgba(0,247,255,0.22); }
      50% { box-shadow: 0 0 26px rgba(255,46,136,0.34); }
    }
  `;
  document.head.appendChild(style);
}

function createNavbar() {
  const nav = document.createElement('nav');
  nav.className = 'top-nav glass';
  nav.innerHTML = `
    <a href="index.html">← Back to Arena</a>
    <strong>Protocol Registration</strong>
    <a href="index.html#leaderboard">Leaderboard</a>
  `;
  return nav;
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

// Register form with floating labels + validation + storage
function createRegisterForm() {
  const wrap = document.createElement('section');
  wrap.className = 'register-wrap glass';

  wrap.innerHTML = `
    <h1>Enter the Protocol</h1>
    <p class="subtitle">Create your contender profile and sync it to the arena leaderboard.</p>
    <form id="register-form" novalidate>
      <div class="field">
        <input id="name" name="name" type="text" placeholder=" " maxlength="22" required />
        <label for="name">Alias</label>
      </div>
      <div class="field">
        <input id="score" name="score" type="number" placeholder=" " min="0" max="99999" required />
        <label for="score">Starting Score</label>
      </div>
      <button class="submit-btn" type="submit">REGISTER CONTESTANT</button>
      <div class="message" id="form-message"></div>
    </form>
  `;

  const form = wrap.querySelector('#register-form');
  const message = wrap.querySelector('#form-message');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    message.classList.remove('error');

    const name = form.name.value.trim();
    const scoreValue = Number(form.score.value);

    if (name.length < 3) {
      message.textContent = 'Alias must be at least 3 characters.';
      message.classList.add('error');
      return;
    }

    if (!Number.isFinite(scoreValue) || scoreValue < 0) {
      message.textContent = 'Starting score must be a valid positive number.';
      message.classList.add('error');
      return;
    }

    const players = getPlayers();
    players.push({ name, score: Math.floor(scoreValue) });
    setPlayers(players);

    message.textContent = 'Registration complete. Redirecting to arena...';

    setTimeout(() => {
      window.location.href = 'index.html#leaderboard';
    }, 900);
  });

  return wrap;
}

init();
