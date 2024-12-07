'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { motion } from 'framer-motion';
import { Montserrat } from "next/font/google";
import { Check, X } from 'lucide-react';
import customAxios from '../../customAxios';
import TournamentBracket from "../../components/TournamentBracket";
import { gameService } from '../../services/gameService';
import { useUser } from '../../contexts/UserContext';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

function MainComponent() {
  const { userData } = useUser();
  const [showTournament, setShowTournament] = useState(false);
  const [selectedMap, setSelectedMap] = useState(null);
  const [isMode, setIsMode] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [tournamentCreator, setTournamentCreator] = useState(null);
  const [tournamentId, setTournamentId] = useState(null);
  const [tournamentData, setTournamentData] = useState(null);
  const [showFriendsPopup, setShowFriendsPopup] = useState(false);
  const [friends, setFriends] = useState({ friends: [] });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await customAxios.get('http://127.0.0.1:8000/friend/friends');
        if (response.data) {
          setFriends(response.data);
          setError(null);
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Failed to load friends');
        setFriends({ friends: [] });
      }
    };

    if (isMode === 'Friends') {
      fetchFriends();
    }
  }, [isMode]);

  useEffect(() => {
    if (userData) {
      setTournamentCreator({
        id: userData.id,
        username: userData.username,
        profile_photo: userData.profile_photo
      });
    }
  }, [userData]);

  useEffect(() => {
    if (!tournamentId) return;

    const cleanup = gameService.setupBracketListener(tournamentId, (bracketData) => {
      setTournamentData(prevData => ({
        ...prevData,
        matches: bracketData
      }));
    });

    return () => {
      cleanup();
    };
  }, [tournamentId]);

  const handleInviteFriend = async (friendId) => {
    try {
      await customAxios.post(`/api/game/invite`, {
        friendship_id: friendId,
        map: selectedMap
      });
      setShowFriendsPopup(false);
    } catch (error) {
      console.error('Error inviting friend:', error);
    }
  };

  const handleJoinTournament = async () => {
    setIsSearching(true);
    try {
      const response = await gameService.joinTournament(tournamentCreator, selectedMap);
      
      if (response.success) {
        setTournamentId(response.tournamentId);
        setShowTournament(true);
        setIsSearching(false);
      }
    } catch (error) {
      console.error('Error starting tournament:', error);
    }
  };

  const handlePlay = () => {
    if (isMode === 'Friends' && selectedMap) {
      setShowFriendsPopup(true);
    } else if (isMode === 'Bot' && selectedMap) {
      // Handle bot game logic here
    }
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
  };

  return (
    <>
      <div className="relative w-full h-full">
        <div className={`flex-1 w-full h-full overflow-y-auto flex flex-wrap items-center justify-center p-4`}>
          <motion.div className={`motion-preset-expand rounded-3xl border-solid border-[#BCBCC9] bg-[#F4F4FF] flex flex-col shadow-lg shadow-[#BCBCC9] items-center w-[90%] min-h-[1300px] bg-[#F4F4FF] justify-center p-8`}>
            <div className="w-full flex flex-col items-center justify-start space-y-8">
              <h1 className="text-2xl lg:text-4xl md:text-xl font-extrabold tracking-wide text-[#242F5C] mt-4">
                CHOOSE YOUR MAP
              </h1>
              <hr className="lg:w-[50%] lg:h-[3px] md:w-[40%] md:h-[3px] w-[65%] h-[3px] bg-[#CDCDE5] border-none rounded-full" />
              
              {/* Map Selection */}
              <div className="flex sm:flex-row justify-center gap-20 w-full h-[calc(50%-100px)] pt-10">
                <div className="w-full sm:w-auto px-1 sm:px-0 mb-8 sm:mb-0 relative">
                  <Image 
                    src="/images/WhiteMap.svg" 
                    alt="WhiteMap" 
                    width={500} 
                    height={500} 
                    className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] cursor-pointer transition-all duration-300 ease-in-out "
                    priority
                    onClick={() => setSelectedMap('White Map')}
                  />
                  {selectedMap === 'White Map' && (
                    <div className="absolute top-2 right-4 bg-[#242F5C] text-white p-2 rounded-full motion-preset-expand ">
                      <Check size={18} />
                    </div>
                  )}
                  <h1 className="text-xs lg:text-3xl md:text-2xl font-extrabold tracking-wide text-[#242F5C] text-center p-4">
                    White Map
                  </h1>
                </div>
                <div className="w-full sm:w-auto sm:px-0 relative">
                  <Image 
                    src="/images/BlueMap.svg" 
                    alt="BlueMap" 
                    width={500} 
                    height={500} 
                    className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] cursor-pointer transition-all duration-300 ease-in-out "
                    priority
                    onClick={() => setSelectedMap('Blue Map')}
                  />
                  {selectedMap === 'Blue Map' && (
                    <div className="absolute top-2 right-4 bg-white text-[#242F5C]  p-2 rounded-full motion-preset-expand ">
                      <Check size={18} />
                    </div>
                  )}
                  <h1 className="text-xs lg:text-3xl md:text-2xl font-extrabold tracking-wide text-[#242F5C] text-center p-4">
                    Blue Map
                  </h1>
                </div>
              </div>

              {/* Game Mode Selection */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-10 lg:gap-20 w-full sm:pt-10 "> 
                <button onClick={() => setIsMode('Friends')} className="relative w-full sm:w-auto py-4 px-4 md:py-2 md:px-4 lg:py-5 lg:px-12 bg-[#242F5C] rounded-xl sm:rounded-full cursor-pointer overflow-hidden font-extrabold text-sm sm:text-base lg:text-lg text-[#fff] shadow flex items-center justify-center gap-2 transition-transform duration-300 ease-in-out hover:scale-105">
                  <img 
                    src="/images/PlayWithFriends.svg" 
                    alt="Friends icon" 
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                  />
                  Friends
                  {isMode === 'Friends' && (
                    <div className="absolute top-5 right-4 bg-white text-[#242F5C] p-2 rounded-full motion-preset-expand">
                      <Check size={8} />
                    </div>
                  )}
                </button>
              
                <button onClick={() => setIsMode('Bot')} className="relative w-full sm:w-auto py-4 px-4 md:py-2 md:px-4 lg:py-5 lg:px-16 bg-[#242F5C] rounded-xl sm:rounded-full cursor-pointer overflow-hidden font-extrabold text-sm sm:text-base lg:text-lg text-[#fff] shadow flex items-center justify-center gap-2 transition-transform duration-300 ease-in-out hover:scale-105">
                  <img 
                    src="/images/PlayWithFriends.svg" 
                    alt="Friends icon" 
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                  />
                  Bot
                  {isMode === 'Bot' && (
                    <div className="absolute top-5 right-4 bg-white text-[#242F5C] p-2 rounded-full motion-preset-expand">
                      <Check size={8} />
                    </div>
                  )}
                </button>
              </div>

              <hr className="lg:w-[50%] lg:h-[3px] md:w-[40%] md:h-[3px] w-[65%] h-[3px] bg-[#CDCDE5] border-none rounded-full mt-12" />
              
              <button 
                onClick={handlePlay}
                disabled={!selectedMap || !isMode}
                className="w-full sm:w-auto py-6 px-4 md:py-2 md:px-4 lg:py-5 lg:w-[25%] bg-[#242F5C] rounded-xl sm:rounded-full cursor-pointer overflow-hidden font-extrabold text-lg sm:text-base lg:text-lg text-[#fff] shadow flex items-center justify-center gap-2 transition-transform duration-300 ease-in-out hover:scale-105"
              >
                PLAY
              </button>

              <button 
                className="w-full sm:w-auto py-6 px-4 md:py-2 md:px-4 lg:py-5 lg:px-16 bg-[#242F5C] rounded-xl sm:rounded-full cursor-pointer overflow-hidden font-extrabold text-lg sm:text-base lg:text-lg text-[#fff] shadow flex items-center justify-center gap-2 transition-transform duration-300 ease-in-out hover:scale-105"
                onClick={handleJoinTournament}
                disabled={isSearching}
              >
                <img 
                  src="/images/ADD.svg" 
                  alt="ADD icon" 
                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                />
                {isSearching ? 'Searching for players...' : 'Join Tournament'}
              </button>

              {isSearching && (
                <button 
                  onClick={handleCancelSearch}
                  className="mt-4 w-full sm:w-auto py-3 px-4 bg-red-500 rounded-xl sm:rounded-full cursor-pointer font-bold text-white shadow flex items-center justify-center gap-2 hover:bg-red-600 transition-colors"
                >
                  Cancel Search
                </button>
              )}

              {/* Friends Popup */}
              {showFriendsPopup && (
                <div className="fixed inset-0 z-50">
                  <div className="fixed inset-0 backdrop-blur-md bg-[#F4F4FF]/30" />
                  <div className="relative h-full flex items-center justify-center">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-[#F4F4FF] rounded-3xl p-8 w-[90%] max-w-[500px] max-h-[80vh] shadow-lg border border-[#BCBCC9]"
                    >
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                          <img 
                            src="/images/PlayWithFriends.svg" 
                            alt="Friends icon" 
                            className="w-8 h-8"
                          />
                          <h2 className="text-2xl font-extrabold text-[#242F5C]">Invite Friends</h2>
                        </div>
                        <button
                          onClick={() => setShowFriendsPopup(false)}
                          className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#242F5C] hover:text-white transition-all duration-300"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      <div className="mb-6">
                        <div className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm">
                          <div className="w-10 h-10 rounded-lg bg-[#242F5C] flex items-center justify-center">
                            <img 
                              src={selectedMap === 'White Map' ? '/images/WhiteMap.svg' : '/images/BlueMap.svg'}
                              alt="Selected Map"
                              width={32}
                              height={32}
                            />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Selected Map</p>
                            <p className="font-semibold text-[#242F5C]">{selectedMap}</p>
                          </div>
                        </div>
                      </div>
                      
                      {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                          <p className="text-red-600 text-sm">{error}</p>
                        </div>
                      )}
                      
                      <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                        {!friends?.friends || friends.friends.length === 0 ? (
                          <div className="text-center py-8">
                            <img 
                              src="/images/PlayWithFriends.svg" 
                              alt="No friends"
                              className="w-16 h-16 mx-auto mb-4 opacity-50"
                            />
                            <p className="text-gray-500">No friends available</p>
                          </div>
                        ) : (
                          friends.friends.map((friend) => (
                            <div
                              key={friend.friendship_id}
                              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                            >
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <Image
                                    src={friend.user.profile_photo || "/images/avatarInvite.svg"}
                                    alt={friend.user.username}
                                    width={48}
                                    height={48}
                                    className="rounded-xl"
                                  />
                                </div>
                                <div>
                                  <p className="font-bold text-[#242F5C]">{friend.user.username}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleInviteFriend(friend.friendship_id)}
                                disabled={!friend.user.is_on}
                                className="px-5 py-2 rounded-xl font-semibold transition-all cursor-pointer ease-in-out duration-300 bg-[#242F5C] text-white hover:bg-[#1a2340] hover:scale-105"
                              >
                                Invite
                              </button>
                            </div>
                          ))
                        )}
                      </div>

                      <style jsx>{`
                        .custom-scrollbar::-webkit-scrollbar {
                          width: 6px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                          background: #f1f1f1;
                          border-radius: 10px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                          background: #BCBCC9;
                          border-radius: 10px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                          background: #242F5C;
                        }
                      `}</style>
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Tournament Modal */}
        {showTournament && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
            <div className="relative h-full flex items-center justify-center">
              <div className="bg-white rounded-xl p-6 w-full max-w-4xl mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-[#242F5C]">Tournament</h2>
                  <button
                    onClick={() => setShowTournament(false)}
                    className="text-[#242F5C] hover:text-opacity-80"
                  >
                    ✕
                  </button>
                </div>
                {tournamentData && (
                  <TournamentBracket tournamentData={tournamentData} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default MainComponent;
