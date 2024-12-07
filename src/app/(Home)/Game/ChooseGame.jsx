'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { motion } from 'framer-motion';
import { Montserrat } from "next/font/google";
import { Check } from 'lucide-react';
import customAxios from '../../customAxios';
import TournamentBracket from "../../components/TournamentBracket";
import { gameService } from '../../services/gameService';
import { useUser } from '../../contexts/UserContext'; // Update import path

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
  const [tournamentCreator, setTournamentCreator] = useState(null); // Keep tournamentCreator state
  const [tournamentId, setTournamentId] = useState(null);
  const [tournamentData, setTournamentData] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        // Comment out API call for now
        // const response = await customAxios.get('http://127.0.0.1:8000/friend/friends');
        // if (response.data) {
        //   setFriends(response.data);
        //   setError(null);
        // }

        // Mocked friends data for testing
        const mockedData = {
          friends: [
            {
              id: 1,
              username: "John Doe",
              status: "online",
              profiles_photo: "/images/avatarInvite.svg"
            },
            {
              id: 2,
              username: "Alice Smith",
              status: "online",
              profiles_photo: "/images/avatarInvite.svg"
            },
            {
              id: 3,
              username: "Bob Johnson",
              status: "offline",
              profiles_photo: "/images/avatarInvite.svg"
            },
            {
              id: 4,
              username: "Emma Wilson",
              status: "online",
              profiles_photo: "/images/avatarInvite.svg"
            },
            {
              id: 5,
              username: "Emma Wilson",
              status: "online",
              profiles_photo: "/images/avatarInvite.svg"
            },
            {
              id: 6,
              username: "Emma Wilson",
              status: "online",
              profiles_photo: "/images/avatarInvite.svg"
            },
            {
              id: 7,
              username: "Emma Wilson",
              status: "online",
              profiles_photo: "/images/avatarInvite.svg"
            }
            
          ]
        };
        
        // setFriends(mockedData);
        // setError(null);
      } catch (error) {
        console.error('Error fetching friends:', error);
        // setError('Failed to load friends');
        // setFriends({ friends: [] });
      }
    };

    fetchFriends();
  }, []);

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

    // // Initial fetch of tournament data via HTTP
    // const fetchTournamentData = async () => {
    //   const result = await gameService.getTournamentData(tournamentId);
    //   if (result.success) {
    //     setTournamentData(result.data);
    //   }
    // };
    // fetchTournamentData();

    // Setup WebSocket listener for real-time bracket updates
    const cleanup = gameService.setupBracketListener(tournamentId, (bracketData) => {
      setTournamentData(prevData => ({
        ...prevData,
        matches: bracketData
      }));
    });

    // Cleanup WebSocket when unmounting or tournament changes
    return () => {
      cleanup();
    };
  }, [tournamentId]);

  const handleJoinTournament = async () => {
    setIsSearching(true);
    try {
      // Prepare players data including tournament creator
      const response = await gameService.joinTournament(tournamentCreator, selectedMap);
      
      if (response.success) {
        setTournamentId(response.tournamentId);
        setShowTournament(true);
        setIsSearching(false);
        // toast.success('Tournament started!');
      } else {
        // toast.error(response.error || 'Failed to start tournament');
      } 
    } catch (error) {
      console.error('Error starting tournament:', error);
      // toast.error('Failed to start tournament');
    }
  };

  const handleCancelSearch = () => {
    setIsSearching(false);
  };

  return (
    <>
      <div className="relative w-full h-full">
        <div className={`flex-1 w-full h-full overflow-y-auto flex flex-wrap items-center justify-center p-4`}>
          <motion.div
            className={`motion-preset-expand rounded-3xl border-solid border-[#BCBCC9] bg-[#F4F4FF]'} flex flex-col shadow-lg shadow-[#BCBCC9] items-center 
              w-[90%] min-h-[1300px] bg-[#F4F4FF] justify-center p-8`}
          >
            <div className="w-full flex flex-col items-center justify-start space-y-8">
              <h1 className="text-2xl lg:text-4xl md:text-xl font-extrabold tracking-wide text-[#242F5C] mt-4">
                CHOOSE YOUR MAP
              </h1>
              <hr className="lg:w-[50%] lg:h-[3px] md:w-[40%] md:h-[3px] w-[65%] h-[3px] bg-[#CDCDE5] border-none rounded-full" />
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
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-10 lg:gap-20 w-full sm:pt-10 "> 
                <button onClick={() => setIsMode('Random')} className="relative w-full sm:w-auto py-4 px-4 md:py-2 md:px-4 lg:py-5 lg:w-[25%] bg-[#242F5C] rounded-xl sm:rounded-full cursor-pointer overflow-hidden font-extrabold text-sm sm:text-base lg:text-lg text-[#fff] shadow flex items-center justify-center gap-2 transition-transform duration-300 ease-in-out hover:scale-105">
                  <img 
                    src="/images/PlayWithFriends.svg" 
                    alt="Friends icon" 
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                  />
                  Random
                  {isMode === 'Random' && (
                  <div className="absolute top-5 right-4 bg-white text-[#242F5C]  p-2 rounded-full motion-preset-expand ">
                    <Check size={8} />
                  </div>
                )}
                </button>
                <button onClick={() => setIsMode('Friends')} className="relative w-full sm:w-auto py-4 px-4 md:py-2 md:px-4 lg:py-5 lg:px-12 bg-[#242F5C] rounded-xl sm:rounded-full cursor-pointer overflow-hidden font-extrabold text-sm sm:text-base lg:text-lg text-[#fff] shadow flex items-center justify-center gap-2 transition-transform duration-300 ease-in-out hover:scale-105">
                  <img 
                    src="/images/PlayWithFriends.svg" 
                    alt="Friends icon" 
                    className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                    
                  />
                  Friends
                  {isMode === 'Friends' && (
                  <div className="absolute top-5 right-4 bg-white text-[#242F5C]  p-2 rounded-full motion-preset-expand ">
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
                  <div className="absolute top-5 right-4 bg-white text-[#242F5C]  p-2 rounded-full motion-preset-expand ">
                    <Check size={8} />
                  </div>
                )}
                </button>
              </div>

              <hr className="lg:w-[50%] lg:h-[3px] md:w-[40%] md:h-[3px] w-[65%] h-[3px] bg-[#CDCDE5] border-none rounded-full mt-12" />
              <button className=" w-full sm:w-auto py-6 px-4 md:py-2 md:px-4 lg:py-5 lg:w-[25%] bg-[#242F5C] rounded-xl sm:rounded-full cursor-pointer overflow-hidden font-extrabold text-lg sm:text-base lg:text-lg text-[#fff] shadow flex items-center justify-center gap-2 transition-transform duration-300 ease-in-out hover:scale-105">
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
