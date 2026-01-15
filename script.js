const tilesContainer = document.getElementById("tiles");
const targetSwatch = document.getElementById("target-swatch");
const targetValue = document.getElementById("target-value");
const message = document.getElementById("message");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const bestEl = document.getElementById("best");
const newRoundButton = document.getElementById("new-round");
const difficultySelect = document.getElementById("difficulty");
const hintToggle = document.getElementById("hint");

const state = {
  tiles: [],
  answerIndex: 0,
  score: 0,
  streak: 0,
  best: 0,
};

const randomChannel = () => Math.floor(Math.random() * 256);

const randomColor = () => {
  const color = {
    r: randomChannel(),
    g: randomChannel(),
    b: randomChannel(),
  };

  return {
    ...color,
    css: `rgb(${color.r}, ${color.g}, ${color.b})`,
  };
};

const buildTiles = (count) => {
  state.tiles = Array.from({ length: count }, () => randomColor());
  state.answerIndex = Math.floor(Math.random() * state.tiles.length);
};

const updateScoreboard = () => {
  scoreEl.textContent = state.score;
  streakEl.textContent = state.streak;
  bestEl.textContent = state.best;
};

const updateTarget = () => {
  const answer = state.tiles[state.answerIndex];
  targetValue.textContent = answer.css;
  targetSwatch.style.background = hintToggle.checked
    ? answer.css
    : "repeating-linear-gradient(135deg, rgba(255,255,255,0.2) 0 8px, transparent 8px 16px)";
};

const renderTiles = () => {
  tilesContainer.innerHTML = "";

  state.tiles.forEach((tile, index) => {
    const button = document.createElement("button");
    button.className = "tile";
    button.style.background = tile.css;
    button.setAttribute("aria-label", `Color tile ${tile.css}`);

    button.addEventListener("click", () => handleGuess(index, button));

    tilesContainer.appendChild(button);
  });
};

const handleGuess = (index, button) => {
  const isCorrect = index === state.answerIndex;

  if (isCorrect) {
    state.score += 10;
    state.streak += 1;
    state.best = Math.max(state.best, state.streak);
    message.textContent = "Nice! You matched the color.";
    button.classList.add("correct");
  } else {
    state.score = Math.max(0, state.score - 5);
    state.streak = 0;
    message.textContent = "Not quite. Try another tile!";
    button.classList.add("wrong");
  }

  updateScoreboard();
};

const startRound = () => {
  const count = Number.parseInt(difficultySelect.value, 10);
  buildTiles(count);
  renderTiles();
  updateTarget();
  message.textContent = "Choose the tile that matches the RGB value.";
};

newRoundButton.addEventListener("click", startRound);

difficultySelect.addEventListener("change", startRound);

hintToggle.addEventListener("change", updateTarget);

startRound();
updateScoreboard();
