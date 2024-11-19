const socket = new WebSocket('ws://' + "127.0.0.1:8001" + '/ws/tournament/');
console.log('ws://' + window.location.host + '/ws/tournament/');
socket.onmessage = function(e) {
    const data = JSON.parse(e.data);
    if (data.message) {
        // Update the game UI based on the received message
        updateGameUI(data.message);
       
    }
};

socket.onclose = function(e) {
    console.log('WebSocket closed');
};

// Function to send data to the backend
function sendData(data) {
    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(data));
        console.log('Data sent:', data);
    } else {
        console.error('WebSocket is not open. readyState:', socket.readyState);
    }
}

function joinTournament(username) {
    sendData({
        type: 'join',
        username: username
    });
}

function leaveTournament(username) {
    sendData({
        type: 'leave',
        username: username
    });
}

function sendAction(username, action) {
    sendData({
        type: 'action',
        username: username,
        action: action
    });
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    sendAction(player1, key);  // Replace 'player_username' with the actual username
});

function updateGameUI(message) {
    // Implement UI update logic here
    console.log(message);
    // update the the player list from the message it is in index 0
    updatePlayersList(message[0]);
    // LOOP THROUGH THE MESSAGE AT INDEX 1 AND CHECK EVERY OBJECT IF IT HAS THE PLAYER USERNAME IN ITS FILED PLAYER1 OR PLAYER2 AND IF IT HAS IT START THE GAME AND DISPLAY THE GAME DIV
    if(message[1] == undefined){
        return;
    } 
    keys = Object.keys(message[1]);
    console.log("MASSAGE", message[1]);
    console.log("keys", keys);
    for (let i = 0; i < keys.length; i++) {
        console.log("player1", message[1][keys[i]].player1);
        console.log("started", message[1][keys[i]].started);
        console.log("player2", message[1][keys[i]].player2);
        if (message[1][keys[i]].player1 === player1 || message[1][keys[i]].player2 === player1) {
            if(message[1][keys[i]].started === true){
                if(message[1][keys[i]].player1 === player1)
                {
                    player2 = message[1][keys[i]].player2;
                }
                else if(message[1][keys[i]].player2 === player1)
                {
                    player2 = message[1][keys[i]].player1;
                }
                document.getElementById("joined_players").style.display = "none";
                document.getElementById("game_container").style.display = "block";
                match_started = true;
                if(game_started === false){
                     game();
                }
                game_started = true;
                break;
            }
        }
    }
    console.log("update game ui");
    // check if the game has started and if the match_started and if so handle inputes for player1 and get inputs for player two from the message at the objects at the index 0 in it filters keys with player2 username and get its action that is in the message at inxex 0
    if (game_started) {
        if (message[1] == undefined) {
            return;
        }
        keys = Object.keys(message[1]);
        for (let i = 0; i < keys.length; i++) {
            if (message[1][keys[i]].player2 === player1) {
                const action = message[0][message[1][keys[i]].player1].action;
                if (action === "ArrowUp") {
                    player2_pos.y -= 10;
                }
                if (action === "ArrowDown") {
                    player2_pos.y += 10;
                }
            }
            if(message[1][keys[i]].player1 === player1){
                const action = message[0][message[1][keys[i]].player2].action;
                if (action === "ArrowUp") {
                    player2_pos.y -= 10;
                }
                if (action === "ArrowDown") {
                    player2_pos.y += 10;
                }
            }
        }
    }

}

// when the user clicks the "start" button in the HTML code, call the joinTournament function with the input value as the argument and hide the get_player_info div and show the  joined_players div
document.getElementById("start").addEventListener("click", function() {
    player1 = document.getElementById("player1").value;
    joinTournament(player1);
    document.getElementById("get_player_info").style.display = "none";
    document.getElementById("joined_players").style.display = "block";
});

function updatePlayersList(players) {
    const playersList = document.getElementById("players");
    playersList.innerHTML = '';
    if(players == undefined){
        return;
    }
    console.log("this is it", players);

    const keys = Object.keys(players);
    console.log("keys", keys);
    // loop through keys and add then to the playersList
    for (let i = 0; i < keys.length; i++) {
        const player = players[keys[i]];
        const playerElement = document.createElement("li");

        playerElement.innerHTML = keys[i];
        playersList.appendChild(playerElement);
    }
}



// when the user clicks the "update" button in the HTML code, call the send_update_list function and update the player list
document.getElementById("update").addEventListener("click", function() {
    sendData({
        type: 'update_list',
        username: username
    });    
    console.log("update list");
});

// when the user clicks the "leave" button in the HTML code, call the leaveTournament function with the input value as the argument and hide the joined_players div and show the get_player_info div
document.getElementById("leave").addEventListener("click", function() {
    const username = document.getElementById("player1").value;
    leaveTournament(username);
    document.getElementById("joined_players").style.display = "none";
    document.getElementById("get_player_info").style.display = "block";
});


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


function game() {
    console.log("game");
    if (game_started) {
        collision(ball_pos, ball_radius, player1_pos, players_dim, player2_pos, ball_speed);
        // get w, s input
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
    console.log("init");
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
document.addEventListener("keydown", function(event) {
    keyState[event.key] = true;
});

document.addEventListener("keyup", function(event) {
    keyState[event.key] = false;
});

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
