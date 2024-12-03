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

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

// function TournamentPage({ onClose, invitedFriends }) {
//   const [IsClose, setIsClose] = useState(true);
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobile(window.innerWidth <= 768);
//     };

//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   function InviteFriends({ friend, onInvite, isInvited }) {
//     return(
//       <div className={`w-[90%] mx-auto h-auto sm:mt-4 mt-4 rounded-xl bg-[#D8D8F7] shadow-md shadow-[#BCBCC9] relative ${isMobile ? 'w-[95%]' : ' min-h-[90px] '} ${montserrat.className}`}>
//         <div className="flex items-center h-auto p-2">
//           <div className="flex flex-row items-center justify-center lg:w-[10%] lg:h-auto md:w-[10%] md:h-[90%] w-[20%] h-[90%] ">
//             <Image 
//               priority 
//               src={friend.profiles_photo || "./images/avatarInvite.svg"} 
//               alt="profile" 
//               width={50} 
//               height={50} 
//               className="lg:w-[90%] lg:h-[90%] md:w-[80%] md:h-[80%] w-[100%] h-[100%] rounded-full object-cover" 
//             />
//           </div>
//           <div className="flex flex-col justify-center lg:w-[80%] lg:h-auto md:w-[80%] md:h-[90%] w-[60%] h-[90%] pl-4">
//             <h1 className="lg:text-2xl md:text-xl text-lg font-bold text-[#242F5C]">{friend.username}</h1>
//             <p className="text-green-600 lg:text-sm text-xs font-medium">Online</p>
//           </div>
//           <div className="flex flex-row items-center justify-center lg:w-[10%] lg:h-[90%] md:w-[10%] md:h-[90%] w-[20%] h-[90%] absolute md:right-10 right-5 top-1 md:gap-3 gap-2">
//             <button
//               onClick={() => !isInvited && onInvite(friend)}
//               className={`cursor-pointer transition-transform hover:scale-110 ${isInvited ? 'opacity-50 cursor-not-allowed' : ''}`}
//               disabled={isInvited}
//             >
//               <Image 
//                 src={isInvited ? "/images/check.svg" : "/images/InviteGame.svg"}
//                 alt={isInvited ? "Invited" : "Invite"} 
//                 width={50} 
//                 height={50} 
//                 className="lg:w-[40%] lg:h-[40%] md:w-[40%] md:h-[40%] w-[30%] h-[30%]" 
//               />
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <>
//       {IsClose && (
//         <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center motion-preset-pop  ">
//           <div className="bg-[#F4F4FF] bg-re flex flex-col items-center shadow-lg rounded-xl w-[95%] overflow-y-auto scrollbar-hide custom-scrollbarh-[90%] mt-[80px] sm:h-[90%] border-solid border-[#BCBCC9] border-2 max-w-[900px] max-h-[500px] sm:max-h-[900px] min-h-[580px] pt-8 animate-scaleIn">
//             <div className="relative flex flex-col items-center w-full h-full overflow-y-auto scrollbar-hide custom-scrollbar ">
//               {invitedFriends.map((friend, index) => (
//                 <InviteFriends key={index} friend={friend} onInvite={() => {}} isInvited={true} />
//               ))}
//               <Image
//                 src="/images/close.svg"
//                 alt="Close"
//                 width={32}
//                 height={32}
//                 className="absolute top-[-px] sm:top-2 right-2 sm:right-11 cursor-pointer w-[20px] h-[20px] sm:w-10 sm:h-10"
//                 onClick={() => {
//                   setIsClose(false);
//                   onClose();
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

function MainComponent() {
  const [showTournament, setShowTournament] = useState(false);
  const [selectedMap, setSelectedMap] = useState(null);
  const [isMode, setIsMode] = useState(null);
  const [invitedPlayers, setInvitedPlayers] = useState([]);
  const [friends, setFriends] = useState({ friends: [] });
  const [error, setError] = useState(null);
  const [showFriendsPopup, setShowFriendsPopup] = useState(false);
  const [tournamentCreator, setTournamentCreator] = useState(null);
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
        
        setFriends(mockedData);
        setError(null);
      } catch (error) {
        console.error('Error fetching friends:', error);
        setError('Failed to load friends');
        setFriends({ friends: [] });
      }
    };

    fetchFriends();
  }, []);

  useEffect(() => {
    const fetchCreatorInfo = async () => {
      try {
        const response = await customAxios.get('/user/me');
        setTournamentCreator(response.data);
      } catch (error) {
        console.error('Error fetching creator info:', error);
      }
    };
    fetchCreatorInfo();
  }, []);

  useEffect(() => {
    if (!tournamentId) return;

    const fetchTournamentData = async () => {
      const result = await gameService.getTournamentData(tournamentId);
      if (result.success) {
        setTournamentData(result.data);
        
        // TODO: Game Developer Integration Point
        // Here you should:
        // 1. Check if there's a current match ready to play
        // 2. Check if current user is part of that match
        // 3. Redirect players to the game component/page
        // 4. Pass necessary data: matchId, tournamentId, players
        // Example:
        // if (result.data.currentMatch && userShouldPlay) {
        //   startGame({
        //     matchId: result.data.currentMatch.id,
        //     tournamentId: tournamentId,
        //     players: result.data.currentMatch.players
        //   });
        // }
      }
    };

    // Initial fetch
    fetchTournamentData();

    // Poll for updates every 3 seconds
    const interval = setInterval(fetchTournamentData, 3000);
    return () => clearInterval(interval);
  }, [tournamentId]);

  const handleInviteToTournament = (friend) => {
    if (invitedPlayers.length < 3) {
      if (!invitedPlayers.some(player => player.id === friend.id)) {
        const newPlayer = {
          id: friend.id,
          username: friend.username,
          profile_photo: friend.profiles_photo || './images/avatarInvite.svg'
        };
        setInvitedPlayers([...invitedPlayers, newPlayer]);
      }
    } else {
      // showAlert("Tournament is full! Maximum 4 players allowed.", "warning");
    }
  };

  const handleRemoveFromTournament = (friendId) => {
    setInvitedPlayers(invitedPlayers.filter(player => player.id !== friendId));
  };

  const maxAdditionalPlayers = 3;
  const canStartTournament = invitedPlayers.length > 0 && invitedPlayers.length <= maxAdditionalPlayers;

  const handleStartTournament = async () => {
    if (!tournamentCreator) {
      console.error('Tournament creator info not loaded');
      return;
    }

    if (canStartTournament) {
      try {
        // Prepare players data including tournament creator
        const players = [...invitedPlayers, tournamentCreator].map(player => ({
          id: player.id,
          username: player.username
        }));

        // Start tournament
        const response = await gameService.startTournament(players, selectedMap);
        
        if (response.success) {
          setTournamentId(response.tournamentId);
          setShowTournament(true);
          setShowFriendsPopup(false);
          // toast.success('Tournament started!');
        } else {
          // toast.error(response.error || 'Failed to start tournament');
        }
      } catch (error) {
        console.error('Error starting tournament:', error);
        // toast.error('Failed to start tournament');
      }
    }
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
                onClick={() => setShowFriendsPopup(true)}
              >
                <img 
                  src="/images/ADD.svg" 
                  alt="ADD icon" 
                  className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
                />
                Tournament ({invitedPlayers.length}/3)
              </button>
            </div>
        
          </motion.div>
        </div>


        {/* Friends Popup */}
        {showFriendsPopup && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
            <div className="relative h-full flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl w-[90%] max-w-[500px] overflow-hidden"
              >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <div>
                    <h2 className="text-xl font-bold text-[#242F5C]">Tournament Invites</h2>
                    <p className="text-sm text-gray-500 mt-1">Invite up to 3 players</p>
                  </div>
                  <button
                    onClick={() => setShowFriendsPopup(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Content */}
                <div className="p-6">
                  {!friends.friends || friends.friends.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Friends Available</h3>
                      <p className="text-gray-500">Add some friends to invite them to play!</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-3 max-h-[400px] overflow-y-auto">
                        {friends.friends.map((friend) => (
                          <div
                            key={friend.id}
                            className="flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10">
                                <Image
                                  src={friend.profiles_photo || "/images/avatarInvite.svg"}
                                  alt={friend.username}
                                  fill
                                  className="rounded-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium text-[#242F5C]">{friend.username}</p>
                                <p className="text-sm text-gray-500">{friend.status}</p>
                              </div>
                            </div>
                            {invitedPlayers.some((player) => player.id === friend.id) ? (
                              <button
                                onClick={() => handleRemoveFromTournament(friend.id)}
                                className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                                Cancel
                              </button>
                            ) : (
                              <button
                                onClick={() => handleInviteToTournament(friend)}
                                disabled={invitedPlayers.length >= maxAdditionalPlayers}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                  invitedPlayers.length >= maxAdditionalPlayers
                                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                                    : 'text-[#242F5C] hover:bg-[#F4F4FF]'
                                }`}
                              >
                                Invite
                                {invitedPlayers.length >= maxAdditionalPlayers && (
                                  <span className="text-xs">(Max players reached)</span>
                                )}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="mt-6 flex justify-end">
                      </div>
                    </>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">Selected Players</span>
                    <span className="text-sm font-medium text-[#242F5C]">{invitedPlayers.length}/3</span>
                  </div>
                  
                  <button
                    onClick={handleStartTournament}
                    disabled={!canStartTournament}
                    className={`w-full py-3 rounded-xl font-medium transition-colors ${
                      canStartTournament
                        ? 'bg-[#242F5C] text-white hover:bg-opacity-90'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canStartTournament ? 'Start Tournament' : 'Select Players to Start'}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
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
