const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i")
const gameOverModal = document.getElementById("gameOverModal");
const playAgainButton = document.getElementById("playAgainButton");
const changeDifficultyButton = document.getElementById("changeDifficultyButton");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId; 
let score = 0;

let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    const finalScoreElement = document.getElementById("finalScore");
    finalScoreElement.innerText = `Your Score: ${score}`;
    gameOverModal.style.display = "block"
}

let lastSpeed = 250;

playAgainButton.addEventListener("click", () => {
    gameOverModal.style.display = "none";
    startGame(lastSpeed);
});

const changeDirection = (e) => {
    if(e.key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    } else if(e.key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    } else if(e.key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    } else if(e.key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({ key: key.dataset.key }));
});

document.addEventListener('DOMContentLoaded', () => {
    const startModal = document.getElementById('startModal');
    startModal.style.display = "block";
    const difficultyButtons = document.querySelectorAll('.difficulty-button');
    difficultyButtons.forEach(button => {
        button.addEventListener('click', function() {
           lastSpeed = parseInt(this.getAttribute("data-speed"));
           startGame(lastSpeed);
           startModal.style.display = "none";
        });
    });

    if (!localStorage.getItem("gameInitialized")) {
        startModal.style.display = "block";
    }
});

changeDifficultyButton.addEventListener("click", () => {
    gameOverModal.style.display = "none";
    const startModal = document.getElementById("startModal");
    startModal.style.display = "block";
})

const startGame = (speed) => {
    clearInterval(setIntervalId);
    gameOver = false;
    snakeBody = [];
    snakeX = 5; snakeY = 10;
    velocityX = 0; velocityY = 0;
    score = 0;
    scoreElement.innerText = `Score: ${score}`;
    highScore = localStorage.getItem("high-score") || 0;
    highScoreElement.innerText = `High Score: ${highScore}`;
    changeFoodPosition();
    setIntervalId = setInterval(initGame, speed);
}

const initGame = () => {
    if(gameOver) return handleGameOver();
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]);
        score++

        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY];

    snakeX += velocityX;
    snakeY += velocityY;

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30){
        gameOver = true;
    }

    for (let i = 0; i < snakeBody.length; i++) {    
        htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
           gameOver = true; 
        }
    }
    playBoard.innerHTML = htmlMarkup;
}
changeFoodPosition();
document.addEventListener("keydown", changeDirection);