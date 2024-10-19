const myCanvas = document.getElementById("gameCanvas");
const ctx = myCanvas.getContext("2d");


function render(ctx, player1_pos, p1_rect, player2_pos, p2_rect, ball_pos, ball_radius, player1_score, player2_score)
{
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(player1_pos.x, player1_pos.y, p1_rect.width, p1_rect.height);
    ctx.fillRect(player2_pos.x, player2_pos.y, p2_rect.width, p2_rect.height);
    ctx.beginPath();
    ctx.arc(ball_pos.x, ball_pos.y, ball_radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
    ctx.font = "30px Arial";
    ctx.fillText(player1_score, myCanvas.width / 4, 50);
    ctx.fillText(player2_score, 3 * myCanvas.width / 4, 50);
    ctx.stroke();
}


const canvas_dim = {width: 800, height: 600};
const players_dim = {width: 10, height: 100};
myCanvas.width = canvas_dim.width;
myCanvas.height = canvas_dim.height;

player1_score = 0;
player2_score = 0;
 player1_pos = {x: 0, y: canvas_dim.height / 2 - players_dim.height / 2};
 player2_pos = {x: canvas_dim.width - players_dim.width, y: canvas_dim.height / 2 - players_dim.height / 2};
 ball_pos = {x: canvas_dim.width / 2 - 5, y: canvas_dim.height / 2 - 5};
 ball_speed = {x: 5, y: 5};
const ball_radius = 5;
ball_direction = {x: 1, y: 1};
round_winner = 0;
let keyState = {};

document.addEventListener("keydown", function(event) {
    keyState[event.key] = true;
});

document.addEventListener("keyup", function(event) {
    keyState[event.key] = false;
});

function collision(ball_pos, ball_radius, player1_pos, players_dim, player2_pos, ball_speed) {
    if (ball_pos.x - ball_radius <= player1_pos.x + players_dim.width &&
        ball_pos.y >= player1_pos.y &&
        ball_pos.y <= player1_pos.y + players_dim.height) {
        ball_direction.x = 1;
    }
    if (ball_pos.x + ball_radius >= player2_pos.x &&
        ball_pos.y >= player2_pos.y &&
        ball_pos.y <= player2_pos.y + players_dim.height) {
        ball_direction.x = -1;
    }
    if (ball_pos.y - ball_radius <= 0 || ball_pos.y + ball_radius >= canvas_dim.height) {
        ball_direction.y *= -1;
    }
    // player collision
    if (player1_pos.y < 0) {
        player1_pos.y = 0;
    }
    if (player1_pos.y + players_dim.height > canvas_dim.height) {
        player1_pos.y = canvas_dim.height - players_dim.height;
    }
    if (player2_pos.y < 0) {
        player2_pos.y = 0;
    }
    if (player2_pos.y + players_dim.height > canvas_dim.height) {
        player2_pos.y = canvas_dim.height - players_dim.height;
    }
}


function goal(ball_pos, ball_radius) {
    if (ball_pos.x - ball_radius <= 0) {
        return 2;
    }
    if (ball_pos.x + ball_radius >= canvas_dim.width) {
        return 1;
    }
    return 0;
}


function game() {
    collision(ball_pos, ball_radius, player1_pos, players_dim, player2_pos, ball_speed);
    // get arrow input
    if (keyState["ArrowUp"]) {
        player1_pos.y -= 10;
    }
    if (keyState["ArrowDown"]) {
        player1_pos.y += 10;
    }
    // get w, s input
    if (keyState["w"]) {
        player2_pos.y -= 10;
    }
    if (keyState["s"]) {
        player2_pos.y += 10;
    }
    ball_pos.x += ball_speed.x * ball_direction.x;
    ball_pos.y += ball_speed.y * ball_direction.y;
    if(goal(ball_pos, ball_radius) === 1) {
        round_winner = 1;
        player1_score++;
        init();
    }
    if(goal(ball_pos, ball_radius) === 2) {
        round_winner = 2;
        player2_score++;
        init();
    }
    render(ctx, player1_pos, players_dim, player2_pos, players_dim, ball_pos, ball_radius, player1_score, player2_score);
    window.requestAnimationFrame(game);
}

game();

function init() {
    myCanvas.width = canvas_dim.width;
    myCanvas.height = canvas_dim.height;
    //set ball direction depending on who won the last round
    if (round_winner === 2) {
        ball_direction = {x: 1, y: 1};
    }
    else if (round_winner === 1) {
        ball_direction = {x: -1, y: -1};
    }

    player1_pos = {x: 0, y: canvas_dim.height / 2 - players_dim.height / 2};
    player2_pos = {x: canvas_dim.width - players_dim.width, y: canvas_dim.height / 2 - players_dim.height / 2};
    ball_pos = {x: canvas_dim.width / 2 - 5, y: canvas_dim.height / 2 - 5};
    ball_speed = {x: 5, y: 5};

    if (player1_score === 5) {
        alert("Player 1 wins the game!");
        player1_score = 0;
        player2_score = 0;
    }
    if (player2_score === 5) {
        alert("Player 2 wins the game!");
        player1_score = 0;
        player2_score = 0;
    }
    keyState = {};
}