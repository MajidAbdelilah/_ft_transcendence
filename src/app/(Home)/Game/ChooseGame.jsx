'use client';
import React, { useState, useEffect} from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Montserrat } from "next/font/google";
import { Check } from 'lucide-react';


const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

function TournamentPage({ onClose }) {
  const [IsClose, setIsClose] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);


  function InviteFriends() {
    return(

      <div className={`w-[90%] mx-auto h-auto  sm:mt-20 mt-10 rounded-xl bg-[#D8D8F7] shadow-md shadow-[#BCBCC9] relative ${isMobile ? 'w-[95%]' : ' min-h-[90px] '} ${montserrat.className}`}>
      <div className="flex items-center h-auto p-2">
          <div className="flex flex-row items-center justify-center lg:w-[10%] lg:h-auto md:w-[10%] md:h-[90%] w-[20%] h-[90%] ">
            <Image priority src="./images/avatarInvite.svg" alt="profile" width={50} height={50} className="lg:w-[90%] lg:h-[90%] md:w-[80%] md:h-[80%] w-[100%] h-[100%]" />
          </div>
          <div className="ml-4 flex flex-col justify-center">
            <h1 className="text-[#242F5C] text-sm lg:text-lg md:text-base font-bold">John Doe</h1>
            <p className="text-green-600 lg:text-sm text-xs font-medium">Online</p>
          </div>
          <div className=" flex flex-row items-center justify-center lg:w-[10%] lg:h-[90%] md:w-[10%] md:h-[90%] w-[20%] h-[90%] absolute md:right-10 right-5 top-1 md:gap-3 gap-2">
            <Image src="/images/InviteGame.svg" alt="profile" width={50} height={50} className="lg:w-[40%] lg:h-[40%] md:w-[40%] md:h-[40%] w-[30%] h-[30%] cursor-pointer " />
          </div>
      </div>
    </div>
);
  };

  return (
    <>
      {IsClose && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center motion-preset-pop  ">
          <div className="bg-[#F4F4FF] bg-re flex flex-col items-center shadow-lg rounded-xl w-[95%] overflow-y-auto scrollbar-hide custom-scrollbarh-[90%] mt-[80px] sm:h-[90%] border-solid border-[#BCBCC9] border-2 max-w-[900px] max-h-[500px] sm:max-h-[900px] min-h-[580px] pt-8 animate-scaleIn">
            <div className="relative flex flex-col items-center w-full h-full overflow-y-auto scrollbar-hide custom-scrollbar ">
              <InviteFriends />
              <InviteFriends />
              <InviteFriends />
              <InviteFriends />
              <InviteFriends />
              <InviteFriends />
              <InviteFriends />
              <InviteFriends />
              <InviteFriends />
              <InviteFriends />
              <InviteFriends />
              <InviteFriends />
              <InviteFriends />
              <Image
                src="/images/close.svg"
                alt="Close"
                width={32}
                height={32}
                className="absolute top-[-px] sm:top-2 right-2 sm:right-11 cursor-pointer w-[20px] h-[20px] sm:w-10 sm:h-10"
                onClick={() => {
                  setIsClose(false);
                  onClose();
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MainComponent() {
  const [showTournament, setShowTournament] = useState(false);
  const [isMobile, setIsMobile] = useState(false); 
  const [selectedMap, setSelectedMap] = useState(null); // State to track selected map
  const [isMode, setIsMode] = useState(null); // State to track selected mode

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className={`flex-1 overflow-y-auto flex flex-wrap items-center justify-center ${isMobile ? '' : 'p-4'} ${showTournament ? 'blur-sm' : ''}`}>
        <motion.div
          className={`${isMobile ? 'w-full mt-4 ' : 'motion-preset-expand  rounded-3xl border-solid border-[#BCBCC9] bg-[#F4F4FF] rounded-3xl border-[#BCBCC9] bg-[#F4F4FF] '} flex flex-col shadow-lg shadow-[#BCBCC9] items-center 
              md:w-[90%] sm:h-full md:h-[90%] bg-[#F4F4FF] justify-center p-4`}
        >
          <div className="w-full mt-2 md:mt-2 min-h-[80vh] flex flex-col items-center justify-center space-y-8 pb-10">
            <h1 className="text-2xl lg:text-4xl md:text-xl mt-4 font-extrabold content-center tracking-wide text-[#242F5C] motion-preset-compress  ">
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
              <button onClick={() => setIsMode('Random')} className="relative w-full sm:w-auto py-4 px-4 md:py-2 md:px-4 lg:py-5 lg:px-12 bg-[#242F5C] rounded-xl sm:rounded-full cursor-pointer overflow-hidden font-extrabold text-sm sm:text-base lg:text-lg text-[#fff] shadow flex items-center justify-center gap-2 transition-transform duration-300 ease-in-out hover:scale-105">
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
              onClick={() => setShowTournament(true)}
            >
              <img 
                src="/images/ADD.svg" 
                alt="ADD icon" 
                className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
              />
              Tournament
            </button>
          </div>
        </motion.div>
      </div>
      {showTournament && <TournamentPage onClose={() => setShowTournament(false)} />}
    </>
  );
}

export default MainComponent;
