import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './PingPongGame.module.css';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

const PingPongGame = ({ roomName, player1, player2, player3, player4, map, isTournament }) => {
    const router = useRouter();
    const [socket, setSocket] = useState(null);
    const playerRoleRef = useRef(null);  // Will store 'player1', 'player2', etc.
    const player2StateRef = useRef('');  // Will store 'player1', 'player2', etc.
    const [gameStarted, setGameStarted] = useState(true);
    const [match, setMatch] = useState('');
    const [myUsername, setMyUsername] = useState('');
    const [direction, setDirection] = useState(null);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [gameData, setGameData] = useState({ players: { player1: { score: 0 }, player2: { score: 0 } } });
    const canvasRef = useRef(null);
    const wsRef = useRef(null);
    const cleanupRef = useRef(false);
    const i_lost = useRef(false);

    // Effect to determine player role based on username
    useEffect(() => {
        if (isTournament) {
            setMyUsername(player1);  // Set my username from props for tournament
        } else {
            setMyUsername(player1);  // Normal game remains unchanged
        }
    }, [player1, isTournament]);

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
                playerRole: playerRoleRef.current,
                isTournament
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
                    playerRole: playerRoleRef.current,
                    username: myUsername,
                    gameStarted: gameStarted
                });

                ws.send(JSON.stringify({
                    'player': playerRoleRef.current,
                    'direction': direction,
                    'username': myUsername,
                    'gameStarted': gameStarted
                }));
            };

            ws.onmessage = (e) => {
                if (isRedirecting) return;
                
                const data = JSON.parse(e.data);
                if(i_lost.current === true) {
                    updateWaitingScreen();
                    return;
                }
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
        // return () => {
        //     console.log('Cleaning up game WebSocket connection');
        //     cleanupRef.current = true;  
        //     if (wsRef.current) {
        //         wsRef.current.close();
        //         wsRef.current = null;
        //     }
        // };
    }, [roomName, myUsername, isTournament, isRedirecting]);

    const handleTournamentData = (data) => {
        let currentMatch = '';
        console.log('Tournament data received:', {
            myUsername,
            players: data.players,
            currentPlayerRole: playerRoleRef.current,
            isTournament
        });

        console.log('Checking username matches:', {
            myUsername,
            player1Username: data.players.player1.username,
            player2Username: data.players.player2.username,
            player3Username: data.players.player3?.username,
            player4Username: data.players.player4?.username
        });

        // Find which player we are based on username
        console.log('Starting player search for username:', myUsername);
        let foundMatch = false;
        for (const [role, player] of Object.entries(data.players)) {
            console.log(`Checking role ${role}:`, {
                playerUsername: player.username,
                matches: player.username === myUsername
            });
            if (player.username === myUsername) {
                foundMatch = true;
                playerRoleRef.current = role;
                currentMatch = player.current_match;
                console.log('Found match!', {
                    role,
                    currentMatch,
                    player
                });

                // Set opponent based on match
                if (currentMatch === 'match1') {
                    player2StateRef.current = role === 'player1' ? 'player2' : 'player1';
                    console.log('Match1: Set opponent to', player2StateRef.current);
                } else if (currentMatch === 'match2') {
                    player2StateRef.current = role === 'player3' ? 'player4' : 'player3';
                    console.log('Match2: Set opponent to', player2StateRef.current);
                } else if (currentMatch === 'final') {
                    console.log('Final match state:', {
                        match1Winner: data.matches.match1.winner,
                        match2Winner: data.matches.match2.winner,
                        player3Username: data.players.player3.username,
                        player4Username: data.players.player4.username
                    });
                    // In final, opponent is determined by previous match winners
                    if (data.matches.match1.winner === myUsername) {
                        player2StateRef.current = data.matches.match2.winner === data.players.player3.username ? 'player3' : 'player4';
                    } else {
                        player2StateRef.current = data.matches.match1.winner === data.players.player1.username ? 'player1' : 'player2';
                    }
                    console.log('Final: Set opponent to', player2StateRef.current);
                } else {
                    console.log('Warning: Unknown match type:', currentMatch);
                }
                break;
            }
        }

        if (!foundMatch) {
            console.error('No matching username found in players!', {
                myUsername,
                availablePlayers: data.players
            });
        }

        setMatch(currentMatch);

        console.log('Final state:', {
            playerRole: playerRoleRef.current,
            opponent: player2StateRef.current,
            currentMatch
        });

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
                    // handleGameEnd();
                    i_lost.current = false;

                } else if (data.matches[currentMatch]['winner'] && data.matches[currentMatch]['winner'] !== myUsername) {
                    console.log('You lost!');
                    i_lost.current = true;
                    // handleGameEnd();
                }
                return;
            }
        }
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
        ctx.fill();
    };

    const updateGame = (data) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        setGameData(data);  // Update game data state

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
        } else if(data.players && !data.players.player4){
            drawNormalGame(ctx, canvas, data);
        }
    };

    const drawNormalGame = (ctx, canvas, data) => {
        // Draw background based on map choice
        if (map === 'Blue Map') {
            ctx.fillStyle = '#242F5C';  // Dark blue background
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'white';  // White center line
            ctx.fillStyle = 'white';    // White elements
        } else {
            ctx.fillStyle = '#E1E1FF';  // Light purple background
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#242F5C';  // Dark blue center line
            ctx.fillStyle = '#242F5C';    // Dark blue elements
        }
        
        // Draw center line
        ctx.setLineDash([10, 10]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw paddles (using current fillStyle)
        // Player 1 paddle
        ctx.fillRect(data.players.player1.x, data.players.player1.y, 
                    data.players.player1.width, data.players.player1.height);
        // Player 2 paddle
        ctx.fillRect(data.players.player2.x, data.players.player2.y,
                    data.players.player2.width, data.players.player2.height);

        // Draw ball with shadow
        ctx.shadowColor = map === 'Blue Map' ? 
            'rgba(255, 255, 255, 0.3)' : 
            'rgba(36, 47, 92, 0.3)';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(data.ball.x, data.ball.y, data.ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    };

    const drawTournamentGame = (ctx, canvas, data) => {
        // Draw background based on map choice
        if (map === 'Blue Map') {
            ctx.fillStyle = '#242F5C';  // Dark blue background
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'white';  // White center line
            ctx.fillStyle = 'white';    // White elements
        } else {
            ctx.fillStyle = '#E1E1FF';  // Light purple background
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#242F5C';  // Dark blue center line
            ctx.fillStyle = '#242F5C';    // Dark blue elements
        }

        // Draw center line
        ctx.setLineDash([10, 10]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, 0);
        ctx.lineTo(canvas.width / 2, canvas.height);
        ctx.stroke();
        ctx.setLineDash([]);

        if (playerRoleRef.current) {
            // Draw player paddle
            const player = data.players[playerRoleRef.current];
            ctx.fillRect(player.x, player.y, player.width, player.height);

            // Draw player score and username
            ctx.font = '100px Arial';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillText(
                player.score,
                (player.x < (canvas.width / 2)) ? player.x + 50 : player.x - 125,
                canvas.height / 2 + 50
            );
            
            // Display username
            ctx.font = '30px Arial';
            ctx.fillText(
                player.username,
                (player.x < (canvas.width / 2)) ? player.x + 50 : player.x - 125,
                50
            );
        }

        if (player2StateRef.current) {
            // Draw opponent paddle
            const opponent = data.players[player2StateRef.current];
            ctx.fillRect(opponent.x, opponent.y, opponent.width, opponent.height);

            // Draw opponent score and username
            ctx.font = '100px Arial';
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.fillText(
                opponent.score,
                (opponent.x < (canvas.width / 2)) ? opponent.x + 50 : opponent.x - 125,
                canvas.height / 2 + 50
            );

            // Display username
            ctx.font = '30px Arial';
            ctx.fillText(
                opponent.username,
                (opponent.x < (canvas.width / 2)) ? opponent.x + 50 : opponent.x - 125,
                50
            );
        }

        // Draw ball with shadow
        let ball = null;
        if (match === 'match1') {
            ball = data.matches['ball1'];
        } else if (match === 'match2') {
            ball = data.matches['ball2'];
        } else if (match === 'final') {
            ball = data.matches['ball_final'];
        }

        if (ball) {
            ctx.shadowColor = map === 'Blue Map' ? 
                'rgba(255, 255, 255, 0.3)' : 
                'rgba(36, 47, 92, 0.3)';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    };

    const init = () => {
        setGameStarted(true);
        playerRoleRef.current = '';
        player2StateRef.current = '';
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
                console.log("playerRef", playerRoleRef.current);
                socket.send(JSON.stringify({
                    'player': playerRoleRef.current,
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
                    'player': playerRoleRef.current,
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
    }, [socket, direction, myUsername, gameStarted]);

    return (
        <div className={`${styles.gameContainer} ${montserrat.className}`}>
            <canvas ref={canvasRef} className={styles.canvas} />
            {gameStarted && (
                <div className={styles.scoreDisplay}>
                    <div className={styles.playerInfo}>
                        <div className={styles.playerAvatar}>
                            <img 
                                src={`http://127.0.0.1:8000/api${gameData?.players?.player1?.image || '/images/DefaultAvatar.svg'}`}
                                alt={player1}
                                width={50}
                                height={50}
                            />
                        </div>
                        <span className={styles.playerName}>{player1 || 'Player 1'}</span>
                    </div>
                    <div className={styles.scoreContainer}>
                        <span className={styles.score}>{gameData?.players?.player1?.score || 0}</span>
                        <span className={styles.scoreSeparator}>|</span>
                        <span className={styles.score}>{gameData?.players?.player2?.score || 0}</span>
                    </div>
                    <div className={styles.playerInfo}>
                        <span className={styles.playerName}>{player2 || 'Player 2'}</span>
                        <div className={styles.playerAvatar}>
                            <img 
                                src={`http://127.0.0.1:8000/api${gameData?.players?.player2?.image || '/images/DefaultAvatar.svg'}`}
                                alt={player2}
                                width={50}
                                height={50}
                            />
                        </div>
                    </div>
                </div>
            )}
            {!gameStarted && (
                <div className={styles.gameMessage}>
                    Press Space to Start
                </div>
            )}
        </div>
    );
};

export default PingPongGame;