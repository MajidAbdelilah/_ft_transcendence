'use client';
import { motion } from "framer-motion"
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useState, useEffect } from "react";
import Checkbox from "./utils";
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

function ChooseGame() {
    const [isMobile, setIsMobile] = useState(false);
    const [selected, setSelected] = useState("Medium");

    const handleChange = (value) => {
        setSelected(value);
    };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1698);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`flex-1 overflow-y-auto flex flex-wrap items-center justify-center h-full  ${isMobile ? '' : 'p-4'}`}>
    <motion.div
      className={` ${isMobile ? 'w-full mt-4 ' : 'rounded-3xl border-solid border-[#BCBCC9] bg-[#F4F4FF] rounded-3xl border-[#BCBCC9] bg-[#F4F4FF] '} flex flex-col  shadow-lg shadow-[#BCBCC9] items-center 
          md:w-[90%] h-auto sm:h-[80%] md:h-[90%] bg-[#F4F4FF] justify-center p-4 `}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
    >
      <div className="w-full  mt-2 md:mt-2 lg:mt-2 flex flex-col items-center space-y-8 pb-10">
        <h1 className="text-2xl lg:text-5xl md:text-3xl font-extrabold content-center tracking-wide text-[#242F5C] animate-fadeinbounceright">
          CHOOSE YOUR MAP
        </h1>
        <hr className="lg:w-[50%] lg:h-[3px] md:w-[40%] md:h-[3px] w-[65%] h-[3px] bg-[#CDCDE5] border-none rounded-full" />
        <div className="flex  sm:flex-row justify-center gap-20 w-full h-[calc(50%-100px)] pt-10">
          <div className="w-full sm:w-auto px-1 sm:px-0 mb-8 sm:mb-0 ">
            <Image 
              src="/images/WhiteMap.svg" 
              alt="WhiteMap" 
              width={500} 
              height={500} 
              className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] cursor-pointer transition-transform duration-500 ease-in-out hover:scale-[1.05]" 
            />
             <h1 className="text-xs lg:text-3xl md:text-2xl font-extrabold tracking-wide text-[#242F5C] text-center p-4">
               White Map
            </h1>
          </div>
          <div className="w-full sm:w-auto  sm:px-0">
            <Image 
              src="/images/BlueMap.svg" 
              alt="BlueMap" 
              width={500} 
              height={500} 
              className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] cursor-pointer transition-transform duration-500 ease-in-out hover:scale-[1.05]" 
            />
             <h1 className="text-xs lg:text-3xl md:text-2xl font-extrabold tracking-wide text-[#242F5C] text-center p-4">
               Blue Map
            </h1>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 md:gap-10 lg:gap-20 w-full sm:pt-10 "> 
          <button className="
                  w-full sm:w-auto
                  py-4 px-4 
                  md:py-2 md:px-4 
                  lg:py-5 lg:px-12 
                  bg-[#242F5C] rounded-xl sm:rounded-full cursor-pointer overflow-hidden  
                  font-extrabold text-sm sm:text-base lg:text-lg text-[#fff] shadow flex items-center justify-center gap-2
                  transition-transform duration-300 ease-in-out hover:scale-105" >
            <img 
            src="/images/PlayWithFriends.svg" 
            alt="Friends icon" 
            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
          />
          Random
        </button>
        <button className="
                  w-full sm:w-auto
                  py-4 px-4
                  md:py-2 md:px-4 
                  lg:py-5 lg:px-12 
                  bg-[#242F5C] rounded-xl sm:rounded-full cursor-pointer overflow-hidden  
                  font-extrabold text-sm sm:text-base lg:text-lg text-[#fff] shadow
                  flex items-center justify-center gap-2
                  transition-transform duration-300 ease-in-out hover:scale-105">
          <img 
            src="/images/PlayWithFriends.svg" 
            alt="Friends icon" 
            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
          />
          Friends
        </button>
        <button className="
                  w-full sm:w-auto
                  py-4 px-4 
                  md:py-2 md:px-4 
                  lg:py-5 lg:px-16
                  bg-[#242F5C] rounded-xl sm:rounded-full cursor-pointer overflow-hidden  
                  font-extrabold text-sm sm:text-base lg:text-lg text-[#fff] shadow flex items-center justify-center gap-2
                  transition-transform duration-300 ease-in-out hover:scale-105" >
          <img 
            src="/images/PlayWithFriends.svg" 
            alt="Friends icon" 
            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6"
          />
          Bot
        </button>
      </div>
      <Checkbox selected={selected} handleChange={handleChange} />
      <hr className="lg:w-[50%] lg:h-[3px] md:w-[40%] md:h-[3px] w-[65%] h-[3px] bg-[#CDCDE5] border-none rounded-full" />
      <button className="
                  w-full sm:w-auto
                  py-6 px-4 
                  md:py-2 md:px-4 
                  lg:py-5 lg:w-[25%]
                  bg-[#242F5C] rounded-xl sm:rounded-full cursor-pointer overflow-hidden  
                  font-extrabold text-lg sm:text-base lg:text-lg text-[#fff] shadow flex items-center justify-center gap-2
                  transition-transform duration-300 ease-in-out hover:scale-105" >
          PLAY
        </button>
        <button className="
                 w-full sm:w-auto
                  py-6 px-4 
                  md:py-2 md:px-4 
                  lg:py-5 lg:px-16
                  bg-[#242F5C] rounded-xl sm:rounded-full cursor-pointer overflow-hidden  
                  font-extrabold text-lg sm:text-base lg:text-lg text-[#fff] shadow flex items-center justify-center gap-2
                  transition-transform duration-300 ease-in-out hover:scale-105" >
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
  );
}

export default ChooseGame;
