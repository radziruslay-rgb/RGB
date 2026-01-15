const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const bestEl = document.getElementById("best");
const statusEl = document.getElementById("status");
const speedSelect = document.getElementById("speed");
const restartButton = document.getElementById("restart");
const controlButtons = document.querySelectorAll(".control-button");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

const state = {
  snake: [],
  direction: { x: 1, y: 0 },
  nextDirection: { x: 1, y: 0 },
  food: { x: 10, y: 10 },
  score: 0,
  best: 0,
  running: false,
  timer: null,
};

const neonGradient = () => {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#6c7cff");
  gradient.addColorStop(1, "#2fe6a5");
  return gradient;
};

const resetSnake = () => {
  state.snake = [
    { x: 7, y: 10 },
    { x: 6, y: 10 },
    { x: 5, y: 10 },
  ];
  state.direction = { x: 1, y: 0 };
  state.nextDirection = { x: 1, y: 0 };
};

const randomFood = () => {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (state.snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y));

  state.food = newFood;
};

const updateScore = () => {
  scoreEl.textContent = state.score;
  bestEl.textContent = state.best;
};

const setStatus = (text) => {
  statusEl.textContent = text;
};

const drawBackground = () => {
  ctx.fillStyle = "#0b1229";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  for (let i = 0; i <= tileCount; i += 1) {
    ctx.beginPath();
    ctx.moveTo(i * gridSize, 0);
    ctx.lineTo(i * gridSize, canvas.height);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i * gridSize);
    ctx.lineTo(canvas.width, i * gridSize);
    ctx.stroke();
  }
};

const drawFood = () => {
  ctx.fillStyle = "#fcd34d";
  ctx.shadowColor = "#fcd34d";
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(
    state.food.x * gridSize + gridSize / 2,
    state.food.y * gridSize + gridSize / 2,
    gridSize / 3,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.shadowBlur = 0;
};

const drawSnake = () => {
  ctx.fillStyle = neonGradient();
  ctx.shadowColor = "rgba(108, 124, 255, 0.7)";
  ctx.shadowBlur = 10;

  state.snake.forEach((segment, index) => {
    const radius = index === 0 ? 6 : 4;
    const x = segment.x * gridSize + 2;
    const y = segment.y * gridSize + 2;
    const size = gridSize - 4;
    ctx.beginPath();
    ctx.roundRect(x, y, size, size, radius);
    ctx.fill();
  });

  ctx.shadowBlur = 0;
};

const draw = () => {
  drawBackground();
  drawFood();
  drawSnake();
};

const hitWall = (head) => head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount;

const hitSelf = (head) =>
  state.snake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y);

const tick = () => {
  state.direction = { ...state.nextDirection };
  const head = { x: state.snake[0].x + state.direction.x, y: state.snake[0].y + state.direction.y };

  if (hitWall(head) || hitSelf(head)) {
    setStatus("Game over. Tap restart to play again.");
    state.running = false;
    return;
  }

  state.snake.unshift(head);

  if (head.x === state.food.x && head.y === state.food.y) {
    state.score += 10;
    state.best = Math.max(state.best, state.score);
    randomFood();
    setStatus("Nice! Keep going.");
  } else {
    state.snake.pop();
  }

  updateScore();
  draw();
};

const start = () => {
  if (state.timer) {
    clearInterval(state.timer);
  }
  state.running = true;
  state.timer = setInterval(tick, Number(speedSelect.value));
};

const restart = () => {
  resetSnake();
  randomFood();
  state.score = 0;
  updateScore();
  setStatus("Game on! Collect the glowing orb.");
  draw();
  start();
};

const setDirection = (x, y) => {
  if (!state.running) {
    start();
  }

  if (state.direction.x === -x && state.direction.y === -y) {
    return;
  }

  state.nextDirection = { x, y };
};

window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") setDirection(0, -1);
  if (event.key === "ArrowDown") setDirection(0, 1);
  if (event.key === "ArrowLeft") setDirection(-1, 0);
  if (event.key === "ArrowRight") setDirection(1, 0);
});

controlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const direction = button.dataset.direction;
    if (direction === "up") setDirection(0, -1);
    if (direction === "down") setDirection(0, 1);
    if (direction === "left") setDirection(-1, 0);
    if (direction === "right") setDirection(1, 0);
  });
});

restartButton.addEventListener("click", restart);

speedSelect.addEventListener("change", () => {
  if (state.running) {
    start();
  }
});

resetSnake();
randomFood();
updateScore();
draw();
