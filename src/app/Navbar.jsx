'use client';
import Image from "next/image";
import { useClickAway } from "@uidotdev/usehooks";
import { Montserrat } from "next/font/google";
import { useState, useRef, useEffect } from "react";



const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const LogoutProfile = () => {
  return (
    <div className="flex flex-row items-center m-3 justify-content relative gap-2 cursor-pointer">
      <Image src="/images/logout.svg" alt="profile" width={50} height={50} className="w-[18px] h-[18px]" />
      <h1 className="text-base font-medium text-[#242F5C]">Log Out</h1>
    </div>
  );
}

const GameStats = () => {
  return (
    <div className="flex flex-row items-center m-3 justify-content relative gap-2 cursor-pointer">
      <Image src="/images/Stats.svg" alt="profile" width={50} height={50} className="w-[18px] h-[18px]" />
      <h1 className="text-base font-medium text-[#242F5C]">Games Statistics</h1>
    </div>
  );
}

const ProfileSetting = () => {
  return (
    <div className="flex flex-row items-center m-3 justify-content relative gap-2 cursor-pointer">
      <Image src="/images/settings.svg" alt="profile" width={50} height={50} className="w-[18px] h-[18px]" />
      <h1 className="text-base font-medium text-[#242F5C]">Account Settings</h1>
    </div>
  );
}

const ProfileInfo = () => {
  return (
    <div className="flex flex-row items-center m-3 justify-content relative gap-2 cursor-pointer">
      <Image src="/images/avatarAcc.svg" alt="profile" width={50} height={50} className="w-[18px] h-[18px]" />
      <h1 className="text-base font-medium text-[#242F5C]">View Profile</h1>
    </div>
  );
}

function Navbar() {

  const [userDropdown, setUserDropdown] = useState(false);
  const [notificationDropdown, setNotificationDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);


  const userDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  
  useClickAway(userDropdownRef, () => {
    setUserDropdown(false);
  });
  
  useClickAway(notificationDropdownRef, () => {
    setNotificationDropdown(false);
  });

  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    setUserDropdown(prev => !prev);
    setNotificationDropdown(false);
  };
  
  const toggleNotificationDropdown = (e) => {
    e.stopPropagation();
    setNotificationDropdown(prev => !prev);
    setUserDropdown(false);
  };

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
    <nav
      className={`bg-[#F4F4FF] py-4 h-[90px] flex items-center shadow-md shadow-[#BCBCC9] ${montserrat.className}`}
    >
      {!isMobile &&
        <div className="flex items-center pl-[70px]">
          <Image src="/images/logo.svg" alt="Logo" width={100} height={100} className="w-[110px] h-[110px]" />
        </div>
      }
      <div className="flex justify-end flex-auto sm:gap-5 gap-3 sm:mr-10">
      <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="sm:py-3 shadow-sm shadow-[#BCBCC9] sm:w-[280px] py-[8px] w-[200px]  pl-[2.5rem] rounded-full bg-[#D7D7EA] text-[#242F5C] focus:outline-none focus:ring-2 focus:ring-[#3CDCDE5]"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 op h-5 w-5 text-gray-400"
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
        <div ref={notificationDropdownRef}>
          <Image
            onClick={toggleNotificationDropdown}
            className="sm:w-8 sm:h-8 w-7 h-7 flex items-center justify-center sm:ml-5 mt-2 ml-2 cursor-pointer"
            src="/images/notification.svg"
            alt="Notification"
            width="20"
            height="20"
          />
        </div>
        <div ref={userDropdownRef}
          className="flex items-center justify-center sm:w-12 sm:h-12 w-10 h-10 rounded-full bg-white text-white relative mr-2"
          onClick={toggleUserDropdown}
        >
          <Image
            id="avatarButton"
            type="button"
            dropdown-toggle="userDropdown"
            dropdown-placement="bottom-start"
            className="sm:w-10 sm:h-10 w-8 h-8 rounded-full bg-[#D7D7EA] cursor-pointer"
            src="/images/avatar.svg"
            alt="User dropdown"
            width="100"
            height="100"
          />
          <Image
            type="button"
            dropdown-toggle="userDropdown"
            dropdown-placement="bottom-start"
            className="w-4 h-8 cursor-pointer absolute bottom-[-10px] right-0"
            src="/images/Frame21.svg"
            alt="User dropdown"
            width="50"
            height="50"
          />
          {userDropdown &&(
            <div
              className="w-[220px] h-[230px] bg-[#EAEAFF] border-2 border-solid border-[#C0C7E0] absolute bottom-[-232px] right-[3px] z-[10] rounded-[5px] shadow shadow-[#BCBCC9]"
            >
              <h1 className="text-lg font-medium text-[#242F5C] p-4">My Account</h1>
              <hr className="w-[100%] h-[1px] bg-[#CDCDE5] border-none rounded-full" />
              <ProfileInfo />
              <ProfileSetting />
              <GameStats />
              <hr className="w-[100%] h-[1px] bg-[#CDCDE5] border-none rounded-full" />
              <LogoutProfile />
            </div>
          )}
          {notificationDropdown && (
            <div
              className="w-[400px] h-[200px] bg-[#EAEAFF] absolute bottom-[-210px] right-[70px] z-[10] rounded-[5px] border-2 border-solid border-[#C0C7E0] shadow shadow-[#BCBCC9]"
            ></div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
