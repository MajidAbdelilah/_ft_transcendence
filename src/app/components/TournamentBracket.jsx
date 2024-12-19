'use client';
import React from 'react';
import Image from 'next/image';
import { IconLaurelWreath } from '@tabler/icons-react';

const PlayerCard = ({ player, isWinner }) => {
  // Handle both string and object formats for player
  const playerName = typeof player === 'string' ? player : player?.username;
  const playerPhoto = typeof player === 'object' ? player?.profiles_photo : "/images/avatarInvite.svg";

  // Check if player is actually set (not empty string)
  const isPlayerSet = playerName && playerName.trim() !== '';

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-300 ${
      isWinner ? 'bg-green-100 border-2 border-green-500 shadow-md' : 'bg-white border-2 border-[#242F5C]'
    }`}>
      <div className="relative w-10 h-10 rounded-full overflow-hidden">
        <Image
          src={isPlayerSet ? playerPhoto : "/images/avatarInvite.svg"}
          alt={isPlayerSet ? playerName : "TBD"}
          fill
          className="object-cover"
        />
      </div>
      <p className={`font-semibold ${isWinner ? 'text-green-700' : 'text-[#242F5C]'}`}>
        {isPlayerSet ? playerName : 'TBD'}
      </p>
      {isWinner && (
        <div className="ml-auto flex items-center">
          <IconLaurelWreath className="text-green-500 w-6 h-6" />
        </div>
      )}
    </div>
  );
};

const TournamentBracket = ({ tournamentData }) => {
  console.log('Tournament Data:', tournamentData);
  
  if (!tournamentData || !tournamentData.type || tournamentData.type !== 'BRACKET_UPDATE') {
    return (
      <div className="flex flex-col items-center p-8">
        <h2 className="text-2xl font-bold text-[#242F5C] mb-8">
          Tournament Bracket
        </h2>
        <p>Loading tournament data...</p>
      </div>
    );
  }

  const { matches } = tournamentData;
  const semifinals = matches?.semifinals || {};
  const final = matches?.final || {};
  
  // Helper function to check if a player is the winner
  const isPlayerWinner = (match, playerName) => {
    if (!match || !match.winner) return false;

    // For finals with empty player strings, use the winner from semifinals
    if (match.winner === "player1" && match.player1 === "") {
      const semifinalsMatch1Winner = tournamentData?.matches?.semifinals?.match1?.winner;
      if (semifinalsMatch1Winner === "player1") {
        return playerName === tournamentData.matches.semifinals.match1.player1;
      } else if (semifinalsMatch1Winner === "player2") {
        return playerName === tournamentData.matches.semifinals.match1.player2;
      }
    }
    if (match.winner === "player2" && match.player2 === "") {
      const semifinalsMatch2Winner = tournamentData?.matches?.semifinals?.match2?.winner;
      if (semifinalsMatch2Winner === "player1") {
        return playerName === tournamentData.matches.semifinals.match2.player1;
      } else if (semifinalsMatch2Winner === "player2") {
        return playerName === tournamentData.matches.semifinals.match2.player2;
      } else if (semifinalsMatch2Winner === "player3") {
        return playerName === tournamentData.matches.semifinals.match2.player1;
      }
    }
    
    // Handle different winner formats
    if (typeof match.winner === 'object') {
      return match.winner.username === playerName?.username;
    }
    
    // If winner is a player position reference
    if (match.winner === "player1") return playerName === match.player1 || (typeof match.player1 === 'object' && match.player1?.username === playerName?.username);
    if (match.winner === "player2") return playerName === match.player2 || (typeof match.player2 === 'object' && match.player2?.username === playerName?.username);
    if (match.winner === "player3") {
      // For semifinals match2, player3 indicates player1 won
      return playerName === match.player1 || (typeof match.player1 === 'object' && match.player1?.username === playerName?.username);
    }
    
    return false;
  };

  return (
    <div className="flex flex-col items-center p-8">
      <h2 className="text-2xl font-bold text-[#242F5C] mb-8">
        Tournament Bracket
      </h2>
      
      <div className="w-full max-w-4xl">
        {/* Semi-finals */}
        <div className="flex justify-between mb-16">
          {/* Match 1 */}
          <div className="w-[45%] space-y-4">
            {semifinals.match1 && (
              <>
                <PlayerCard 
                  player={semifinals.match1.player1}
                  isWinner={isPlayerWinner(semifinals.match1, semifinals.match1.player1)}
                />
                <PlayerCard 
                  player={semifinals.match1.player2}
                  isWinner={isPlayerWinner(semifinals.match1, semifinals.match1.player2)}
                />
              </>
            )}
          </div>

          {/* Match 2 */}
          <div className="w-[45%] space-y-4">
            {semifinals.match2 && (
              <>
                <PlayerCard 
                  player={semifinals.match2.player1}
                  isWinner={isPlayerWinner(semifinals.match2, semifinals.match2.player1)}
                />
                <PlayerCard 
                  player={semifinals.match2.player2}
                  isWinner={isPlayerWinner(semifinals.match2, semifinals.match2.player2)}
                />
              </>
            )}
          </div>
        </div>

        {/* Finals */}
        <div className="w-1/2 mx-auto space-y-4">
          {final && (
            <>
              <PlayerCard 
                player={final.player1}
                isWinner={isPlayerWinner(final, final.player1)}
              />
              <PlayerCard 
                player={final.player2}
                isWinner={isPlayerWinner(final, final.player2)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TournamentBracket;
