'use client';

import React, { useState, useEffect } from 'react';
import TournamentBracket from '../../components/TournamentBracket';

const TournamentPage = ({ onClose, invitedFriends = [] }) => {
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    // Initialize players with invited friends
    const initialPlayers = invitedFriends.map((friend, index) => ({
      id: index + 1,
      username: friend.username,
      avatar: friend.profile_photo,
      score: 0
    }));

    // If less than 4 players, fill with "Waiting..." slots
    while (initialPlayers.length < 4) {
      initialPlayers.push({
        id: initialPlayers.length + 1,
        username: 'Waiting...',
        avatar: null,
        score: 0
      });
    }

    setPlayers(initialPlayers);
  }, [invitedFriends]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mx-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={onClose}
            className="text-[#242F5C] hover:text-opacity-80"
          >
            ✕
          </button>
        </div>
        
        {/* Tournament bracket component */}
        <TournamentBracket players={players} />
        
        {/* Player list */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-[#242F5C] mb-4">Players</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map((player) => (
              <div 
                key={player.id}
                className="flex items-center justify-between p-4 bg-[#F4F4FF] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {player.avatar && (
                    <img 
                      src={player.avatar} 
                      alt={player.username} 
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="font-medium">
                    {player.username}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Score: {player.score}</span>
                  {player.username !== 'Waiting...' && (
                    <button
                      className="px-3 py-1 bg-[#242F5C] text-white rounded-md text-sm hover:bg-opacity-90"
                      onClick={() => {
                        setPlayers(players.map(p => 
                          p.id === player.id 
                            ? { ...p, score: p.score + 1 }
                            : p
                        ));
                      }}
                    >
                      +
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentPage;
