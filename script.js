const rulesBtn = document.getElementById("rules-btn");
const rulesContainer = document.getElementById("rules");
const closeRulesContainer = document.getElementById("close-btn");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
let score = 0;
const brickRowCount = 9;
const brickColumnCount = 5;

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 10,
  speed: 4,
  dx: 4,
  dy: -4,
};

const paddle = {
  x: canvas.width / 2 - 40,
  y: canvas.height - 20,
  speed: 18,
  height: 10,
  width: 80,
  dx: 0,
};

const brickInfo = {
  w: 70,
  h: 20,
  padding: 10,
  offsetX: 45,
  offsetY: 60,
  visible: true,
};

const bricks = [];

for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

const drawBall = () => {
  ctx.fillStyle = "#0095dd";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
};
const drawPaddle = () => {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = "#0095dd";
  ctx.fill();
  ctx.closePath();
};

const drawBricks = () => {
  bricks.forEach((column) => {
    column.forEach((brick) => {
      ctx.beginPath();
      ctx.rect(brick.x, brick.y, brick.w, brick.h);
      ctx.fillStyle = brick.visible ? "#0095dd" : "transparent";
      ctx.fill();
      ctx.closePath();
    });
  });
};

const drawScore = () => {
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
};

const onKeyDown = (e) => {
  if (e.key === "ArrowRight" || e.key === "Right") {
    paddle.dx += paddle.speed;
  }
  if (e.key === "ArrowLeft" || e.key === "Left") {
    paddle.dx -= paddle.speed;
  }
};
const currPos = () => {
  paddle.x += paddle.dx;

  if (paddle.x < 0) {
    paddle.x = 0;
  }

  if (paddle.x + paddle.width > canvas.width) {
    paddle.x = canvas.width - paddle.width;
  }
};
const onKeyUp = (e) => {
  if (e.key === "ArrowRight" || e.key === "Right") {
    paddle.dx = 0;
  }
  if (e.key === "ArrowLeft" || e.key === "Left") {
    paddle.dx = 0;
  }
};

const draw = () => {
  drawBall();
  drawPaddle();
  drawScore();
  drawBricks();
};

const update = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  draw();
  ball.x += ball.dx;
  ball.y += ball.dy;

  currPos();
  //detect the collision
  if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
    ball.dx *= -1;
  }
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    ball.dy *= -1;
  }
  if (
    ball.x - ball.size > paddle.x &&
    ball.x + ball.size < paddle.x + paddle.width &&
    ball.y + ball.size > paddle.y
  ) {
    ball.dy = -ball.speed;
  }

  bricks.forEach((column) => {
    column.forEach((brick) => {
      if (brick.visible) {
        if (
          ball.x - ball.size > brick.x &&
          ball.x + ball.size < brick.x + brick.w &&
          ball.y + ball.size > brick.y &&
          ball.y - ball.size < brick.y + brick.h
        ) {
          ball.dy *= -1;
          brick.visible = false;
          increaseScore();
        }
      }
    });
  });

  if (ball.y + ball.size > canvas.height) {
    showAllBricks();
    score = 0;
  }

  requestAnimationFrame(update);
};
const showAllBricks = () => {
  bricks.forEach((column) => {
    column.forEach((brick) => (brick.visible = true));
  });
};
const increaseScore = () => {
  score++;

  if (score % (brickRowCount * brickRowCount) === 0) {
    showAllBricks();
  }
};

update();

rulesBtn.addEventListener("click", () => {
  rulesContainer.classList.add("show");
});

closeRulesContainer.addEventListener("click", () => {
  rulesContainer.classList.remove("show");
});

document.addEventListener("keydown", onKeyDown);
document.addEventListener("keyup", onKeyUp);
