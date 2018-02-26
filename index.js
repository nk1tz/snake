const myCanvas = document.getElementById('canvas')
const w = 700
const h = 500
myCanvas.setAttribute('width', w)
myCanvas.setAttribute('height', h)

const ctx = myCanvas.getContext('2d')
const startBtn = document.getElementById('btn')

const snakeSize = 20
const foodSize = snakeSize

let score = 0
let snake
let food
let direction
let nextDirection
let lastDirection
let directionChosen = false
let gameloop

startBtn.addEventListener("click", () => init())
document.onkeydown = handleKeyDown

function handleKeyDown(event) {
  const dirs = {
    37: 'left',
    39: 'right',
    38: 'up',
    40: 'down',
  }
  const opposites = {
    left: 'right',
    right: 'left',
    up: 'down',
    down: 'up',
  }
  let keyCode = event.keyCode;
  if (!directionChosen) {
    direction = dirs[keyCode] !== opposites[direction] ? dirs[keyCode] : direction
    directionChosen = true
  } else {
    nextDirection = dirs[keyCode] !== opposites[direction] ? dirs[keyCode] : direction
  }
}

function snakePiece(x, y) {
  // This is the single square
  ctx.fillStyle = 'darkgreen'
  ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize)
  // This is the border of the square
  ctx.strokeStyle = 'green'
  ctx.strokeRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize)
}

function foodPiece(x, y) {
  // This is the border of the pizza
  ctx.fillStyle = 'red'
  ctx.fillRect(x*snakeSize, y*snakeSize, snakeSize, snakeSize)
  // This is the single square
  ctx.fillStyle = 'yellow'
  ctx.fillRect(x*snakeSize+1, y*snakeSize+1, snakeSize-2, snakeSize-2)
}

function scoreText() {
  const score_text = "Score: " + score
  ctx.fillStyle = 'blue'
  ctx.fillText(score_text, 145, h-5)
}

function drawSnake() {
  // Initially the body of the snake will be formed by 5 squares.
  const length = 4
  snake = []

  // Using a for loop we push the 5 elements inside the array(squares).
  // Every element will have x = 0 and the y will take the value of the index.
  for (let i = length; i>=0; i--) {
      snake.push({x:i, y:0})
  }
}

function createFood() {
  food = {
    //Generate random numbers.
    x: Math.floor((Math.random() * w/foodSize) + 1),
    y: Math.floor((Math.random() * h/foodSize) + 1)
  }

  //Look at the position of the snake's body.
  for (let i=0; i<snake.length; i++) {
    let snakeX = snake[i].x
    let snakeY = snake[i].y

    if (food.x===snakeX || food.y === snakeY || food.y === snakeY && food.x===snakeX) {
      food.x = Math.floor((Math.random() * w/foodSize) + 1)
      food.y = Math.floor((Math.random() * h/foodSize) + 1)
    }
  }
}

function checkCollision(x, y, array) {
  for (let i = 0; i < array.length; i++) {
      if (array[i].x === x && array[i].y === y)
      return true
  }
  return false
}

function paint() {
  if (direction === lastDirection && !!nextDirection) {
    direction = nextDirection
    nextDirection = undefined
  }

  //play area
  ctx.fillStyle = 'lightgrey'
  ctx.fillRect(0, 0, w, h)

  // play area border
  ctx.strokeStyle = 'black'
  ctx.strokeRect(0, 0, w, h)

  startBtn.setAttribute('disabled', true)

  let snakeX = snake[0].x
  let snakeY = snake[0].y

  /*
  Make the snake move.
  Use a variable ('direction') to control the movement.
  To move the snake, pop out the last element of the array and shift it on the top as first element.
  */
  if (direction == 'right') {
    snakeX++
  } else if (direction == 'left') {
    snakeX--
  } else if (direction == 'up') {
    snakeY--
  } else if (direction == 'down') {
    snakeY++
  }

  /*
  If the snake touches the canvas path or itself, it will die!
  Therefore if x or y of an element of the snake, don't fit inside the canvas, the game will be stopped.
  If the check_collision is true, it means the the snake has crashed on its body itself, then the game will be stopped again.
  */
  if (snakeX == -1 || snakeX == w / snakeSize || snakeY == -1 || snakeY == h / snakeSize || checkCollision(snakeX, snakeY, snake)) {
    //Stop the game.

    // Make the start button enabled again.
    startBtn.removeAttribute('disabled', true);

    //Clean up the canvas.
    ctx.clearRect(0, 0, w, h);
    gameloop = clearInterval(gameloop);
    return;
  }

  let tail

  //If the snake eats food it becomes longer and this means that, in this case, you shouldn't pop out the last element of the array.
  if (snakeX == food.x && snakeY == food.y) {
    //Create a new square instead of moving the tail.
    tail = {
        x: snakeX,
        y: snakeY
    };
    score++
    //Create new food.
    createFood()
  } else {
    //Pop out the last cell.
    tail = snake.pop()
    tail.x = snakeX
    tail.y = snakeY
  }

  //Puts the tail as the first cell.
  snake.unshift(tail)

  //For each element of the array create a square using the bodySnake function we created before.
  for (var i = 0; i < snake.length; i++) {
      snakePiece(snake[i].x, snake[i].y)
  }

  // Create food using the _pizza_ function.
  foodPiece(food.x, food.y)

  //Put the score text.
  scoreText()

  lastDirection = direction
  directionChosen = false
}

function init() {
  direction = 'down';
  drawSnake();
  createFood();
  gameloop = setInterval(paint, 100);
}
