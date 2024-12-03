'use client';
import React from 'react';
import Image from 'next/image';
import { IconLaurelWreath } from '@tabler/icons-react';

const PlayerCard = ({ player, isWinner }) => (
  <div className={`flex items-center gap-3 p-4 rounded-lg ${
    isWinner ? 'bg-green-50 border-2 border-green-500' : 'bg-white border-2 border-[#242F5C]'
  }`}>
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

const TournamentBracket = ({ tournamentData }) => {
  const { matches } = tournamentData;
  
  return (
    <div className="flex flex-col items-center p-8">
      <h2 className="text-2xl font-bold text-[#242F5C] mb-8">
        {matches.isComplete ? 'Tournament Complete!' : 'Tournament Bracket'}
      </h2>

      <div className="w-full max-w-4xl">
        {/* Semi-finals */}
        <div className="flex justify-between mb-16">
          {/* Left semifinal */}
          <div className="w-[45%] space-y-4">
            <PlayerCard 
              player={matches.semifinals.match1?.player1}
              isWinner={matches.semifinals.match1?.winner?.id === matches.semifinals.match1?.player1?.id}
            />
            <PlayerCard 
              player={matches.semifinals.match1?.player2}
              isWinner={matches.semifinals.match1?.winner?.id === matches.semifinals.match1?.player2?.id}
            />
          </div>

          {/* Right semifinal */}
          <div className="w-[45%] space-y-4">
            <PlayerCard 
              player={matches.semifinals.match2?.player1}
              isWinner={matches.semifinals.match2?.winner?.id === matches.semifinals.match2?.player1?.id}
            />
            <PlayerCard 
              player={matches.semifinals.match2?.player2}
              isWinner={matches.semifinals.match2?.winner?.id === matches.semifinals.match2?.player2?.id}
            />
          </div>
        </div>

        {/* Finals */}
        {(matches.semifinals.match1?.winner || matches.semifinals.match2?.winner) && (
          <div className="w-1/2 mx-auto space-y-4">
            <PlayerCard 
              player={matches.final?.player1}
              isWinner={matches.final?.winner?.id === matches.final?.player1?.id}
            />
            <PlayerCard 
              player={matches.final?.player2}
              isWinner={matches.final?.winner?.id === matches.final?.player2?.id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentBracket;
