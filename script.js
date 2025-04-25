const boardContainer = document.getElementById('board-container')
const board = document.getElementById('board')
//la div board-visual-grid en position absolute permet d'avoir un visuel du grid sans devoir créer de cellule dans la div board elle-même. Les seules cellules créées dans Board seront le serpent et la nourriture.
const boardVisualGrid = document.getElementById('board-visual-grid')
const instructionsBtn = document.getElementById('instructions-btn')
const instructionsText = document.getElementById('instructions-text')
const instructionsBtnText = instructionsBtn.querySelector('.instructions-btn-text');
const instructionsBtnArrow = instructionsBtn.querySelector('.instructions-btn-arrow');

//Variables
const gridSize = 20


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

//Définition de la dimension du plateau de jeu
function resizeBoardContainer(){
    const windowMinDimension = Math.min(window.innerWidth, window.innerHeight) - 150
    boardContainer.style.width = `${windowMinDimension}px`
    boardContainer.style.height = `${windowMinDimension}px`

    //Définition des dimension du grid
    board.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`
    board.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`
    boardVisualGrid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`
    boardVisualGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`
}

resizeBoardContainer() // définition initiale du plateau de jeu

//event listener au cas où l'utilisateur ajuste la taille de la fenêtre
window.addEventListener('resize', resizeBoardContainer)

//Creation des cellules du boardVisualGrid afin de créer un visuel du grid 
for(let row = 0; row < gridSize; row++){
    for (let col = 0; col < gridSize; col++) {
        const cell = document.createElement('div')
        cell.classList = 'cell'
        boardVisualGrid.appendChild(cell)    
    }
}
