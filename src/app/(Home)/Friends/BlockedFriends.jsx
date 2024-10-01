"use client"
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useState, useEffect } from "react";

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
  })

function BlockedFriends() {
  const [isMobileBL, setIsMobileBL] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobileBL(window.innerWidth <= 1700);
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`w-full  md:w-[70%]  mx-auto h-20 lg:h-[12%] md:h[20%] mt-2 rounded-xl bg-[#D8D8F7] shadow-md shadow-[#BCBCC9] relative ${isMobile ? '' : 'min-w-[500px] min-h-[90px]'} ${montserrat.className}`}>
        <div className="flex items-center h-full p-2">
        <div className="flex flex-row items-center justify-center lg:w-[10%] lg:h-[90%] md:w-[10%] md:h-[90%] w-[20%] h-[90%]">
            <Image src="./images/avatarInvite.svg" alt="profile" width={50} height={50} className="lg:w-[90%] lg:h-[90%] md:w-[80%] md:h-[80%] w-[100%] h-[100%]" />
        </div>
        <div className="ml-4 flex flex-col justify-center">
            <h1 className="text-[#242F5C] text-sm lg:text-lg md:text-base font-bold">John Doe</h1>
            <p className="text-green-600 lg:text-sm text-xs font-medium">Online</p>
        </div>
        {!isMobileBL ?
          <div className="flex flex-row items-center justify-end lg:w-[50%] lg:h-[90%] md:w-[10%] md:h-[90%] w-[20%] h-[90%] absolute md:right-10 right-5 top-1 md:gap-5 gap-2">
            <button className="
                  bottom-2 right-[8%] 
                  md:bottom-[7%] 
                  lg:bottom-[5%] lg:right-[4%]
                  text-base tracking-wide
                  w-[100px] h-[40px]
                  md:w-[100px] md:h-[40px]
                  lg:w-[120px] lg:h-[60%]
                  bg-[#242F5C] rounded-full cursor-pointer overflow-hidden 
                  transition-all duration-500 ease-in-out shadow-md 
                  hover:scale-105 hover:shadow-lg 
                  before:absolute before:top-0 before:-left-full before:w-full before:h-full 
                  before:bg-gradient-to-r before:from-[#242F5C] before:to-[#7C829D] 
                  before:transition-all before:duration-500 before:ease-in-out before:z-[-1] 
                  font-extrabold before:rounded-xl hover:before:left-0 text-[#fff]">
            Unblock
          </button>
        </div>
          :
          <div className="flex flex-row items-center justify-end lg:w-[20%] lg:h-[90%] md:w-[20%] md:h-[90%] w-[20%] h-[90%] absolute md:right-4 right-5 top-1 md:gap-5 gap-5 ">
              <Image src="/images/BlockedFriends.svg" alt="profile" width={50} height={50} className="lg:w-[40%] lg:h-[40%] md:w-[40%] md:h-[40%] w-[30%] h-[30%]  cursor-pointer" />
          </div>}
        </div>
    </div>
  );
}

export default BlockedFriends;
