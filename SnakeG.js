const board = document.querySelector(".lower-row"); 
const boardHeight = 30; 
const boardWidth = 30;
const Highscore = document.querySelector(".High"); 
const displayScore = document.querySelector(".Score");
const timeDisplay = document.querySelector(".Time");

let rows;
let cols;
let food;
let score=0;
let highscore = Number(localStorage.getItem("Highscore")) || 0;
Highscore.textContent = `High-score: ${highscore}`;
let timeInterval;
let time = "00-00";

const blocks = []; 
const snake = [{
    x: 1, y: 3
}];

let direction = "down";
let intervalId = 0;

function generateFood() {
    food = {
        x: Math.floor(Math.random() * rows),
        y: Math.floor(Math.random() * cols)
    };
}
 
function createBoard() {
    board.innerHTML = "";

    blocks.length = 0;

    rows = Math.floor(board.clientHeight / boardHeight);
    cols = Math.floor(board.clientWidth / boardWidth);

    for (let i = 0; i < rows * cols; i++) {
        const line = document.createElement("div");
        line.classList.add("line");
        board.appendChild(line);
    }

    const lines = document.querySelectorAll(".line");

    let index = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const line = lines[index];
            blocks[`${row}-${col}`] = line;

            index++;
        }
    }
    generateFood();
    render();
}
 
createBoard(); 
 
window.addEventListener("resize", createBoard);

function render(){
    snake.forEach(segment =>{
        blocks[`${segment.x}-${segment.y}`].classList.add("fill");
    })
}

    timeInterval = setInterval(() => {
        let [min , sec] = time.split("-").map(Number);
        if(sec==59){
            min += 1;
            sec = 0;
        }
        else{
            sec++;
        }
        time = `${min}-${sec}`;
        timeDisplay.textContent = `time:${time}`;
    } , 1000);

intervalId = setInterval(() => {

    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add("food"); 

    if (direction === "left") {
        head = { x: snake[0].x, y: snake[0].y - 1 };
    }

    if (direction === "right") {
        head = { x: snake[0].x, y: snake[0].y + 1 };
    }

    if (direction === "down") {
        head = { x: snake[0].x + 1, y: snake[0].y };
    }

    if (direction === "up") {
        head = { x: snake[0].x - 1, y: snake[0].y };
    }


    if (
        head.x < 0 ||
        head.x >= rows ||
        head.y < 0 ||
        head.y >= cols
    ) {
        alert("Game over");
        clearInterval(intervalId);
        clearInterval(timeDisplay);
        return;
    }

    snake.forEach(segment =>{
        blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
    })

    snake.unshift(head);

    if (head.x == food.x && head.y == food.y) {
        blocks[`${food.x}-${food.y}`].classList.remove("food");
        generateFood();

        score++;
        displayScore.textContent = `Score: ${score}`;

        if (score > highscore) {
            highscore = score;

            localStorage.setItem("Highscore", highscore);

            Highscore.textContent = `High-score: ${highscore}`;
        }
    } else {
        snake.pop();
    }

    render();
}, 200);


window.addEventListener("keydown" , (event) => {
    if(event.key === "ArrowUp"){
        direction = "up";
    }
    if(event.key === "ArrowDown"){
        direction = "down";
    }
    if(event.key === "ArrowRight"){
        direction = "right";
    }
    if(event.key === "ArrowLeft"){
        direction = "left";
    }
})