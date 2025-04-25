const instructionsBtn = document.getElementById('instructions-btn')
const instructionsText = document.getElementById('instructions-text')
const instructionsBtnText = instructionsBtn.querySelector('.instructions-btn-text');
const instructionsBtnArrow = instructionsBtn.querySelector('.instructions-btn-arrow');
const boardContainer = document.getElementById('board-container')
const board = document.getElementById('board') //là où le jeu se déroule
//la div board-visual-grid en position absolute permet d'avoir un visuel du grid sans
//devoir créer de cellule dans la div board elle-même. Les seules cellules créées 
//dans Board seront le serpent et la nourriture.
const boardVisualGrid = document.getElementById('board-visual-grid')
const presentationScreen = document.getElementById('presentation-screen');

//Variables
const gridSize = 20
let currentScore = 0
let highScore = 0
const snake = [{x: 10, y: 10}]
let foodPosition = {}
let direction = 'right'


//Affichage des instructions de jeu
instructionsBtn.addEventListener('click', () => {
    if (getComputedStyle(instructionsText).display === 'none') {
        instructionsText.style.display = 'block';
        instructionsBtn.classList.add('open');
        instructionsBtnText.textContent = 'Cacher les instructions';
    } else {
        instructionsText.style.display = 'none';
        instructionsBtn.classList.remove('open');
        instructionsBtnText.textContent = 'Voir les instructions';
    }
});

//Creation des cellules du boardVisualGrid afin de créer un visuel du grid 
for(let row = 0; row < gridSize; row++){
    for (let col = 0; col < gridSize; col++) {
        const cell = document.createElement('div')
        cell.classList = 'cell'
        boardVisualGrid.appendChild(cell)    
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
    boardVisualGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`
    boardVisualGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`    
}

resizeBoardContainer() // définition initiale du plateau de jeu

//eventlistener au cas où l'utilisateur ajuste la taille de la fenêtre
window.addEventListener('resize', resizeBoardContainer)

function startGame(){
    currentScore = 0
    presentationScreen.style.display = 'none'
    draw()

}

startGame()

function draw(){
    drawSnake()
    drawFood()
}

function drawSnake(){
    snake.forEach((segment, index) => {
        let htmlElement = null        
        if(index === 0){
            switch (direction) {
                case 'down':
                    htmlElement = createElement('div', 'snake-head-down')
                    break;
                case 'up':
                    htmlElement = createElement('div', 'snake-head-up')
                    break;
                case 'right':
                    htmlElement = createElement('div', 'snake-head-right')
                    break;
                case 'left':
                    htmlElement = createElement('div', 'snake-head-down')
                    break; 
            }
        }else{
            htmlElement = createElement('div', 'snake-body')
        }

        setGridPosition(htmlElement, segment)
        board.appendChild(htmlElement)
    })
}

function createElement(elementType, className){
    const htmlElement = document.createElement(elementType)
    htmlElement.classList.add(className)
    return htmlElement
}

function setGridPosition(element, gridPosition){
    element.style.gridColumn = gridPosition.x
    element.style.gridRow = gridPosition.y
}

function drawFood(){
    do {
        generateFoodPosition()
        console.log(`generate food in de while loop: x:${foodPosition.x}, y:${foodPosition.y}`);
    } while (snake.includes(foodPosition));
    
    const foodElement = createElement('div', 'food')
    setGridPosition(foodElement, foodPosition)
    board.appendChild(foodElement)
}

function generateFoodPosition(){
    foodPosition.x = Math.floor(Math.random() * gridSize) + 1
    foodPosition.y = Math.floor(Math.random() * gridSize) + 1
}