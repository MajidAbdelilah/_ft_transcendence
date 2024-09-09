"use client";
import { Inter, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "./sidebar";
import { useState, useEffect } from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

function Dashboard() {
  const [userDropdown, setUserDropdown] = useState(false);
  const [notificationDropdown, setNotificationDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
  }, []);
  return (
    <div className="flex flex-col h-screen">
      <nav
        className={`bg-[#F4F4FF] py-4 h-[90px] flex items-center ${montserrat.className}`}
      >
        <div className="flex justify-end flex-auto sm:gap-5 gap-3 sm:mr-10 ml-5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="sm:py-3 sm:w-[280px] py-[8px] w-[200px] pl-[2.5rem] rounded-full bg-[#ECECEC] text-black focus:outline-none focus:ring-2 focus:ring-[#3CDCDE5]"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <div>
            <Image onClick={() => setNotificationDropdown(!notificationDropdown)}
              className="sm:w-8 sm:h-8 w-7 h-7 flex items-center justify-center sm:ml-5 mt-2 ml-2 cursor-pointer"
              src="/images/notification.svg"
              alt="Notification"
              width="20"
              height="20"
            />
          </div>
          <div
            className="flex items-center justify-center sm:w-12 sm:h-12 w-10 h-10 rounded-full bg-white text-white relative mr-2 cursor-pointer"
            onClick={() => setUserDropdown(!userDropdown)}
          >
            <Image
              id="avatarButton"
              type="button"
              data-dropdown-toggle="userDropdown"
              data-dropdown-placement="bottom-start"
              className="sm:w-10 sm:h-10 w-8 h-8 rounded-full cursor-pointer"
              src="/images/avatar.svg"
              alt="User dropdown"
              width="100"
              height="100"
            />
            <Image
              type="button"
              data-dropdown-toggle="userDropdown"
              data-dropdown-placement="bottom-start"
              className="w-4 h-8 cursor-pointer absolute bottom-[-10px] right-0"
              src="/images/Frame21.svg"
              alt="User dropdown"
              width="50"
              height="50"
            />
            {userDropdown && (
              <div className="w-[200px] h-[200px] bg-[#EAEAFF] absolute bottom-[-210px] right-[3px] z-[10] rounded-[5px]"></div>
            )}
            {notificationDropdown && (
              <div className="w-[400px] h-[200px] bg-[#EAEAFF] absolute bottom-[-210px] right-[70px] z-[10] rounded-[5px]"></div>
            )}
          </div>
        </div>
      </nav>
      <div className="flex flex-1 overflow-hidden flex-wrap">
        <Sidebar />
        < div className="flex-1 overflow-y-auto p-4 flex flex-wrap justify-between">
            <div className={` ${!isMobile ? "bg-[#F4F4FF] drop-shadow-md border-2  rounded-3xl border-[#BCBCC9] mt-10 md:w-[70%] md:h-[48%] lg:w-[800px] lg:h-[500px] " : 'min-h-[235px]' } w-[90%] h-[25%] ml-[5%] relative p-4 flex flex-col justify-center items-center`}>
              <div className="w-full h-[80%] relative mb-4">
                <Image
                  src="/images/gamePic.svg"
                  alt="Game Image"
                  fill
                  className="object-contain rounded-xl"
                />
              </div>
              <button className="bg-[#242F5C] drop-shadow-lg text-[#E0E0FF] hover:bg-blue-700 font-extrabold md:py-2 md:px-4 lg:py-3 lg:px-5 py-2 px-4 text-sm rounded-3xl absolute md:bottom-[7%] lg:bottom-[5%] bottom-2 lg:right-[4%] right-[8%] transition-transform duration-300 ease-in-out transform hover:scale-110">
                PLAY NOW
              </button>
            </div>
          <div className={`${!isMobile ? "border-2 border-solid rounded-3xl border-[#BCBCC9] bg-[#F4F4FF] md:w-[70%] md:h-[48%] lg:w-[800px] lg:h-[500px] w-[90%] h-[48%] ml-[5%] mt-[50px] mr-[5%]" : "border-2 border-[#BCBCC9]/25 border-solid bg-[#F4F4FF]/75 rounded-3xl border-[#BCBCC9] bg-[#F4F4FF]md:w-[70%] md:h-[48%] lg:w-[800px] lg:h-[500px] w-[90%] h-[48%] ml-[5%] mt-[50px] mr-[5%]"}`}>
            <h1 className="text-[#444E74] h-[18%] font-black text-center pt-5 tracking-wider lg:text-4xl md:text-3xl text-2xl">ACHIEVEMENTS</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 justify-items-center  max-h-[80%] overflow-y-auto overflow-hidden custom-scrollbar">
              <div className="w-full aspect-square flex items-center justify-center">
                <Image src="/images/achvRockie.svg" alt="achvRockie" width={100} height={100} className="w-[80%] max-w-[80px] md:max-w-[90px] lg:max-w-[100px] object-contain" />
              </div>
              <div className="w-full aspect-square flex items-center justify-center">
                <Image src="/images/achvRockie.svg" alt="achvRockie" width={100} height={100} className="w-[80%] max-w-[80px] md:max-w-[90px] lg:max-w-[100px] object-contain" />
              </div>
              <div className="w-full aspect-square flex items-center justify-center">
                <Image src="/images/achvRockie.svg" alt="achvRockie" width={100} height={100} className="w-[80%] max-w-[80px] md:max-w-[90px] lg:max-w-[100px] object-contain" />
              </div>
              <div className="w-full aspect-square flex items-center justify-center">
                <Image src="/images/achvRockie.svg" alt="achvRockie" width={100} height={100} className="w-[80%] max-w-[80px] md:max-w-[90px] lg:max-w-[100px] object-contain" />
              </div>
              <div className="w-full aspect-square flex items-center justify-center">
                <Image src="/images/achvRockie.svg" alt="achvRockie" width={100} height={100} className="w-[80%] max-w-[80px] md:max-w-[90px] lg:max-w-[100px] object-contain" />
              </div>
              {/* Add more images as needed */}
            </div>
        </div>
          <div className="border-2 border-solid rounded-3xl border-[#BCBCC9] bg-[#F4F4FF] md:w-[70%] md:h-[48%] lg:w-full lg:h-[500px] w-[90%] h-[48%] ml-[5%] mt-[50px] mr-[5%]">

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
