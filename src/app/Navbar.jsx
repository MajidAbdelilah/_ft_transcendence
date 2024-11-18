"use client";
import Image from "next/image";
import { useClickAway } from "@uidotdev/usehooks";
import { Montserrat } from "next/font/google";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
// import authService from './authService';
import { IoIosSearch } from "react-icons/io";
import authService from "./authService";

//----------------------------------------------
import axios from "axios";
import { showAlert } from "./components/utils";
import { useRouter } from 'next/navigation';
import { useUser } from './UserContext.tsx';
import { Skeleton}  from "../compo/ui/Skeleton";











const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

const logout = async ({ setUserData }) => {

  try {
    const response = await authService.logout();
    if (response.status !== 200) {
      throw new Error('Logout failed');
    }
    
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    setUserData(null);
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const LogoutProfile = ({ setUserData }) => {
  return (
    <div
      className="flex flex-row items-center m-3 justify-content relative gap-2 cursor-pointer"
      onClick={() => logout({ setUserData })}
    >
      <Image
        src="/images/logout.svg"
        alt="profile"
        width={50}
        height={50}
        className="w-[18px] h-[18px]"
      />
      <h1 className="text-base font-medium text-[#242F5C]">Log Out</h1>
    </div>
  );
};

const ProfileSetting = () => {
  return (
    <Link href="/Settings">
      <div className="flex flex-row items-center m-3 justify-content relative gap-2 cursor-pointer">
        <Image
          src="/images/settings.svg"
          alt="profile"
          width={50}
          height={50}
          className="w-[18px] h-[18px]"
        />
        <h1 className="text-base font-medium text-[#242F5C]">
          Account Settings
        </h1>
      </div>
    </Link>
  );
};

const ProfileInfo = ({onClick}) => {
  return (
    <div className="flex flex-row items-center m-3 justify-content relative gap-2 cursor-pointer" onClick={onClick}>
      <Image
        src="/images/avatarAcc.svg"
        alt="profile"
        width={50}
        height={50}
        className="w-[18px] h-[18px]"
      />
      <h1 className="text-base font-medium text-[#242F5C]">View Profile</h1>
    </div>
  );
};






function Navbar() {
  const { userData, isLoading, setUserData } = useUser();


  const [userDropdown, setUserDropdown] = useState(false);
  const [notificationDropdown, setNotificationDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const userDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);

  useClickAway([userDropdownRef], () => {
    setUserDropdown(false);
  });

  useClickAway([notificationDropdownRef], () => {
    setNotificationDropdown(false);
  });

  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    setUserDropdown((prev) => !prev);
    setNotificationDropdown(false);
  };

  const toggleNotificationDropdown = (e) => {
    e.stopPropagation();
    setNotificationDropdown((prev) => !prev);
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
    // loggedInUser -----------------------------------------------------------------------------------

    let UserId = 1; // Assume this is the logged-in user's ID
    let [loggedInUser, setLoggedInUser] = useState(null);
    // if (!loggedInUser) return null;

    useEffect(() =>  {
      async function fetchLoggedInUser() {
        const response = await axios.get("/profile.json");
        const users = response.data;
  
        // find the loggedInUser
        const usr = users.find((user) => user.userId === UserId);
        // console.log("LoggedInUser : ",usr);
        setLoggedInUser(usr);
      }
      fetchLoggedInUser()
    }, [])

  // ---------------------------------------------------------------------------------------------
  const inputRef = useRef(null); // Create a ref for the input
  const router = useRouter();
  const handleSearch = async (e) => {
    if (e.type === "click" || e.code === "Enter") {
      const searchTerm = inputRef.current.value;

      if (searchTerm.trim() !== "") {
        
        const response = await axios.get("/users.json");
        // console.log(response.data);

        const users = response.data;
        // Check if the username exists
        const userExists = users.some((user) => user.username === searchTerm);

        if (userExists) {
          // console.log("User exist"); // Display message if user exists
          router.push(`/Profile/${searchTerm}`)
        } else {
          showAlert("User does not exist");
        }

        inputRef.current.value = ""; // Clear the input after logging
      }
    }
  };

  return (
    <nav
      className={`bg-[#F4F4FF] py-4 h-[90px] flex items-center shadow-md shadow-[#BCBCC9] z-[9] ${montserrat.className}`}
    >
      <div className="flex justify-end flex-auto sm:gap-5 gap-3 sm:mr-10">
        {/* -------------------------------------------------------------------- */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="sm:py-3 shadow-sm shadow-[#BCBCC9] sm:w-[280px] py-[8px] w-[200px]  pl-[2.5rem] rounded-full bg-[#D7D7EA] text-[#242F5C] focus:outline-none focus:ring-2 focus:ring-[#3CDCDE5]"
            onKeyUp={handleSearch}
            ref={inputRef}
          />
          <IoIosSearch
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 "
            onClick={handleSearch}
          />
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
        <div
          ref={userDropdownRef}
          className="flex items-center justify-center sm:w-12 sm:h-12 w-10 h-10 rounded-full bg-white text-white relative mr-2"
          onClick={toggleUserDropdown}
        >
          {isLoading ? (
            <>
            <Skeleton className="sm:w-10 sm:h-10 w-8 h-8 rounded-full bg-[#d1daff]" />
          </>
          ) : (
          <Image
            id="avatarButton"
            className="sm:w-10 sm:h-10 w-8 h-8 rounded-full bg-[#D7D7EA] cursor-pointer rounded-full"
            src={userData?.avatar || "/images/avatar.svg"}
            alt="User dropdown"
            width={100}
            height={100}
            />
          )}
          <Image
            className="w-4 h-8 cursor-pointer absolute bottom-[-10px] right-0"
            src="/images/Frame21.svg"
            alt="User dropdown"
            width="50"
            height="50"
            />
         
          {userDropdown && (
            <motion.div
            className="w-[220px] h-[210px] bg-[#EAEAFF] border-2 border-solid border-[#C0C7E0] absolute bottom-[-215px] right-[3px] z-[10] rounded-[5px] shadow shadow-[#BCBCC9]"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 30
            }}
            >
              <h1 className="text-lg font-medium text-[#242F5C] p-4">
                My Account
              </h1>
              <hr className="w-[100%] h-[1px] bg-[#CDCDE5] border-none rounded-full" />
              
              <ProfileInfo onClick={() => router.push(`/Profile/${loggedInUser.userName}`)} />


              <ProfileSetting />
              <hr className="w-[100%] h-[1px] bg-[#CDCDE5] border-none rounded-full" />
              <LogoutProfile setUserData={setUserData} />
            </motion.div>
          )}
          {notificationDropdown && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 30,
              }}
              className="w-[250px]  sm:w-[400px]  bg-[#EAEAFF] opacity-[] absolute top-[55px] right-[70px] z-[10] rounded-[5px] border-2 border-solid border-[#C0C7E0] shadow shadow-[#BCBCC9] overflow-hidden"
            >
               <div className="max-h-[30vh] overflow-y-auto custom-scrollbar">
                <div className="flex flex-col items-center min-h-full">
                  <div className="sm:w-[95%] w-[98%] min-h-[80px] mt-[20px] bg-[#CDCDE5] rounded-xl flex gap-2 items-center pl-4">
                    <Image src="/images/avatarInvite.svg" alt="profile" width={50} height={50} className="w-[40px] h-[40px]" />
                    <h4 className="font-semibold text-xs sm:text-base text-[#242F5C]">Abdou sent you a friend request.</h4>
                    <Image src="/images/Notif.svg" alt="profile" width={50} height={50} className="w-[10px] h-[10px] cursor-pointer mr-2 sm:mr-0" />
                  </div>
                  <div className="sm:w-[95%] w-[98%] h-[70px] mt-[20px] bg-[#CDCDE5] rounded-xl flex gap-2 items-center pl-4">
                  <Image src="/images/avatarInvite.svg" alt="profile" width={50} height={50} className="w-[40px] h-[40px]" />
                    <h4 className="font-semibold text-xs sm:text-base text-[#242F5C]">Abdou sent you a friend request.</h4>
                    <Image src="/images/Notif.svg" alt="profile" width={50} height={50} className="w-[10px] h-[10px] cursor-pointer  mr-2 sm:mr-0" />
                  </div>
                  <div className="sm:w-[95%] w-[98%] h-[70px] mt-[20px] bg-[#CDCDE5] rounded-xl flex gap-2 items-center pl-4">
                  <Image src="/images/avatarInvite.svg" alt="profile" width={50} height={50} className="w-[40px] h-[40px]" />
                    <h4 className="font-semibold text-xs sm:text-base text-[#242F5C]">Abdou sent you a friend request.</h4>
                    <Image src="/images/Notif.svg" alt="profile" width={50} height={50} className="w-[10px] h-[10px] cursor-pointer  mr-2 sm:mr-0" />
                  </div>
                  <div className="sm:w-[95%] w-[98%] h-[70px] mt-[20px] bg-[#CDCDE5] rounded-xl flex gap-2 items-center pl-4">
                  <Image src="/images/avatarInvite.svg" alt="profile" width={50} height={50} className="w-[40px] h-[40px]" />
                    <h4 className="font-semibold text-xs sm:text-base text-[#242F5C]">Abdou sent you a friend request.</h4>
                    <Image src="/images/Notif.svg" alt="profile" width={50} height={50} className="w-[10px] h-[10px] cursor-pointer  mr-2 sm:mr-0" />
                  </div>
                  <div className="sm:w-[95%] w-[98%] h-[70px] mt-[20px] bg-[#CDCDE5] rounded-xl flex gap-2 items-center pl-4 mb-2">
                  <Image src="/images/avatarInvite.svg" alt="profile" width={50} height={50} className="w-[40px] h-[40px]" />
                    <h4 className="font-semibold text-xs sm:text-base text-[#242F5C]">Abdou sent you a friend request.</h4>
                    <Image src="/images/Notif.svg" alt="profile" width={50} height={50} className="w-[10px] h-[10px] cursor-pointer  mr-2 sm:mr-0" />
                  </div>
                  <div className="sm:w-[95%] w-[98%] h-[70px] mt-[20px] bg-[#CDCDE5] rounded-xl flex gap-2 items-center pl-4 mb-2">
                  <Image src="/images/avatarInvite.svg" alt="profile" width={50} height={50} className="w-[40px] h-[40px]" />
                    <h4 className="font-semibold text-xs sm:text-base text-[#242F5C]">Abdou sent you a friend request.</h4>
                    <Image src="/images/Notif.svg" alt="profile" width={50} height={50} className="w-[10px] h-[10px] cursor-pointer  mr-2 sm:mr-0" />
                  </div>
                  <div className="sm:w-[95%] w-[98%] h-[70px] mt-[20px] bg-[#CDCDE5] rounded-xl flex gap-2 items-center pl-4 mb-2">
                  <Image src="/images/avatarInvite.svg" alt="profile" width={50} height={50} className="w-[40px] h-[40px]" />
                    <h4 className="font-semibold text-xs sm:text-base text-[#242F5C]">Abdou sent you a friend request.</h4>
                    <Image src="/images/Notif.svg" alt="profile" width={50} height={50} className="w-[10px] h-[10px] cursor-pointer  mr-2 sm:mr-0" />
                  </div>

                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
