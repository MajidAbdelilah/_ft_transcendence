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
    sendAction(username, key);  // Replace 'player_username' with the actual username
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
        if (message[1][keys[i]].player1 === username || message[1][keys[i]].player2 === username) {
            document.getElementById("joined_players").style.display = "none";
            document.getElementById("game").style.display = "block";
            break;
        }
    }

}
username = ""; // global variable to store the username of the player
// when the user clicks the "start" button in the HTML code, call the joinTournament function with the input value as the argument and hide the get_player_info div and show the  joined_players div
document.getElementById("start").addEventListener("click", function() {
    username = document.getElementById("player1").value;
    joinTournament(username);
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