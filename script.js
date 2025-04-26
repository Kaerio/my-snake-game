// ==================================
// Sélection des éléments DOM
// ==================================
const usernameForm = document.getElementById('username-form')
const usernameInput = document.getElementById('username-input')
const userNameText = document.getElementById('user-name-text')
const instructionsBtn = document.getElementById('instructions-btn')
const instructionsBtnText = instructionsBtn.querySelector('.instructions-btn-text')
const instructionsBtnArrow = instructionsBtn.querySelector('.instructions-btn-arrow')
const instructionsText = document.getElementById('instructions-text')
const boardContainer = document.getElementById('board-container')
const board = document.getElementById('board') //là où le jeu se déroule
const presentationScreen = document.getElementById('presentation-screen')
const scoreText = document.getElementById('score')
const highScoreText = document.getElementById('high-score')
const GameOverText = document.getElementById('game-over')

// ==================================
// Variables globales
// ==================================
const gridSize = 20
let userName = localStorage.getItem('userName') || ''
let IsUserNameSet = userName === '' ? false : true
let isGameStarted = false
let currentScore = 0
let highScore = Number(localStorage.getItem('highScore')) || 0
const snake = [{x: 10, y: 10}]
let foodPosition = generateFoodPosition()
let direction = 'right'
let currentSnakeDirection = 'right'
let gameInterval
let gameIntervalDelay = 200

// ==================================
// Initialisation (event listeners + setup de la page)
// ==================================


instructionsBtn.addEventListener('click', toggleInstructions);
//ajuste dynamiquement la taille du jeu selon le resize de la fenêtre
window.addEventListener('resize', resizeBoardContainer)
usernameForm.addEventListener('submit', handleUserNameSubmit)
document.addEventListener('keydown', handelKeyPress)

//Toggle affichage des instructions de jeu
function toggleInstructions(){
    if (getComputedStyle(instructionsText).display === 'none') {
        instructionsText.style.display = 'block'
        instructionsBtn.classList.add('open')
        instructionsBtnText.textContent = 'Cacher les instructions'
    } else {
        instructionsText.style.display = 'none'
        instructionsBtn.classList.remove('open')
        instructionsBtnText.textContent = 'Voir les instructions'
    }
}

//Définition de la dimension du plateau de jeu
function resizeBoardContainer(){
    const windowMinDimension = Math.min(window.innerWidth, window.innerHeight) - 30
    boardContainer.style.width = `${windowMinDimension}px`
    boardContainer.style.height = `${windowMinDimension}px`

    //Définition des dimension du grid
    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`
    board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`     
}

//Gestion formulaire de choix du nom de joueur
function handleUserNameSubmit(event){
    event.preventDefault()
    const inputValue = usernameInput.value.trim()
    if(inputValue !== ' '){
        userName = inputValue
        IsUserNameSet = true
        localStorage.setItem('userName', userName)
        usernameForm.style.display = 'none'
        presentationScreen.style.display = 'flex'
        userNameText.textContent = userName
    }
}

//Gestion des touches
function handelKeyPress(event){
    if(event.code === 'space' || event.key === ' '){
        if(IsUserNameSet === true && isGameStarted === false){
            startGame()
        }
    }
    else{        
        let newDirection = direction;

        switch (event.key) {
            case 'ArrowUp':
                newDirection = 'up';
                break;
            case 'ArrowDown':
                newDirection = 'down';
                break;
            case 'ArrowLeft':
                newDirection = 'left';
                break;
            case 'ArrowRight':
                newDirection = 'right';
                break;                
        }

        // Empêcher au serpent de faire demi-tour sur lui-même
        if (snake.length > 1) {
            if ((currentSnakeDirection === 'up' && newDirection === 'down') ||
                (currentSnakeDirection === 'down' && newDirection === 'up') ||
                (currentSnakeDirection === 'left' && newDirection === 'right') ||
                (currentSnakeDirection === 'right' && newDirection === 'left')) {
                return;
            }
        }
        direction = newDirection;
    }           
}

// ==================================
// Initialisation setup de la page)
// ==================================
//Affichage du formulaire de choix du nom
if (IsUserNameSet) {
    usernameForm.style.display = 'none'
    presentationScreen.style.display = 'flex'
    userNameText.textContent = userName
} else {
    usernameForm.style.display = 'flex';
}

//Création du Grid initial du pleateau de jeu
for(let row = 1; row <= gridSize; row++){
    for (let col = 1; col <= gridSize; col++) {
        const cell = document.createElement('div')
        cell.className = 'cell'
        cell.id = `x${col}-y${row}`
        board.appendChild(cell)
    }
}

resizeBoardContainer() // définition initiale du plateau de jeu
highScoreText.textContent = highScore.toString().padStart(3, '0');

// ==================================
// Fonctions
// ==================================

function startGame(){    
    isGameStarted = true
    currentScore = 0
    presentationScreen.style.display = 'none'
    draw()
    gameInterval = setInterval(() => {
        move()
        draw()
    }, gameIntervalDelay)
}

function draw(){
    drawSnake()
    drawFood()
}

function drawSnake(){
    snake.forEach((segment, index) => {
        const htmlElement = document.querySelector(`#x${segment.x}-y${segment.y}`)

        if(index === 0 ||
            //Ou en cas de collision fin de partie montrer la tête sur le corps
            (snake[0].x === segment.x && snake[0].y === segment.y) ){ 
                switch (direction) {
                    case 'down':
                        htmlElement.className = 'snake-head-down'
                        break;
                    case 'up':
                        htmlElement.className = 'snake-head-up'
                        break;
                    case 'right':
                        htmlElement.className = 'snake-head-right'
                        break;
                    case 'left':
                        htmlElement.className = 'snake-head-left'
                        break; 
            }
        }else{
            htmlElement.className = 'snake-body'
        }
    })
}

function drawFood(){
    if(foodPosition.x === snake[0].x && foodPosition.y === snake[0].y)
    do {
        foodPosition = generateFoodPosition()
    } while (isFoodInSnake());

    const htmlElement = document.querySelector(`#x${foodPosition.x}-y${foodPosition.y}`)
    htmlElement.className = 'food'
}

function generateFoodPosition(){
    const x = Math.floor(Math.random() * gridSize) + 1
    const y = Math.floor(Math.random() * gridSize) + 1
    return {x, y}
}

function isFoodInSnake(){
    return snake.some(segment => {
        return foodPosition.x === segment.x && foodPosition.y === segment.y
    })
}

function move(){
    snakeHeadPosition = {...snake[0]}
    switch (direction) {
        case 'up':            
            if(snakeHeadPosition.y > 1 ){
                snakeHeadPosition.y--
            }else{
                snakeHeadPosition.y = gridSize
            }  
            currentSnakeDirection = 'up'     
            break;
        case 'right':
            if(snakeHeadPosition.x < gridSize){
                snakeHeadPosition.x++
            }else{
                snakeHeadPosition.x = 1
            } 
            currentSnakeDirection = 'right' 
            break;
        case 'down':
            if(snakeHeadPosition.y < gridSize){
                snakeHeadPosition.y++
            }else{
                snakeHeadPosition.y = 1
            }
            currentSnakeDirection = 'down' 
            break;
        case 'left':
            if(snakeHeadPosition.x > 1){
                snakeHeadPosition.x--
            }else{
                snakeHeadPosition.x = gridSize
            } 
            currentSnakeDirection = 'left' 
            break;
    }

    snake.unshift(snakeHeadPosition)

    //Si le serpent à mangé la nourriture
    if(snakeHeadPosition.x === foodPosition.x && snakeHeadPosition.y === foodPosition.y){
        draw()
        updateScore()
        increaseSpeed()
        clearInterval(gameInterval)
        gameInterval = setInterval(() => {            
            move()
            checkCollision()
            draw()
        }, gameIntervalDelay)
    }else{
        //reset de la dernière cellule du serpent si il n'a pas mangé la nouriture
        const cellPosition = snake.pop()
        const htmlElement = document.querySelector(`#x${cellPosition.x}-y${cellPosition.y}`)
        htmlElement.className = 'cell'
    }    
}

function updateScore(){
    currentScore++
    scoreText.textContent = currentScore.toString().padStart(3, '0')
}

function increaseSpeed(){
    gameIntervalDelay = gameIntervalDelay > 150 ? gameIntervalDelay - 5 :
                            gameIntervalDelay > 120 ? gameIntervalDelay - 3 :
                            gameIntervalDelay > 90 ? gameIntervalDelay - 2 :
                            gameIntervalDelay > 60 ? gameIntervalDelay - 1 : gameIntervalDelay - 0.5

}

function checkCollision(){
    const head = snake[0]
    for(let i = 1; i < snake.length; i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            gameOver()
            snake[0]
        }
    }
}

function gameOver(){
    clearInterval(gameInterval)
    GameOverText.style.display = 'flex'
    highScore = highScore > currentScore ? highScore : currentScore
    localStorage.setItem('highScore', highScore)
    highScoreText.textContent = highScore.toString().padStart(3, '0')
}