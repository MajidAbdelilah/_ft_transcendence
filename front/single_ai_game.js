function render(ctx, player1_pos, p1_rect, player2_pos, p2_rect, ball_pos, ball_radius, player1_score, player2_score) {
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

function AI_Bot_1337_21()
{
    if (ball_pos.y < player2_pos.y + players_dim.height / 2) {
        player2_pos.y -= 4.5;
    }
    if (ball_pos.y > player2_pos.y + players_dim.height / 2) {
        player2_pos.y += 4.5;
    }
}

function game() {
    if (game_started) {
        collision(ball_pos, ball_radius, player1_pos, players_dim, player2_pos, ball_speed);
        // get arrow input
        // if (keyState["ArrowUp"]) {
        //     player2_pos.y -= 10;
        // }
        // if (keyState["ArrowDown"]) {
        //     player2_pos.y += 10;
        // }
        // get w, s input
        AI_Bot_1337_21();
        if (keyState["w"]) {
            player1_pos.y -= 10;
        }
        if (keyState["s"]) {
            player1_pos.y += 10;
        }
        ball_pos.x += ball_speed.x * ball_direction.x;
        ball_pos.y += ball_speed.y * ball_direction.y;
        if (goal(ball_pos, ball_radius) === 1) {
            round_winner = 1;
            player1_score++;
            init();
        }
        if (goal(ball_pos, ball_radius) === 2) {
            round_winner = 2;
            player2_score++;
            init();
        }
        render(ctx, player1_pos, players_dim, player2_pos, players_dim, ball_pos, ball_radius, player1_score, player2_score);
    }
    window.requestAnimationFrame(game);
}

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
        sendMatchData(player1_score, player2_score, "Player1");
        player1_score = 0;
        player2_score = 0;
    }
    if (player2_score === 5) {
        alert("Player 2 wins the game!");
        sendMatchData(player1_score, player2_score, "Player2");
        player1_score = 0;
        player2_score = 0;
    }
    keyState = {};
}

function sendMatchData(player1_score, player2_score, winner) {
    const data = {
        player1: player1,
        player2: player2,
        player1_score: player1_score,
        player2_score: player2_score,
        winner: winner
    };
    console.log('Sending data:', data);
    fetch('http://127.0.0.1:8000/api/matches/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => console.log('Success:', data))
    .catch((error) => console.error('Error:', error));
}
const myCanvas = document.getElementById("gameCanvas");
const ctx = myCanvas.getContext("2d");

const canvas_dim = {width: 800, height: 600};
const players_dim = {width: 10, height: 100};
myCanvas.width = canvas_dim.width;
myCanvas.height = canvas_dim.height;

let player1_score = 0;
let player2_score = 0;
let player1_pos = {x: 0, y: canvas_dim.height / 2 - players_dim.height / 2};
let player2_pos = {x: canvas_dim.width - players_dim.width, y: canvas_dim.height / 2 - players_dim.height / 2};
let ball_pos = {x: canvas_dim.width / 2 - 5, y: canvas_dim.height / 2 - 5};
let ball_speed = {x: 5, y: 5};
const ball_radius = 5;
let ball_direction = {x: 1, y: 1};
let round_winner = 0;
let keyState = {};
let game_started = false;
let player1;
let player2;

document.addEventListener("keydown", function(event) {
    keyState[event.key] = true;
});

document.addEventListener("keyup", function(event) {
    keyState[event.key] = false;
});

game();

// if inputs with id player1 and player2  in the html code are not empty, and the button with id start is clicked, register the usernames and start the game
document.getElementById("start").addEventListener("click", function() {
    player1 = document.getElementById("player1").value;
    // player2 = document.getElementById("player2").value;
    player2 = "AI_Bot_1337_21";
    if (player1 !== "" && player2 !== "") {
        game_started = true;
        // set the div with id game_container to display block, and the div with id get_player_info to display none
        document.getElementById("game_container").style.display = "block";
        document.getElementById("get_player_info").style.display = "none";
    }
});