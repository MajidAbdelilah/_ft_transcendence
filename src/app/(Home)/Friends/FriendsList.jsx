import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useState, useEffect } from "react";
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

function FriendsList() {
  const [isMobile, setIsMobile] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

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
    <div className={`w-full mx-auto h-20 lg:h-[12%] md:h[20%] mt-2 rounded-xl bg-[#D8D8F7] shadow-md shadow-[#BCBCC9] relative ${isMobile ? 'w-full' : ' min-h-[90px]'} ${montserrat.className}`}>
      <div className="flex items-center h-full p-2">
      <div className="flex flex-row items-center justify-center lg:w-[10%] lg:h-[90%] md:w-[10%] md:h-[90%] w-[20%] h-[90%] relative">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#242F5C]"></div>
          </div>
        )}
        <Image 
          priority 
          src="./images/avatarInvite.svg" 
          alt="profile" 
          width={50} 
          height={50} 
          className={`absolute inset-0 lg:w-[90%] lg:h-[90%] md:w-[80%] md:h-[80%] w-[100%] h-[100%] transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoadingComplete={() => setImageLoading(false)}
        />
      </div>
        <div className="ml-4 flex flex-col justify-center">
          <h1 className="text-[#242F5C] text-sm lg:text-lg md:text-base font-bold">John Doe</h1>
          <p className="text-green-600 lg:text-sm text-xs font-medium">Online</p>
        </div>
        <div className=" flex flex-row items-center justify-center lg:w-[10%] lg:h-[90%] md:w-[10%] md:h-[90%] w-[20%] h-[90%] absolute md:right-10 right-5 top-1 md:gap-3 gap-2">
          <Image src="./images/InviteGame.svg" alt="profile" width={50} height={50} className="lg:w-[40%] lg:h-[40%] md:w-[40%] md:h-[40%] w-[30%] h-[30%] cursor-pointer " />
          <Image src="./images/chat.svg" alt="profile" width={50} height={50} className="lg:w-[40%] lg:h-[40%] md:w-[40%] md:h-[40%] w-[30%] h-[30%] cursor-pointer" />
          <Image src="./images/BlockedFriends.svg" alt="profile" width={50} height={50} className="lg:w-[40%] lg:h-[40%] md:w-[40%] md:h-[40%] w-[30%] h-[30%] cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

export default FriendsList;
