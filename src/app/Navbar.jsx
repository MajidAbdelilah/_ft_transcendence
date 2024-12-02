"use client";
import Image from "next/image";
import { useClickAway } from "@uidotdev/usehooks";
import { Montserrat } from "next/font/google";
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
import authService from "./authService";
import websocketService from './services/websocket';

//----------------------------------------------
import axios from "axios";
import { showAlert } from "./components/utils";
import { useRouter } from 'next/navigation';
import { useUser } from './UserContext.tsx';
import { Skeleton}  from "../compo/ui/Skeleton";
import NotificationDropdown from './components/NotificationDropdown';

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
  const router = useRouter();

  const [userDropdown, setUserDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [notificationDropdown, setNotificationDropdown] = useState(false);

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

  useEffect(() => {
    const handleWebSocketMessage = (data) => {
      if (!data || !data.type) return;

      try {
        switch (data.type) {
          case 'friends-add':
            setNotifications(prev => [{
              id: data.freindship_id,
              type: 'friend_request',
              avatar: data.user.profile_photo,
              message: `${data.user.username} sent you a friend request`,
              timestamp: new Date().toISOString(),
              isNew: true
            }, ...prev]);
            setNotificationCount(prev => prev + 1);
            break;

          case 'friends-accept':
            setNotifications(prev => [{
              id: data.freindship_id,
              type: 'friend_accept',
              avatar: data.user.profile_photo,
              message: `${data.user.username} accepted your friend request`,
              timestamp: new Date().toISOString(),
              isNew: true
            }, ...prev]);
            setNotificationCount(prev => prev + 1);
            break;
        }
      } catch (error) {
        console.error('Error handling notification:', error);
      }
    };

    websocketService.addHandler(handleWebSocketMessage);

    return () => {
      websocketService.removeHandler(handleWebSocketMessage);
    };
  }, []);

  const handleNotificationClick = (notification) => {
    // Just mark as not new and update the count
    setNotifications(prev => prev.map(n => 
      n.id === notification.id 
        ? { ...n, isNew: false }
        : n
    ));
    setNotificationCount(prev => Math.max(0, prev - 1));
  };

  const toggleNotificationDropdown = () => {
    setNotificationDropdown(!notificationDropdown);
  };

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

  const inputRef = useRef(null); // Create a ref for the input

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

        <div 
          className="cursor-pointer relative flex items-center justify-center sm:w-12 sm:h-12 w-10 h-10" 
          onClick={toggleNotificationDropdown}
        >
          <Image
            src="/images/notification.svg"
            alt="notification"
            width={24}
            height={24}
            className="sm:w-8 sm:h-8 w-6 h-6"
          />
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full sm:w-6 sm:h-6 w-5 h-5 flex items-center justify-center sm:text-xs text-[10px]">
              {notificationCount}
            </span>
          )}
        </div>
        {notificationDropdown && (
          <NotificationDropdown 
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
          />
        )}
        <div ref={userDropdownRef}>
          <div
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
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
