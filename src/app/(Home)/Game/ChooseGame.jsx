'use client';
import { motion } from "framer-motion"
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useState, useEffect } from "react";
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

function ChooseGame() {
    const [isMobile, setIsMobile] = useState(false);

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
          md:w-[90%] h-full sm:h-[80%] md:h-[90%] bg-[#F4F4FF] justify-center p-4 `}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
    >
      <div className="w-full h-[90%] mt-2 md:mt-2 lg:mt-2 flex flex-col items-center justify-center space-y-8">
        <h1 className="text-2xl lg:text-5xl md:text-3xl font-extrabold content-center tracking-wide text-[#242F5C] animate-fadeinbounceright">
          CHOOSE YOUR MAP
        </h1>
        <hr className="lg:w-[50%] lg:h-[3px] md:w-[40%] md:h-[3px] w-[65%] h-[3px] bg-[#CDCDE5] border-none rounded-full" />
        <div className="flex  sm:flex-row justify-center gap-20 w-full h-[calc(100%-100px)] pt-10">
          <div className="w-full sm:w-auto px-1 sm:px-0 mb-8 sm:mb-0">
            <Image 
              src="/images/WhiteMap.svg" 
              alt="WhiteMap" 
              width={500} 
              height={500} 
              className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] cursor-pointer transition-transform duration-500 ease-in-out hover:scale-[1.05]" 
            />
             <h1 className="text-sm lg:text-3xl md:text-2xl font-extrabold tracking-wide text-[#242F5C] text-center p-4">
               White Map
            </h1>
          </div>
          <div className="w-full sm:w-auto px-1 sm:px-0">
            <Image 
              src="/images/BlueMap.svg" 
              alt="BlueMap" 
              width={500} 
              height={500} 
              className="w-full max-w-[300px] sm:max-w-[400px] lg:max-w-[500px] cursor-pointer transition-transform duration-500 ease-in-out hover:scale-[1.05]" 
            />
             <h1 className="text-sm lg:text-3xl md:text-2xl font-extrabold tracking-wide text-[#242F5C] text-center p-4">
               Blue Map
            </h1>
          </div>
        </div>
      </div>
    </motion.div>
  </div>
  );
}

export default ChooseGame;