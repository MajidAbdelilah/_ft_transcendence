import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

const PingPongGame = ({ roomName, player1, player2, player3, player4, map, isTournament }) => {
    const router = useRouter();
    const [socket, setSocket] = useState(null);
    const [playerRole, setPlayerRole] = useState(null);  // Will store 'player1', 'player2', etc.
    const [player2State, setPlayer2State] = useState('');
    const [gameStarted, setGameStarted] = useState(true);
    const [match, setMatch] = useState('');
    const [myUsername, setMyUsername] = useState('');
    const [direction, setDirection] = useState(null);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const canvasRef = useRef(null);
    const wsRef = useRef(null);
    const cleanupRef = useRef(false);

    // Effect to determine player role based on username
    useEffect(() => {
        setMyUsername(player1);  // This player's username is always player1 prop

        // Always set as player1 since this instance represents player1
        setPlayerRole(null);

        console.log('Player role determined:', {
            myUsername: player1,
            playerRole: 'player1',
            allPlayers: { player1, player2, player3, player4 }
        });
    }, [player1]);

    const handleGameEnd = () => {
        console.log('Game ended, cleaning up...');
        setIsRedirecting(true);
        setGameStarted(false);  
        cleanupRef.current = true;  
        
        // Close WebSocket if it's open
        if (wsRef.current) {
            try {
                wsRef.current.close(1000, 'Game ended');  
                console.log('WebSocket closed successfully');
            } catch (error) {
                console.error('Error closing WebSocket:', error);
            }
            wsRef.current = null;
            setSocket(null);  
        }
        
        // Redirect after a short delay
        setTimeout(() => {
            router.replace('/Dashboard');
        }, 500);
    };

    // Separate effect for WebSocket connection
    useEffect(() => {
        if (!roomName || !myUsername || isRedirecting || cleanupRef.current) {
            return;
        }

        const connectWebSocket = () => {
            if (wsRef.current?.readyState === WebSocket.OPEN) {
                console.log('WebSocket already connected');
                return;
            }

            const url = isTournament ? 
                `ws://127.0.0.1:8000/ws/tournament/${roomName}/${roomName}/` : 
                `ws://127.0.0.1:8000/ws/tournament/${roomName}/`;

            console.log('Initializing WebSocket with:', { 
                url, 
                username: myUsername,
                playerRole: playerRole
            });

            const ws = new WebSocket(url);
            wsRef.current = ws;
            setSocket(ws);

            ws.onopen = () => {
                if (isRedirecting) {
                    ws.close();
                    return;
                }

                console.log('WebSocket Connected. Sending initial data:', {
                    playerRole: playerRole,
                    username: myUsername,
                    gameStarted: gameStarted
                });

                ws.send(JSON.stringify({
                    'player': playerRole,
                    'direction': direction,
                    'username': myUsername,
                    'gameStarted': gameStarted
                }));
            };

            ws.onmessage = (e) => {
                if (isRedirecting) return;
                
                const data = JSON.parse(e.data);
                
                if(data.type === 'BRACKET_UPDATE') {
                    console.log('Received bracket update:', data);
                    return;
                }
                
                if (data.is_tournament) {
                    handleTournamentData(data);
                } else {
                    handleNormalGameData(data);
                }

                updateGame(data);
            };

            ws.onclose = (e) => {
                console.log('Game WebSocket closed:', e.reason);
                wsRef.current = null;
                setSocket(null);
                
                // Only attempt to reconnect if not cleaning up
                if (!isRedirecting && !cleanupRef.current && myUsername && gameStarted) {
                    setTimeout(connectWebSocket, 1000);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                if (!isRedirecting) {
                    handleGameEnd();
                }
            };
        };

        // Initial connection
        connectWebSocket();

        // Cleanup function
        return () => {
            console.log('Cleaning up game WebSocket connection');
            cleanupRef.current = true;  
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, [roomName, myUsername, playerRole, isTournament, isRedirecting]);

    const handleTournamentData = (data) => {
        let currentMatch = '';

        // Find the current player's match based on their username
        if (data.players.player1.username === myUsername) {
            currentMatch = data.players.player1.current_match;
        } else if (data.players.player2.username === myUsername) {
            currentMatch = data.players.player2.current_match;
        } else if (data.players.player3?.username === myUsername) {
            currentMatch = data.players.player3.current_match;
        } else if (data.players.player4?.username === myUsername) {
            currentMatch = data.players.player4.current_match;
        }

        setMatch(currentMatch);

        if (currentMatch) {
            if (!data.matches[currentMatch]['game_start']) {
                console.log('Waiting for other player to be ready...');
                updateWaitingScreen();
                return;
            }

            if (data.matches[currentMatch]['winner'] && gameStarted) {
                console.log('Match ended');
                if (data.matches[currentMatch]['winner'] === myUsername) {
                    console.log('You won!');
                } else {
                    console.log('You lost!');
                }
                handleGameEnd();
                return;
            }
        }

        // Find opponent in the same match
        let opponent = null;
        for (let p in data.players) {
            if (data.players[p].current_match === currentMatch && data.players[p].username !== myUsername) {
                opponent = p;
                break;
            }
        }
        setPlayer2State(opponent);
    };

    const handleNormalGameData = (data) => {
        if (data.start_game === false) {
            console.log('Game ended');
            handleGameEnd();
        }
    };

    const updateWaitingScreen = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = 800;
        canvas.height = 600;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '28px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText('Waiting for other player to be ready... press space to be ready', canvas.width / 2, canvas.height / 2);
    };

    const updateGame = (data) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = data.width;
        canvas.height = data.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameStarted) {
            ctx.font = '30px Arial';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillText('Press Space to Start', canvas.width / 2 - 150, canvas.height / 2 + 50);
            return;
        }

        if (data.is_tournament) {
            drawTournamentGame(ctx, canvas, data);
        } else {
            drawNormalGame(ctx, canvas, data);
        }
    };

    const drawTournamentGame = (ctx, canvas, data) => {
        if (playerRole) {
            ctx.font = '100px Arial';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillText(
                data.players[playerRole].score, 
                (data.players[playerRole].x < (canvas.width / 2)) ? data.players[playerRole].x + 50 : data.players[playerRole].x - 125,
                canvas.height / 2 + 50
            );
            ctx.fillRect(data.players[playerRole].x, data.players[playerRole].y, data.players[playerRole].width, data.players[playerRole].height);
            
            ctx.font = '30px Arial';
            ctx.fillText(
                data.players[playerRole].username,
                (data.players[playerRole].x < (canvas.width / 2)) ? data.players[playerRole].x + 50 : data.players[playerRole].x - 125,
                50
            );
        }

        if (player2State) {
            ctx.font = '100px Arial';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillText(
                data.players[player2State].score,
                (data.players[player2State].x < (canvas.width / 2)) ? data.players[player2State].x + 50 : data.players[player2State].x - 125,
                canvas.height / 2 + 50
            );
            ctx.fillRect(data.players[player2State].x, data.players[player2State].y, data.players[player2State].width, data.players[player2State].height);
            
            ctx.font = '30px Arial';
            ctx.fillText(
                data.players[player2State].username,
                (data.players[player2State].x < (canvas.width / 2)) ? data.players[player2State].x + 50 : data.players[player2State].x - 125,
                50
            );
        }

        let ball = null;
        if (match === 'match1') {
            ball = data.matches['ball1'];
        } else if (match === 'match2') {
            ball = data.matches['ball2'];
        } else if (match === 'final') {
            ball = data.matches['ball_final'];
        }

        if (ball) {
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    const drawNormalGame = (ctx, canvas, data) => {
        ctx.font = '100px Arial';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        
        // Draw scores
        if (playerRole === 'player1') {
            ctx.fillText(data.players.player1.score, canvas.width / 2 - 150, canvas.height / 2 + 50);
            ctx.fillText(data.players.player2.score, canvas.width / 2 + 50, canvas.height / 2 + 50);
            
            // Draw paddles
            ctx.fillRect(data.players.player1.x, data.players.player1.y, data.players.player1.width, data.players.player1.height);
            ctx.fillRect(data.players.player2.x, data.players.player2.y, data.players.player2.width, data.players.player2.height);
            
            // Draw usernames
            ctx.font = '30px Arial';
            ctx.fillText(data.players.player1.username, 50, 50);
            ctx.fillText(data.players.player2.username, canvas.width - 150, 50);
        } else {
            ctx.fillText(data.players.player2.score, canvas.width / 2 - 150, canvas.height / 2 + 50);
            ctx.fillText(data.players.player1.score, canvas.width / 2 + 50, canvas.height / 2 + 50);
            
            // Draw paddles
            ctx.fillRect(data.players.player2.x, data.players.player2.y, data.players.player2.width, data.players.player2.height);
            ctx.fillRect(data.players.player1.x, data.players.player1.y, data.players.player1.width, data.players.player1.height);
            
            // Draw usernames
            ctx.font = '30px Arial';
            ctx.fillText(data.players.player2.username, 50, 50);
            ctx.fillText(data.players.player1.username, canvas.width - 150, 50);
        }

        // Draw ball
        if (data.ball) {
            ctx.beginPath();
            ctx.arc(data.ball.x, data.ball.y, data.ball.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    };

    const init = () => {
        setGameStarted(true);
        setPlayerRole('');
        setPlayer2State('');
        setMatch('');
        setDirection(null);
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            let newDirection = null;
            if (!socket || socket.readyState !== WebSocket.OPEN) return;

            switch(event.key) {
                case 'ArrowUp':
                    newDirection = 'up';
                    break;
                case 'ArrowDown':
                    newDirection = 'down';
                    break;
                case ' ':
                    if (!gameStarted) {
                        setGameStarted(true);
                    }
                    break;
            }

            if (newDirection !== direction) {
                setDirection(newDirection);
                socket.send(JSON.stringify({
                    'player': playerRole,
                    'direction': newDirection,
                    'username': myUsername,
                    'gameStarted': gameStarted
                }));
            }
        };

        const handleKeyUp = (event) => {
            if (!socket || socket.readyState !== WebSocket.OPEN) return;

            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
                setDirection(null);
                socket.send(JSON.stringify({
                    'player': playerRole,
                    'direction': null,
                    'username': myUsername,
                    'gameStarted': gameStarted
                }));
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [socket, direction, playerRole, myUsername, gameStarted]);

    return (
        <div>
            <canvas ref={canvasRef} id="gameCanvas"></canvas>
        </div>
    );
};

export default PingPongGame;
