'use client'

import { useEffect, useRef, useState } from 'react';
import styles from './SingleAIGame.module.css';

const SingleAIGame = () => {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [player1Name, setPlayer1Name] = useState('');
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const requestRef = useRef();
  const keyStateRef = useRef({});

  // Game constants
  const CANVAS_DIM = { width: 1200, height: 800 };
  const PLAYERS_DIM = { width: 10, height: 100 };
  const BALL_RADIUS = 5;
  const PLAYER_SPEED = 10;
  const BALL_SPEED = { x: 5, y: 5 };

  // Game state refs to avoid recreating game loop
  const gameStateRef = useRef({
    player1Pos: { x: 0, y: CANVAS_DIM.height / 2 - PLAYERS_DIM.height / 2 },
    player2Pos: { x: CANVAS_DIM.width - PLAYERS_DIM.width, y: CANVAS_DIM.height / 2 - PLAYERS_DIM.height / 2 },
    ballPos: { x: CANVAS_DIM.width / 2 - 5, y: CANVAS_DIM.height / 2 - 5 },
    ballDirection: { x: 1, y: 1 },
    roundWinner: 0,
    botBallPos: { x: 0, y: 0 },
    botBallDirection: { x: 0, y: 0 },
    runAgain: true,
    randomBoolean: Math.random() < 0.5
  });

  const render = (ctx) => {
    const state = gameStateRef.current;
    ctx.clearRect(0, 0, CANVAS_DIM.width, CANVAS_DIM.height);
    ctx.fillStyle = "black";
    
    // Draw players
    ctx.fillRect(state.player1Pos.x, state.player1Pos.y, PLAYERS_DIM.width, PLAYERS_DIM.height);
    ctx.fillRect(state.player2Pos.x, state.player2Pos.y, PLAYERS_DIM.width, PLAYERS_DIM.height);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(state.ballPos.x, state.ballPos.y, BALL_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
    ctx.stroke();
    
    // Draw scores
    ctx.font = "30px Arial";
    ctx.fillText(player1Score, CANVAS_DIM.width / 4, 50);
    ctx.fillText(player2Score, 3 * CANVAS_DIM.width / 4, 50);
    ctx.stroke();
  };

  const collision = () => {
    const state = gameStateRef.current;
    
    // Ball collision with players
    if (state.ballPos.x - BALL_RADIUS <= state.player1Pos.x + PLAYERS_DIM.width &&
        state.ballPos.y >= state.player1Pos.y &&
        state.ballPos.y <= state.player1Pos.y + PLAYERS_DIM.height) {
      state.ballDirection.x = 1;
    }
    if (state.ballPos.x + BALL_RADIUS >= state.player2Pos.x &&
        state.ballPos.y >= state.player2Pos.y &&
        state.ballPos.y <= state.player2Pos.y + PLAYERS_DIM.height) {
      state.ballDirection.x = -1;
    }
    
    // Ball collision with top/bottom walls
    if (state.ballPos.y - BALL_RADIUS <= 0 || state.ballPos.y + BALL_RADIUS >= CANVAS_DIM.height) {
      state.ballDirection.y *= -1;
    }
    
    // Player collision with walls
    if (state.player1Pos.y < 0) state.player1Pos.y = 0;
    if (state.player1Pos.y + PLAYERS_DIM.height > CANVAS_DIM.height) {
      state.player1Pos.y = CANVAS_DIM.height - PLAYERS_DIM.height;
    }
    if (state.player2Pos.y < 0) state.player2Pos.y = 0;
    if (state.player2Pos.y + PLAYERS_DIM.height > CANVAS_DIM.height) {
      state.player2Pos.y = CANVAS_DIM.height - PLAYERS_DIM.height;
    }
  };

  const goal = () => {
    const state = gameStateRef.current;
    if (state.ballPos.x - BALL_RADIUS <= 0) return 2;
    if (state.ballPos.x + BALL_RADIUS >= CANVAS_DIM.width) return 1;
    return 0;
  };

  const AIBot133721 = () => {
    const state = gameStateRef.current;
    
    if (state.runAgain) {
      state.botBallDirection = { ...state.ballDirection };
      state.botBallPos = { ...state.ballPos };
      state.runAgain = false;
    }

    if (state.botBallDirection.x === 1) {
      if ((state.player2Pos.y + PLAYERS_DIM.height / 2) < (CANVAS_DIM.height / 2 - 15) && 
          (state.botBallPos.x < CANVAS_DIM.width / 2)) {
        state.player2Pos.y += PLAYER_SPEED;
        return;
      }
      if ((state.player2Pos.y + PLAYERS_DIM.height / 2) > (CANVAS_DIM.height / 2 + 15) && 
          (state.botBallPos.x < CANVAS_DIM.width / 2)) {
        state.player2Pos.y -= PLAYER_SPEED;
        return;
      }
      if (state.botBallPos.x > CANVAS_DIM.width / 2) {
        if (state.randomBoolean) {
          if (state.botBallPos.y < (state.player2Pos.y - 5)) {
            state.player2Pos.y -= PLAYER_SPEED;
          }
          if (state.botBallPos.y > (state.player2Pos.y + PLAYERS_DIM.height + 5)) {
            state.player2Pos.y += PLAYER_SPEED;
          }
          return;
        }
        if (state.botBallPos.y < (state.player2Pos.y + PLAYERS_DIM.height / 2)) {
          state.player2Pos.y -= PLAYER_SPEED;
        }
        if (state.botBallPos.y > (state.player2Pos.y + PLAYERS_DIM.height / 2)) {
          state.player2Pos.y += PLAYER_SPEED;
        }
      }
    }
  };

  const gameLoop = () => {
    if (!canvasRef.current || !gameStarted) return;
    
    const ctx = canvasRef.current.getContext('2d');
    const state = gameStateRef.current;

    AIBot133721();

    if (keyStateRef.current["w"]) {
      state.player1Pos.y -= PLAYER_SPEED;
    }
    if (keyStateRef.current["s"]) {
      state.player1Pos.y += PLAYER_SPEED;
    }

    state.ballPos.x += BALL_SPEED.x * state.ballDirection.x;
    state.ballPos.y += BALL_SPEED.y * state.ballDirection.y;

    const goalResult = goal();
    if (goalResult === 1) {
      state.roundWinner = 1;
      setPlayer1Score(prev => prev + 1);
      initGame();
    }
    if (goalResult === 2) {
      state.roundWinner = 2;
      setPlayer2Score(prev => prev + 1);
      initGame();
    }

    collision();
    render(ctx);
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const initGame = () => {
    const state = gameStateRef.current;
    
    if (canvasRef.current) {
      canvasRef.current.width = CANVAS_DIM.width;
      canvasRef.current.height = CANVAS_DIM.height;
    }

    state.ballDirection = state.roundWinner === 2 ? { x: 1, y: 1 } : { x: -1, y: -1 };
    state.randomBoolean = Math.random() < 0.5;
    state.player1Pos = { x: 0, y: CANVAS_DIM.height / 2 - PLAYERS_DIM.height / 2 };
    state.player2Pos = { x: CANVAS_DIM.width - PLAYERS_DIM.width, y: CANVAS_DIM.height / 2 - PLAYERS_DIM.height / 2 };
    state.ballPos = { x: CANVAS_DIM.width / 2 - 5, y: CANVAS_DIM.height / 2 - 5 };

    if (player1Score === 5) {
      alert("Player 1 wins the game!");
      sendMatchData(player1Score, player2Score, "Player1");
      setPlayer1Score(0);
      setPlayer2Score(0);
    }
    if (player2Score === 5) {
      alert("Player 2 wins the game!");
      sendMatchData(player1Score, player2Score, "Player2");
      setPlayer1Score(0);
      setPlayer2Score(0);
    }
  };

  const sendMatchData = (p1Score, p2Score, winner) => {
    // Implement your match data sending logic here
    console.log('Match data:', { player1: player1Name, p1Score, p2Score, winner });
  };

  const startGame = () => {
    if (!player1Name) {
      alert('Please enter player name');
      return;
    }
    setGameStarted(true);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      keyStateRef.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e) => {
      keyStateRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      gameStateRef.current.runAgain = true;
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (gameStarted) {
      initGame();
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameStarted]);

  return (
    <div className={styles.container}>
      {!gameStarted ? (
        <div className={styles.playerInfo}>
          <input
            type="text"
            placeholder="Player 1"
            value={player1Name}
            onChange={(e) => setPlayer1Name(e.target.value)}
          />
          <button onClick={startGame}>Start</button>
        </div>
      ) : (
        <div className={styles.gameContainer}>
          <h1>Game</h1>
          <div className={styles.game}>
            <canvas ref={canvasRef} className={styles.gameCanvas} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleAIGame;
