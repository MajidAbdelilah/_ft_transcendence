'use client';

import { useSearchParams } from 'next/navigation';
import PingPongGame from './PingPongGame';

export default function PingPongGamePage() {
  const searchParams = useSearchParams();
  
  // Check if it's a tournament game (4 players)
  const isTournament = searchParams.has('player3') && searchParams.has('player4');
  
  const roomName = isTournament ? searchParams.get('turn-room-name') : searchParams.get('room_name');
  const player1 = searchParams.get('player1');
  const player2 = searchParams.get('player2');
  const player3 = isTournament ? searchParams.get('player3') : null;
  const player4 = isTournament ? searchParams.get('player4') : null;
  const map = searchParams.get('map');

  // Log the props being passed to PingPongGame
  console.log('PingPongGamePage props:', {
    roomName,
    player1,
    player2,
    player3,
    player4,
    map,
    isTournament
  });

  // Only render the game component if we have the required props
  if (!roomName || !player1) {
    console.error('Missing required props:', { roomName, player1 });
    return <div>Missing required game parameters</div>;
  }

  return (
    <PingPongGame
      roomName={roomName}
      player1={player1}
      player2={player2}
      player3={player3}
      player4={player4}
      map={map}
      isTournament={isTournament}
    />
  );
}
