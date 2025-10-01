/* Munch Pro Max — Front-end MVP (Apix)
   - Local game logic + optional WebSocket hooks
   - Board: simplified Ludo path with 52 global steps + 6 home steps per color
*/

const BACKEND_URL = ""; // e.g., "https://your-backend.example.com"
const USE_LOCAL = !BACKEND_URL;

const COLORS = ["red", "green", "yellow", "blue"]; // order for turns
const PLAYER_NAMES = { red: "قرمز", green: "سبز", yellow: "زرد", blue: "آبی" };

const state = {
  roomId: null,
  players: [
    { id: "p-red", color: "red", name: "قرمز", tokens: [ -1, -1, -1, -1 ] },
    { id: "p-green", color: "green", name: "سبز", tokens: [ -1, -1, -1, -1 ] },
    { id: "p-yellow", color: "yellow", name: "زرد", tokens: [ -1, -1, -1, -1 ] },
    { id: "p-blue", color: "blue", name: "آبی", tokens: [ -1, -1, -1, -1 ] }
  ],
  turnIndex: 0,
  lastRoll: null,
  rollsThisTurn: 0,
  started: true // local mode starts immediately
};

const ui = {
  board: document.getElementById("board"),
  rollBtn: document.getElementById("rollBtn"),
  diceValue: document.getElementById("diceValue"),
  tokenChoices: document.getElementById("tokenChoices"),
  moveBtn: document.getElementById("moveBtn"),
  turnName: document.getElementById("turnName"),
  status: document.getElementById("status"),
  joinBtn: document.getElementById("joinBtn"),
  createBtn: document.getElementById("createBtn"),
  roomCode: document.getElementById("roomCode"),
  readyBtn: document.getElementById("readyBtn"),
  inviteBtn: document.getElementById("inviteBtn")
};

// Board coordinates (approx) for 52 path cells + 4 homes
const BOARD_SIZE = 600;
// Build a simple path: we'll approximate Ludo ring with points around a grid.
const pathPoints = buildPathPoints();
const homeEntries = {
  red: 0,       // index where red enters ring
  green: 13,    // 13 steps ahead
  yellow: 26,   // etc.
  blue: 39
};

init();

function init() {
  ui.status.textContent = USE_LOCAL ? "وضعیت: آفلاین (لوکال)" : "وضعیت: آنلاین";
  renderBoard();
  renderTokens();
  updateTurnLabel();

  ui.rollBtn.addEventListener("click", onRollDice);
  ui.moveBtn.addEventListener("click", onMove);
  ui.createBtn.addEventListener("click", onCreateRoom);
  ui.joinBtn.addEventListener("click", onJoinRoom);
  ui.readyBtn.addEventListener("click", () => info("آماده شد."));
  ui.inviteBtn.addEventListener("click", onInvite);

  // If using backend, set up sockets
  // if (!USE_LOCAL) setupSocket();
}

/* ---------- Board Rendering ---------- */
function renderBoard() {
  const svg = ui.board;
  svg.innerHTML = "";

  // Background grid
  for (let i = 0; i < 12; i++) {
    const h = line(0, i * 50, BOARD_SIZE, i * 50, "grid-line");
    const v = line(i * 50, 0, i * 50, BOARD_SIZE, "grid-line");
    svg.appendChild(h); svg.appendChild(v);
  }

  // Path cells
  pathPoints.forEach((p, i) => {
    const cell = rect(p.x - 16, p.y - 16, 32, 32, "path-cell");
    svg.appendChild(cell);
  });

  // Safe cells: 4 entry points
  Object.values(homeEntries).forEach(idx => {
    const p = pathPoints[idx];
    const safe = rect(p.x - 20, p.y - 20, 40, 40, "safe-cell");
    svg.appendChild(safe);
  });

  // Turn indicator
  const box = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
  box.setAttribute("x", 12); box.setAttribute("y", 12);
  box.setAttribute("width", 180); box.setAttribute("height", 40);
  const div = document.createElement("div");
  div.className = "turn-indicator";
  div.textContent = "منچ پرو مکس • Apix";
  box.appendChild(div);
  svg.appendChild(box);
}

function renderTokens() {
  // remove existing tokens
  Array.from(ui.board.querySelectorAll(".token")).forEach(el => el.remove());

  state.players.forEach((pl, pi) => {
    pl.tokens.forEach((pos, ti) => {
      const { x, y } = tokenCoord(pl.color, pos, ti);
      const c = circle(x, y, 12, `token ${pl.color}`);
      c.setAttribute("data-player", pl.color);
      c.setAttribute("data-token", ti);
      c.addEventListener("click", () => onTokenSelect(pl.color, ti));
      ui.board.appendChild(c);
    });
  });

  renderChoices();
}

function renderChoices() {
  ui.tokenChoices.innerHTML = "";
  const player = state.players[state.turnIndex];
  player.tokens.forEach((pos, ti) => {
    const btn = document.createElement("button");
    btn.className = "token-btn";
    btn.textContent = `مهره ${ti + 1}`;
    btn.onclick = () => onTokenSelect(player.color, ti);
    // Enable only if movable with current roll
    btn.disabled = !canMove(player, ti, state.lastRoll);
    ui.tokenChoices.appendChild(btn);
  });
}

/* ---------- Interaction ---------- */
function updateTurnLabel() {
  const current = state.players[state.turnIndex];
  ui.turnName.textContent = PLAYER_NAMES[current.color];
}

function onRollDice() {
  const current = state.players[state.turnIndex];
  const roll = Math.floor(Math.random() * 6) + 1;
  state.lastRoll = roll;
  state.rollsThisTurn = roll === 6 ? state.rollsThisTurn + 1 : 1;

  ui.diceValue.textContent = roll;
  renderChoices();

  // In real backend: emit roll_dice
  // socket.emit('roll_dice', { roomId: state.roomId, playerId: current.id });
}

function onTokenSelect(color, tokenIndex) {
  const isTurn = state.players[state.turnIndex].color === color;
  const choices = ui.tokenChoices.querySelectorAll(".token-btn");
  choices.forEach((b, i) => {
    if (i === tokenIndex) b.classList.add("active");
    else b.classList.remove("active");
  });
  ui.moveBtn.disabled = !(isTurn && state.lastRoll && canMove(getPlayer(color), tokenIndex, state.lastRoll));
  ui.moveBtn.dataset.color = color;
  ui.moveBtn.dataset.token = tokenIndex;
}

function onMove() {
  const color = ui.moveBtn.dataset.color;
  const tokenIndex = Number(ui.moveBtn.dataset.token);
  const roll = state.lastRoll;
  if (!roll) return;

  applyMove(color, tokenIndex, roll);
  state.lastRoll = null;
  ui.diceValue.textContent = "—";
  renderTokens();

  // Continue turn on 6 if any moves remain
  const current = getPlayer(color);
  let continues = false;
  if (roll === 6) {
    continues = current.tokens.some((_, ti) => canMove(current, ti, null)); // if lastRoll null, ignore; we'll let player roll again
  }

  if (!continues) passTurn();
  else renderChoices();
}

function passTurn() {
  state.turnIndex = (state.turnIndex + 1) % state.players.length;
  updateTurnLabel();
  renderChoices();
}

function onCreateRoom() {
  if (USE_LOCAL) {
    info("اتاق لوکال ایجاد شد. برای مولتی‌پلیر، بک‌اند را تنظیم کن.");
    return;
  }
  // fetch POST /rooms then join via socket
}

function onJoinRoom() {
  if (USE_LOCAL) {
    info("ورود لوکال. برای آنلاین، کد اتاق و بک‌اند لازم است.");
    return;
  }
}

function onInvite() {
  const code = ui.roomCode.value || "000000";
  const url = location.origin + location.pathname + `?room=${encodeURIComponent(code)}`;
  navigator.clipboard.writeText(url).then(() => info("لینک اتاق کپی شد."));
}

/* ---------- Game Logic ---------- */
function getPlayer(color) { return state.players.find(p => p.color === color); }

function canMove(player, tokenIndex, roll) {
  // If no roll yet (UI selection), allow select only if any move possible after roll
  const r = roll ?? 1; // loose check
  const pos = player.tokens[tokenIndex];
  if (pos === -1) return r === 6; // need 6 to leave base
  if (pos >= 100) return false;   // already home
  // Normal move: ensure not overshooting home path
  const target = advancePos(player.color, pos, r);
  if (target === null) return false;
  // Collision rules handled in applyMove; here we just say it's movable
  return true;
}

function applyMove(color, tokenIndex, roll) {
  const player = getPlayer(color);
  const pos = player.tokens[tokenIndex];

  // Leave base with 6
  let newPos = pos;
  if (pos === -1) {
    if (roll === 6) {
      newPos = entryPos(color);
    } else {
      return; // invalid
    }
  } else {
    const next = advancePos(color, pos, roll);
    if (next === null) return; // cannot move
    newPos = next;
  }

  // Handle collisions on ring (only when in global path positions < 52)
  const ringIndex = ringIndexOf(color, newPos);
  if (ringIndex !== null) {
    state.players.forEach(op => {
      if (op.color === color) return;
      op.tokens = op.tokens.map(tpos => {
        const r2 = ringIndexOf(op.color, tpos);
        if (r2 !== null && r2 === ringIndex && !isSafeCell(ringIndex)) {
          return -1; // send back to base
        }
        return tpos;
      });
    });
  }

  player.tokens[tokenIndex] = newPos;
}

function entryPos(color) {
  // global ring position start for this color (0..51 mapped per color)
  return mapRingToColor(color, homeEntries[color]);
}

function advancePos(color, pos, steps) {
  // If in home stretch (>= 100..106 per color), advance within 6 cells
  if (pos >= 100) {
    const maxHome = 106;
    const next = pos + steps;
    if (next > maxHome) return null; // overshoot not allowed
    return next;
  }

  // On ring: move steps; if passing entry to home, enter home path
  const currentRing = ringIndexOf(color, pos); // 0..51
  const nextRing = (currentRing + steps) % 52;
  // If crossing into home: when nextRing reaches (homeEntries[color] + 52) % 52 after full lap
  const entry = homeEntries[color];
  const laps = currentRing + steps >= 52 ? 1 : 0;
  if (laps && ((currentRing <= entry && nextRing > entry) || (currentRing > entry && nextRing <= entry))) {
    // Enter home with remaining steps after reaching entry
    const toEntry = (52 - currentRing + entry) % 52;
    const rem = steps - toEntry;
    return 100 + rem; // 100..106
  }
  // Otherwise, continue on ring
  return mapRingToColor(color, nextRing);
}

function ringIndexOf(color, pos) {
  if (pos >= 100) return null; // home path
  // Convert color-specific pos back to global ring index (0..51)
  // We store color-mapped positions as global index encoded in pos via mapRingToColor
  // For simplicity we encode ring positions as 0..51 already.
  return pos;
}
function mapRingToColor(color, ringIdx) {
  // We keep ring positions as 0..51 for all colors in this MVP
  return ringIdx;
}

function isSafeCell(ringIdx) {
  // Entry cells are safe
  return Object.values(homeEntries).includes(ringIdx);
}

/* ---------- Coordinates ---------- */
function tokenCoord(color, pos, tokenIndex) {
  // Base nests near corners; ring cells use pathPoints; home path straight into center
  if (pos === -1) {
    const corner = baseCorner(color);
    return { x: corner.x + 20 * (tokenIndex % 2), y: corner.y + 20 * (Math.floor(tokenIndex / 2)) };
  }
  if (pos >= 100) {
    const base = homeBase(color);
    const step = pos - 100;
    return { x: base.x + step * base.dx, y: base.y + step * base.dy };
  }
  // ring
  const p = pathPoints[pos % pathPoints.length];
  return { x: p.x, y: p.y };
}

function baseCorner(color) {
  const m = 80;
  if (color === "red")   return { x: m, y: m };
  if (color === "green") return { x: BOARD_SIZE - m - 40, y: m };
  if (color === "yellow")return { x: m, y: BOARD_SIZE - m - 40 };
  if (color === "blue")  return { x: BOARD_SIZE - m - 40, y: BOARD_SIZE - m - 40 };
  return { x: 60, y: 60 };
}

function homeBase(color) {
  // Straight line towards center
  const c = BOARD_SIZE / 2;
  if (color === "red")   return { x: c - 140, y: c, dx: 22, dy: 0 };
  if (color === "green") return { x: c + 140, y: c, dx: -22, dy: 0 };
  if (color === "yellow")return { x: c, y: c + 140, dx: 0, dy: -22 };
  if (color === "blue")  return { x: c, y: c - 140, dx: 0, dy: 22 };
  return { x: c, y: c, dx: 0, dy: 0 };
}

function buildPathPoints() {
  // 52 cells around a square ring
  const pts = [];
  const margin = 80, step = 40;
  const min = margin, max = BOARD_SIZE - margin;

  // Top row left->right (13 cells)
  for (let i = 0; i < 13; i++) pts.push({ x: min + i * step, y: min });
  // Right column top->down (13 cells)
  for (let i = 1; i <= 13; i++) pts.push({ x: max, y: min + i * step });
  // Bottom row right->left (13 cells)
  for (let i = 1; i <= 13; i++) pts.push({ x: max - i * step, y: max });
  // Left column bottom->top (13 cells)
  for (let i = 1; i <= 13; i++) pts.push({ x: min, y: max - i * step });

  // Clip to 52
  return pts.slice(0, 52);
}

/* ---------- SVG helpers ---------- */
function rect(x, y, w, h, cls) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "rect");
  el.setAttribute("x", x); el.setAttribute("y", y);
  el.setAttribute("width", w); el.setAttribute("height", h);
  el.setAttribute("rx", 8); el.setAttribute("ry", 8);
  el.setAttribute("class", cls);
  return el;
}
function circle(cx, cy, r, cls) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  el.setAttribute("cx", cx); el.setAttribute("cy", cy);
  el.setAttribute("r", r); el.setAttribute("class", cls);
  return el;
}
function line(x1, y1, x2, y2, cls) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", "line");
  el.setAttribute("x1", x1); el.setAttribute("y1", y1);
  el.setAttribute("x2", x2); el.setAttribute("y2", y2);
  el.setAttribute("class", cls);
  return el;
}

/* ---------- Feedback ---------- */
function info(msg) {
  ui.status.textContent = "وضعیت: " + msg;
  setTimeout(() => {
    ui.status.textContent = USE_LOCAL ? "وضعیت: آفلاین (لوکال)" : "وضعیت: آنلاین";
  }, 2000);
}

/* ---------- Socket skeleton (optional) ---------- */
// let socket = null;
// function setupSocket() {
//   socket = io(BACKEND_URL, { transports: ["websocket"] });
//   socket.on("connect", () => { ui.status.textContent = "وضعیت: آنلاین"; });
//   socket.on("disconnect", () => { ui.status.textContent = "وضعیت: قطع"; });
//
//   socket.on("state_update", (msg) => {
//     // apply server snapshot into local state and re-render
//   });
// }