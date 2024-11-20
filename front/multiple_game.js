function render(ctx, player1_pos, p1_rect, player2_pos, p2_rect, player3_pos, p3_rect, player4_pos, p4_rect, ball_pos, ball_radius, team1_score, team2_score){
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(player1_pos.x, player1_pos.y, p1_rect.width, p1_rect.height);
    ctx.fillRect(player2_pos.x, player2_pos.y, p2_rect.width, p2_rect.height);
    ctx.fillRect(player3_pos.x, player3_pos.y, p3_rect.width, p3_rect.height);
    ctx.fillRect(player4_pos.x, player4_pos.y, p4_rect.width, p4_rect.height);
    ctx.beginPath();
    ctx.arc(ball_pos.x, ball_pos.y, ball_radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
    ctx.font = "30px Arial";
    ctx.fillText(team1_score, myCanvas.width / 4, 50);
    ctx.fillText(team2_score, 3 * myCanvas.width / 4, 50);
    ctx.stroke();
}

function collision(ball_pos, ball_radius, player1_pos, players_dim, player2_pos, player3_pos, player4_pos, ball_speed) {
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
    if (ball_pos.x - ball_radius <= player3_pos.x + players_dim.width &&
        ball_pos.y >= player3_pos.y &&
        ball_pos.y <= player3_pos.y + players_dim.height) {
        ball_direction.x = 1;
    }
    if (ball_pos.x + ball_radius >= player4_pos.x &&
        ball_pos.y >= player4_pos.y &&
        ball_pos.y <= player4_pos.y + players_dim.height) {
        ball_direction.x = -1;
    }
    if (ball_pos.y - ball_radius <= 0 || ball_pos.y + ball_radius >= canvas_dim.height) {
        ball_direction.y *= -1;
    }
    // player collision
    if (player1_pos.y < 0) {
        player1_pos.y = 0;
    }
    if (player1_pos.y + players_dim.height > canvas_dim.height / 2) {
        player1_pos.y = canvas_dim.height / 2 - players_dim.height;
    }
    if (player2_pos.y < 0) {
        player2_pos.y = 0;
    }
    if (player2_pos.y + players_dim.height > canvas_dim.height / 2) {
        player2_pos.y = canvas_dim.height / 2 - players_dim.height;
    }
    if (player3_pos.y < canvas_dim.height / 2) {
        player3_pos.y = canvas_dim.height / 2;
    }
    if (player3_pos.y + players_dim.height > canvas_dim.height) {
        player3_pos.y = canvas_dim.height - players_dim.height;
    }
    if (player4_pos.y < canvas_dim.height / 2) {
        player4_pos.y = canvas_dim.height / 2;
    }
    if (player4_pos.y + players_dim.height > canvas_dim.height) {
        player4_pos.y = canvas_dim.height - players_dim.height;
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
    if (game_started) {
        collision(ball_pos, ball_radius, player1_pos, players_dim, player2_pos, player3_pos, player4_pos, ball_speed);
        // get arrow input
        if (keyState["ArrowUp"]) {
            player2_pos.y -= 10;
        }
        if (keyState["ArrowDown"]) {
            player2_pos.y += 10;
        }
        // get w, s input
        if (keyState["w"]) {
            player1_pos.y -= 10;
        }
        if (keyState["s"]) {
            player1_pos.y += 10;
        }
        // get i, k input
        if (keyState["i"]) {
            player3_pos.y -= 10;
        }
        if (keyState["k"]) {
            player3_pos.y += 10;
        }
        // get numpad 8, 5 input
        if (keyState["8"]) {
            player4_pos.y -= 10;
        }
        if (keyState["5"]) {
            player4_pos.y += 10;
        }
        ball_pos.x += ball_speed.x * ball_direction.x;
        ball_pos.y += ball_speed.y * ball_direction.y;
        const goalResult = goal(ball_pos, ball_radius);
        if (goalResult === 1) {
            round_winner = 1;
            team1_score++;
            init();
        }
        if (goalResult === 2) {
            round_winner = 2;
            team2_score++;
            init();
        }

        render(ctx, player1_pos, players_dim, player2_pos, players_dim, player3_pos, players_dim, player4_pos, players_dim, ball_pos, ball_radius, team1_score, team2_score);
    }
    window.requestAnimationFrame(game);
}

function init() {
    myCanvas.width = canvas_dim.width;
    myCanvas.height = canvas_dim.height;
    //set ball direction depending on who won the last round
    if (round_winner === 2 || round_winner === 4) {
        ball_direction = {x: 1, y: 1};
    }
    else if (round_winner === 1 || round_winner === 3) {
        ball_direction = {x: -1, y: -1};
    }

    player1_pos = {x: 0, y: canvas_dim.height / 4 - players_dim.height / 2};
    player2_pos = {x: canvas_dim.width - players_dim.width, y: canvas_dim.height / 4 - players_dim.height / 2};
    player3_pos = {x: 0, y: 3 * canvas_dim.height / 4 - players_dim.height / 2};
    player4_pos = {x: canvas_dim.width - players_dim.width, y: 3 * canvas_dim.height / 4 - players_dim.height / 2};
    ball_pos = {x: canvas_dim.width / 2 - 5, y: canvas_dim.height / 2 - 5};
    ball_speed = {x: 5, y: 5};

    if (team1_score === 5) {
        alert("Player 1 wins the game!");
        sendMatchData(team1_score, team2_score,   "team1");
        team1_score = 0;
        team2_score = 0;
    }
    if (team2_score === 5) {
        alert("Player 2 wins the game!");
        sendMatchData(team1_score, team2_score,   "team2");
        team1_score = 0;
        team2_score = 0;
    }
    keyState = {};
}

function sendMatchData(team1_score, team2_score,   winner) {
    const data = {
        player1: player1,
        player2: player2,
        player3: player3,
        player4: player4,
        team1_score: team1_score,
        team2_score: team2_score,
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
const players_dim = {width: 10, height: 90};
myCanvas.width = canvas_dim.width;
myCanvas.height = canvas_dim.height;

let team1_score = 0;
let team2_score = 0;
let player1_pos = {x: 0, y: canvas_dim.height / 4 - players_dim.height / 2};
let player2_pos = {x: canvas_dim.width - players_dim.width, y: canvas_dim.height / 4 - players_dim.height / 2};
let player3_pos = {x: 0, y: 3 * canvas_dim.height / 4 - players_dim.height / 2};
let player4_pos = {x: canvas_dim.width - players_dim.width, y: 3 * canvas_dim.height / 4 - players_dim.height / 2};
let ball_pos = {x: canvas_dim.width / 2 - 5, y: canvas_dim.height / 2 - 5};
let ball_speed = {x: 5, y: 5};
const ball_radius = 5;
let ball_direction = {x: 1, y: 1};
let round_winner = 0;
let keyState = {};
let game_started = false;
let player1;
let player2;
let player3;
let player4;

document.addEventListener("keydown", function(event) {
    keyState[event.key] = true;
});

document.addEventListener("keyup", function(event) {
    keyState[event.key] = false;
});

game();

// if inputs with id player1 and player2 in the html code are not empty, and the button with id start is clicked, register the usernames and start the game
document.getElementById("start").addEventListener("click", function() {
    player1 = document.getElementById("player1").value;
    player2 = document.getElementById("player2").value;
    player3 = document.getElementById("player3").value;
    player4 = document.getElementById("player4").value;
    
    if (player1 !== "" && player2 !== "" && player3 !== "" && player4 !== "") {
        game_started = true;
        // set the div with id game_container to display block, and the div with id get_player_info to display none
        document.getElementById("game_container").style.display = "block";
        document.getElementById("get_player_info").style.display = "none";
    }
});