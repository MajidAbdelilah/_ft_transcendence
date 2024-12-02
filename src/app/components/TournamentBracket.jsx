'use client';
import React from 'react';
import Image from 'next/image';
import { IconLaurelWreath } from '@tabler/icons-react';

const PlayerCard = ({ player, isWinner }) => (
  <div 
    className={`flex items-center gap-3 p-4 rounded-lg ${
      isWinner ? 'bg-green-50 border-2 border-green-500' : 'bg-white border-2 border-[#242F5C]'
    }`}
  >
    <div className="relative w-10 h-10 rounded-full overflow-hidden">
      <Image
        src={player?.profiles_photo || "/images/avatarInvite.svg"}
        alt={player?.username || "TBD"}
        fill
        className="object-cover"
      />
    </div>
    <p className="font-semibold text-[#242F5C]">{player?.username || 'TBD'}</p>
    {isWinner && <IconLaurelWreath className="text-green-500 ml-auto" />}
  </div>
);

const TournamentBracket = ({ 
  players, 
  onClose,
  matchResults = {
    semifinals: {
      left: null,  // winner of left semifinal
      right: null, // winner of right semifinal
    },
    final: null    // tournament winner
  }
}) => {
  const { semifinals, final } = matchResults;
  const currentRound = !semifinals.left && !semifinals.right ? 'semifinals' 
                      : !final ? 'finals'
                      : 'complete';

  return (
    <div className="flex flex-col items-center p-8">
      <h2 className="text-2xl font-bold text-[#242F5C] mb-8">
        {currentRound === 'complete' 
          ? 'Tournament Complete!'
          : currentRound === 'finals' 
            ? 'Finals'
            : 'Semi-finals'}
      </h2>

      <div className="w-full max-w-4xl">
        {/* Semi-finals */}
        <div className="flex justify-between mb-16">
          <div className="w-[45%] space-y-4">
            <PlayerCard 
              player={players[0]}
              isWinner={semifinals.left === players[0]}
            />
            <PlayerCard 
              player={players[1]}
              isWinner={semifinals.left === players[1]}
            />
          </div>

          <div className="w-[45%] space-y-4">
            <PlayerCard 
              player={players[2]}
              isWinner={semifinals.right === players[2]}
            />
            <PlayerCard 
              player={players[3]}
              isWinner={semifinals.right === players[3]}
            />
          </div>
        </div>

        {/* Finals */}
        {(semifinals.left || semifinals.right) && (
          <div className="w-1/2 mx-auto space-y-4">
            <PlayerCard 
              player={semifinals.left}
              isWinner={final === semifinals.left}
            />
            <PlayerCard 
              player={semifinals.right}
              isWinner={final === semifinals.right}
            />
          </div>
        )}
      </div>

      {currentRound === 'complete' && (
        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-[#242F5C] text-white rounded-lg hover:bg-opacity-90 transition-colors"
          >
            Close Tournament
          </button>
        </div>
      )}
    </div>
  );
};

export default TournamentBracket;
