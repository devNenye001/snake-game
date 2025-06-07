const homePage = document.getElementById("grid-box");
const loadingPage = document.getElementById("loading-section");
const gamePage = document.getElementById("gameBlock");
const resultPage = document.getElementById("gameOver");

const startBtn = document.getElementById("start");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

let result = document.getElementById("result");

const ctx = gamePage.getContext("2d"); 
const box = 40;

let snake = [];
let food = {};
let d; // direction
let game; // snake speed
let gameStarted = false; // start flag

// Start game from home page (with loading animation)
function start() {
    homePage.style.display = "none";
    loadingPage.style.display = "flex";
    loadingPage.style.justifyContent = 'center';
    result.textContent = "";

    setTimeout(() => result.textContent = "Arranging the blocks...", 1000);
    setTimeout(() => result.textContent = "Spawning the food...", 3000);
    setTimeout(() => result.textContent = "Warming eba...", 5000);
    setTimeout(() => result.textContent = "Feeding the snake...", 6000);
    setTimeout(() => result.textContent = "Avoiding walls in progress...", 7000);

    setTimeout(() => {
        loadingPage.style.display = "none";
        gamePage.style.display = "block";
        initGame();
    }, 10000);
}

// Initialize/reset the game variables
function initGame() {
    d = null;
    gameStarted = false;
    snake = [{ x: 9 * box, y: 10 * box }];

    const maxX = Math.floor(gamePage.width / box);
    const maxY = Math.floor(gamePage.height / box);
    food = {
       x: Math.floor(Math.random() * maxX) * box,
       y: Math.floor(Math.random() * maxY) * box
    };

    clearInterval(game);
    draw(); 
}

// Listen for key presses to start and change direction
document.addEventListener("keydown", function(event) {
    const key = event.key;

    // Start the game when any arrow key is pressed for the first time
    if (!gameStarted) {
        if (["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].includes(key)) {
            d = key.replace("Arrow", "").toUpperCase();
            gameStarted = true;
            game = setInterval(draw, 350);
        }
        return;
    }

    // Change direction during game
    if (key === "ArrowLeft" && d !== "RIGHT") d = "LEFT";
    else if (key === "ArrowUp" && d !== "DOWN") d = "UP";
    else if (key === "ArrowRight" && d !== "LEFT") d = "RIGHT";
    else if (key === "ArrowDown" && d !== "UP") d = "DOWN";
});

// Check collision with snake body
function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) return true;
    }
    return false;
}

// Draw everything
function draw() {
    // Clear entire canvas
    gamePage.width = window.innerWidth * 0.9;
    gamePage.height = window.innerHeight * 0.9;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, gamePage.width, gamePage.height);

    // Draw walls (border) as white rectangle inside canvas
    ctx.strokeStyle = "white";
    ctx.lineWidth = 15;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(0, 0, gamePage.width, gamePage.height);

    // Draw snake blocks
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "lime" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    // Draw food block
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // Current head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    // Move head by direction
    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    // Check if snake eats food
    if (snakeX === food.x && snakeY === food.y) {
        // Spawn new food at random position
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        };
        // Don’t remove tail to grow snake
    } else {
        // Remove tail (move snake)
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    // Check collision with walls (canvas edges) or snake itself
    if (
        snakeX < 0 || snakeX >= gamePage.width ||
        snakeY < 0 || snakeY >= gamePage.height ||
        collision(newHead, snake)
    ) {
        clearInterval(game);
        gamePage.style.display = "none";
        resultPage.style.display = "flex";
        resultPage.style.flexDirection = "colmun"; // Use flex to enable alignment
        resultPage.style.height = "100vh";
        resultPage.style.width = "100vw";
        resultPage.style.alignItems = "center";
        resultPage.style.justifyContent = "space-around";
        return;
    }

    // Add new head to snake
    snake.unshift(newHead);
}

window.addEventListener('resize', () => {
    gamePage.width = window.innerWidth * 0.9;
    gamePage.height = window.innerHeight * 0.9;
    draw(); // Redraw after resizing
});

// Replay buttons
yesBtn.addEventListener("click", () => {
    resultPage.style.display = "none";
    gamePage.style.display = "block";
    initGame();
});

noBtn.addEventListener("click", () => {
    window.alert("lol, you are not going anywhere, tap 'yes' 😅")
});
