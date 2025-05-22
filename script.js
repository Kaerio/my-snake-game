//TO DO !!!
//html language attribute
//thanks for feedback: DaveDust
//Ideas: time and speed in lower bar, change username, wall of death,, filigrane "snake Game Ultra" sur background
//menu of settings, gameTime, number of turns (currentDirection change)

// ==================================
// Sélection des éléments DOM
// ==================================
const presentationScreen = document.getElementById("presentation-screen");
const presentationScreenBtb = document.getElementById(
  "presentation-screen-btn"
);
const usernameForm = document.getElementById("username-form");
const usernameInput = document.getElementById("username-input");
const userNameText = document.getElementById("user-name-text");
let startGameScreen = document.getElementById("start-game-screen");
let startGameBtn = document.getElementById("start-game-btn");
const instructionsBtn = document.getElementById("instructions-btn");
const instructionsBtnText = instructionsBtn.querySelector(
  ".instructions-btn-text"
);
const instructionsBtnArrow = instructionsBtn.querySelector(
  ".instructions-btn-arrow"
);
const instructionsText = document.getElementById("instructions-text");
const boardContainer = document.getElementById("board-container");
const scoreDiv = document.getElementById("score-div");
const board = document.getElementById("board"); //là où le jeu se déroule
const overlayDiv = document.getElementById("overlay"); //là où le jeu se déroule
const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("high-score");
const fullscreenToggleBtn = document.getElementById("fullscreen-toggle-btn");
const fullScreenIcon = document.getElementById("full-screen-icon");
const minimizeScreenIcon = document.getElementById("minimize-screen-icon");
let gameOverText = document.getElementById("game-over");
const virtualKeyboard = document.getElementById("virtual-keyboard");
const gamepadBtn = document.getElementById("gamepad-btn");

// ==================================
// Variables globales
// ==================================
const gridSize = 20;
let userName = localStorage.getItem("userName") || "";
let IsUserNameSet = userName === "" ? false : true;
let isGameStarted = false;
let isPresentationScreenRemoved = false;
let isBoardMaximized = false;
let isVirtualKeyboardVisible = false;
let currentScore = 0;
let highScore = Number(localStorage.getItem("highScore")) || 0;
let snake = [{ x: 10, y: 10 }];
let foodPosition = generateFoodPosition();
let direction = "right";
let currentSnakeDirection = "right";
let gameInterval;
let gameIntervalDelay = 200;

// localStorage.removeItem('userName')

// ==================================
// Initialisation (event listeners + setup de la page)
// ==================================
presentationScreenBtb.addEventListener("click", removePresentationScreen);
usernameForm.addEventListener("submit", handleUserNameSubmit);
startGameBtn.addEventListener("click", handleStartGameBtn);
instructionsBtn.addEventListener("click", toggleInstructions);
//ajuste dynamiquement la taille du jeu selon le resize de la fenêtre
window.addEventListener("resize", resizeBoardContainer);
document.addEventListener("keydown", handleKeyPress);
fullscreenToggleBtn.addEventListener("click", toggleFullScreen);
gamepadBtn.addEventListener("click", toggleGamepad);

//Toggle affichage des instructions de jeu
function toggleInstructions() {
  if (getComputedStyle(instructionsText).display === "none") {
    instructionsText.style.display = "block";
    instructionsBtn.classList.add("open");
    instructionsBtnText.textContent = "Cacher les instructions";
  } else {
    instructionsText.style.display = "none";
    instructionsBtn.classList.remove("open");
    instructionsBtnText.textContent = "Voir instructions";
  }
}

//Définition de la dimension du plateau de jeu (avec padding de 30px)
function resizeBoardContainer() {
  let padding;

  if (isBoardMaximized && window.innerWidth < 770) {
    padding = 0;
  } else if (isBoardMaximized) {
    padding = scoreDiv.getBoundingClientRect().height;
  } else {
    padding = 30;
  }
  const windowMinDimension =
    Math.min(window.innerWidth, window.innerHeight) - padding;
  boardContainer.style.width = `${windowMinDimension}px`;
  boardContainer.style.height = `${windowMinDimension}px`;
  boardContainer.style.top = `${scoreDiv.getBoundingClientRect().height}px`;
  //Définition des dimension du grid du jeu
  board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
}

function maximizeBoard() {
  isBoardMaximized = true;
  boardContainer.classList.add("maximized");
  boardContainer.classList.remove("minimized");
  scoreDiv.classList.add("maximized");
  board.classList.add("maximized");
  overlayDiv.style.display = "block";
  fullScreenIcon.style.display = "none";
  minimizeScreenIcon.style.display = "inline";

  const docEl = document.documentElement;
  if (docEl.requestFullscreen) {
    docEl.requestFullscreen();
  } else if (docEl.webkitRequestFullscreen) {
    docEl.webkitRequestFullscreen(); // Safari
  } else if (docEl.msRequestFullscreen) {
    docEl.msRequestFullscreen(); // IE/Edge
  }

  resizeBoardContainer();
}

function minimizeBoard() {
  isBoardMaximized = false;
  resizeBoardContainer();
  boardContainer.classList.add("minimized");
  boardContainer.classList.remove("maximized");
  scoreDiv.classList.remove("maximized");
  board.classList.remove("maximized");
  overlayDiv.style.display = "none";
  minimizeScreenIcon.style.display = "none";
  fullScreenIcon.style.display = "inline";
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen(); // Safari
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen(); // IE/Edge
  }
}

function toggleFullScreen() {
  if (isBoardMaximized) {
    minimizeBoard();
  } else {
    maximizeBoard();
  }
}

function toggleGamepad() {
  virtualKeyboard.style.display = isVirtualKeyboardVisible ? "none" : "flex";
  isVirtualKeyboardVisible = !isVirtualKeyboardVisible;
}

//Gestion formulaire de choix du nom de joueur
function handleUserNameSubmit(event) {
  event.preventDefault();
  const inputValue = usernameInput.value.trim();
  if (inputValue !== " ") {
    userName = inputValue;
    IsUserNameSet = true;
    localStorage.setItem("userName", userName);
    displayUsernameForm();
  }
}

function handleStartGameBtn() {
  //Si Click sur "start" pour lancer le jeu
  if (IsUserNameSet === true && isGameStarted === false) {
    startGame();
  }
}

//Gestion des touches clavier physique
function handleKeyPress(event) {
  // Empêche le scrolling si jeu démarré
  if (
    isGameStarted &&
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(event.key)
  ) {
    event.preventDefault();
  }

  handleDirectionInput(event.key);
}

//estion des touches clavier virtuel (mobile)
document.querySelectorAll("#virtual-keyboard .arrow").forEach((button) => {
  const direction = button.getAttribute("data-direction");
  button.addEventListener(
    "touchstart",
    (e) => {
      e.preventDefault(); //empêche zoom/défilement
      handleDirectionInput(direction);
    },
    { passive: false } //permet à preventDefault() de fonctionner (touchstart est un événement passif)
  );
});

//Gestion direction du serpent
function handleDirectionInput(key) {
  let newDirection = direction;

  switch (key) {
    case "ArrowUp":
      newDirection = "up";
      break;
    case "ArrowDown":
      newDirection = "down";
      break;
    case "ArrowLeft":
      newDirection = "left";
      break;
    case "ArrowRight":
      newDirection = "right";
      break;
  }

  // Empêcher au serpent de faire demi-tour sur lui-même
  if (snake.length > 1) {
    if (
      (currentSnakeDirection === "up" && newDirection === "down") ||
      (currentSnakeDirection === "down" && newDirection === "up") ||
      (currentSnakeDirection === "left" && newDirection === "right") ||
      (currentSnakeDirection === "right" && newDirection === "left")
    ) {
      return;
    }
  }
  direction = newDirection;
}

function removePresentationScreen() {
  presentationScreen.style.display = "none";
  isPresentationScreenRemoved = true;
  displayUsernameForm();
}

//Affichage du formulaire de choix du nom
function displayUsernameForm() {
  if (IsUserNameSet) {
    usernameForm.style.display = "none";
    userNameText.textContent = userName;
    draw();
    startGameScreen.style.display = "flex";
  } else {
    usernameForm.style.display = "flex";
  }
}

// ==================================
// Initialisation setup de la page)
// ==================================

//Création du Grid initial du pleateau de jeu
function initializeBoard() {
  for (let row = 1; row <= gridSize; row++) {
    for (let col = 1; col <= gridSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.id = `x${col}-y${row}`;
      board.appendChild(cell);
    }
  }
}

initializeBoard();

resizeBoardContainer(); // définition initiale du plateau de jeu
highScoreText.textContent = highScore.toString().padStart(3, "0");

// ==================================
// Fonctions du jeu
// ==================================

function startGame() {
  startGameScreen.style.display = "none";
  isGameStarted = true;
  currentScore = 0;
  // gameOver()

  // draw()
  gameInterval = setInterval(() => {
    move();
    draw();
  }, gameIntervalDelay);
}

function draw() {
  drawSnake();
  drawFood();
}

function drawSnake() {
  snake.forEach((segment, index) => {
    const cell = document.querySelector(`#x${segment.x}-y${segment.y}`);
    cell.className = "";

    //Tête du serpent
    if (
      index === 0 ||
      //Ou en cas de collision fin de partie montrer la tête sur le corps
      (snake[0].x === segment.x && snake[0].y === segment.y)
    ) {
      switch (direction) {
        case "down":
          cell.classList.add("snake-head-down");
          break;
        case "up":
          cell.classList.add("snake-head-up");
          break;
        case "right":
          cell.classList.add("snake-head-right");
          break;
        case "left":
          cell.classList.add("snake-head-left");
          break;
      }
    }
    //Corps du serpent
    else {
      cell.classList.add("snake-body");
    }
  });
}

function drawFood() {
  if (foodPosition.x === snake[0].x && foodPosition.y === snake[0].y)
    do {
      foodPosition = generateFoodPosition();
    } while (isFoodInSnake());

  const cell = document.querySelector(`#x${foodPosition.x}-y${foodPosition.y}`);
  cell.className = "";
  cell.classList.add("food");
}

function generateFoodPosition() {
  const x = Math.floor(Math.random() * gridSize) + 1;
  const y = Math.floor(Math.random() * gridSize) + 1;
  return { x, y };
}

function isFoodInSnake() {
  return snake.some((segment) => {
    return foodPosition.x === segment.x && foodPosition.y === segment.y;
  });
}

function move() {
  snakeHeadPosition = { ...snake[0] };
  switch (direction) {
    case "up":
      if (snakeHeadPosition.y > 1) {
        snakeHeadPosition.y--;
      } else {
        snakeHeadPosition.y = gridSize;
      }
      currentSnakeDirection = "up";
      break;
    case "right":
      if (snakeHeadPosition.x < gridSize) {
        snakeHeadPosition.x++;
      } else {
        snakeHeadPosition.x = 1;
      }
      currentSnakeDirection = "right";
      break;
    case "down":
      if (snakeHeadPosition.y < gridSize) {
        snakeHeadPosition.y++;
      } else {
        snakeHeadPosition.y = 1;
      }
      currentSnakeDirection = "down";
      break;
    case "left":
      if (snakeHeadPosition.x > 1) {
        snakeHeadPosition.x--;
      } else {
        snakeHeadPosition.x = gridSize;
      }
      currentSnakeDirection = "left";
      break;
  }

  snake.unshift(snakeHeadPosition);

  //Si le serpent à mangé la nourriture
  if (
    snakeHeadPosition.x === foodPosition.x &&
    snakeHeadPosition.y === foodPosition.y
  ) {
    draw();
    updateScore();
    increaseSpeed();
    clearInterval(gameInterval);
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameIntervalDelay);
  } else {
    //reset de la dernière cellule du serpent si il n'a pas mangé la nouriture
    const cellPosition = snake.pop();
    const cell = document.querySelector(
      `#x${cellPosition.x}-y${cellPosition.y}`
    );
    cell.className = "";
    cell.classList.add("cell");
  }
}

function updateScore() {
  currentScore++;
  scoreText.textContent = currentScore.toString().padStart(3, "0");
}

function increaseSpeed() {
  gameIntervalDelay =
    gameIntervalDelay > 150
      ? gameIntervalDelay - 5
      : gameIntervalDelay > 120
      ? gameIntervalDelay - 3
      : gameIntervalDelay > 90
      ? gameIntervalDelay - 2
      : gameIntervalDelay > 60
      ? gameIntervalDelay - 1
      : gameIntervalDelay - 0.5;
}

function checkCollision() {
  const head = snake[0];
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
      snake[0];
    }
  }
}

function gameOver() {
  clearInterval(gameInterval);
  highScore = highScore > currentScore ? highScore : currentScore;
  localStorage.setItem("highScore", highScore);
  highScoreText.textContent = highScore.toString().padStart(3, "0");
  gameOverText.style.display = "flex";
  gameOverText.innerHTML = createGameOverText();
  document.getElementById("restartBtn").addEventListener("click", function () {
    restart();
  });
}

function createGameOverText() {
  let output = `
        <h2>Game over</h2>
        <p>Score: ${currentScore.toString()}</p>
        <p>Player: ${userName}</p>    
        <p>Best score: ${highScore.toString()}</p>
        <button id="restartBtn">Restart</button>`;
  return output;
}

function restart() {
  currentScore = 0;
  scoreText.textContent = "000";
  gameOverText.style.display = "none";
  isGameStarted = false;
  board.innerHTML = `
        <div id="start-game-screen">
            <button id="start-game-btn">Start</button>
          </div>
        <div id="game-over"></div>`;
  initializeBoard();
  startGameScreen = document.getElementById("start-game-screen");
  startGameBtn = document.getElementById("start-game-btn");
  startGameBtn.addEventListener("click", handleStartGameBtn);
  gameOverText = document.getElementById("game-over");
  snake = [{ x: 10, y: 10 }];
  foodPosition = generateFoodPosition();
  direction = "right";
  currentSnakeDirection = "right";
  gameInterval;
  gameIntervalDelay = 200;
  draw();
  startGameScreen.style.display = "flex";
}
