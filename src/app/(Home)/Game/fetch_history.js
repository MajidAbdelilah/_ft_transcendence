async function fetchHistory() {
    const username = document.getElementById('username').value;
    const response = await fetch(`http://127.0.0.1:8000/api/fetch_history/${username}/`);
    const data = await response.json();
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = '';

    if (data.length === 0) {
        historyDiv.innerHTML = '<p>No match history found for this username.</p>';
    } else {
        const list = document.createElement('ul');
        data.forEach(match => {
            const listItem = document.createElement('li');
            listItem.textContent = `Date: ${match.date_time}, Match ID: ${match.id}, Player 1: ${match.player1}, Player 1 Score: ${match.player1_score}, Player 2: ${match.player2}, Player 2 Score: ${match.player2_score}, Winner: ${match.winner}`;
            list.appendChild(listItem);
        });
        historyDiv.appendChild(list);
    }
}