// نمونه ساده برد منچ و تاس

const board = document.getElementById('ludo-board');
const diceBtn = document.getElementById('roll-dice');
const diceResult = document.getElementById('dice-result');
const turnInfo = document.getElementById('turn-info');

// ساده‌ترین حالت: فقط نمایش برد و تاس
// شما می‌توانید بعداً مهره‌ها، حرکت و منطق بازی را اضافه کنید

// رسم برد منچ (15x15 خانه)
function drawBoard() {
  board.innerHTML = '';
  for (let i = 0; i < 225; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    board.appendChild(cell);
  }
}

let players = [
  {name: 'قرمز', color: 'red'},
  {name: 'سبز', color: 'green'},
  {name: 'آبی', color: 'blue'},
  {name: 'زرد', color: 'yellow'}
];
let turn = 0;

function updateTurnInfo() {
  turnInfo.textContent = `نوبت بازیکن: ${players[turn].name}`;
}

function rollDice() {
  const result = Math.floor(Math.random() * 6) + 1;
  diceResult.textContent = result;
  // حرکت مهره و منطق بازی را اینجا اضافه کنید
  turn = (turn + 1) % players.length;
  updateTurnInfo();
}

diceBtn.addEventListener('click', rollDice);

drawBoard();
updateTurnInfo();