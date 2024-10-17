import { Inter, Montserrat } from "next/font/google";
import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaBarsStaggered } from "react-icons/fa6";
import { useClickAway } from "@uidotdev/usehooks";
import { motion } from "framer-motion";
import axios from "axios";
import authService from './authService';


const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: "-100%" },
};

// class UserData {
//   constructor(name = "", email = "", avatar = "") {
//     this.name = name;
//     this.email = email;
//     this.avatar = avatar;
//   }
// }



const logout = async () => {
  try {
    await authService.logout();
    // Handle successful logout (e.g., clear app state, redirect)
  } catch (error) {
    console.error('Logout failed', error);
  }
};


function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // const [userData, setUserData] = useState(new UserData());
  const [avatarLoading, setAvatarLoading] = useState(true);


  const sideRef = useClickAway(() => {
    setIsMobileMenuOpen(false);
  });

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

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await axios.get('http://127.0.0.1:5500/user.json');
  //       const data = await response.data;
  //       console.log(data);
  //       setUserData(new UserData(data.user, data.email, data.image));
  //     } catch (error) {
  //       console.error('Error fetching user data:', error);
  //     }
  //   };
  //   fetchUserData();
  // }, []);



  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  return (
    <div ref={sideRef} >
      {isMobile && (
        <button
          className="fixed top-8 left-3 z-50 text-2xl text-[#242F5C]"
          onClick={toggleMobileMenu}
        >
          <FaBarsStaggered />
        </button>
      )}
      <motion.div

        className={`${isMobile
            ? `fixed top-0 left-0 h-full w-64 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out z-40`
            : "w-64 h-full"
          } bg-[#F4F4FF] items-center flex justify-center  shadow-md shadow-[#BCBCC9] flex-col fixed top-0 z-[10] ${montserrat.className
          } `}
        animate={isMobile ? (isMobileMenuOpen ? "open" : "closed") : "open"}
        variants={variants}
        initial={isMobile ? "closed" : "open"}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {!isMobile && (
          <div className="flex items-center justify-center">
          <Image src="/images/logo.png" alt="Logo" width={120} height={100} className="w-[120px] h-[100px]" />
        </div>)
        }
        <ul className="flex flex-col gap-8 pt-20 h-[80%]">
          <li>
            <Link
              href="/Dashboard"
              className="flex items-center py-2 px-4 font-semibold rounded transition-transform duration-200 ease-in-out transform hover:scale-110 text-xl text-[#242F5C] cursor-pointer transition-colors"
            >
              <Image
                src="/images/dashboard.svg"
                alt="Dashboard"
                width={30}
                height={30}
                className="mr-3 w-[30px] h-[30px]"
              />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/Friends"
              className="flex items-center py-2 px-4 rounded font-semibold transition-transform duration-200 ease-in-out transform hover:scale-110 text-xl text-[#242F5C] cursor-pointer transition-colors"
            >
              <Image
                src="/images/friends.svg"
                alt="Friends"
                width={30}
                height={30}
                className="mr-3 w-[30px] h-[30px]"
              />
              Friends
            </Link>
          </li>
          <li>
            <a
              href="/Chat"
              className="flex items-center py-2 px-4 rounded font-semibold transition-transform duration-200 ease-in-out transform hover:scale-110 text-xl text-[#242F5C] cursor-pointer transition-colors"
            >
              <Image
                src="/images/chat.svg"
                alt="Chat"
                width={30}
                height={30}
                className="mr-3 w-[30px] h-[30px]"
              />
              Chat
            </a>
          </li>
          <li>
            <a
              href="/Game"
              className="flex items-center py-2 px-4 rounded font-semibold transition-transform duration-200 ease-in-out transform hover:scale-110 text-xl text-[#242F5C] cursor-pointer transition-colors"
            >
              <Image
                src="/images/game.svg"
                alt="Game"
                width={30}
                height={30}
                className="mr-3 w-[30px] h-[30px]"
              />
              Game
            </a>
          </li>
          <li>
            <a
              href="/Settings"
              className="flex items-center py-2 px-4 rounded font-semibold transition-transform duration-200 ease-in-out transform hover:scale-110 text-xl text-[#242F5C] cursor-pointer transition-colors"
            >
              <Image
                src="/images/settings.svg"
                alt="Settings"
                width={30}
                height={30}
                className="mr-3 w-[30px] h-[30px]"
              />
              Settings
            </a>
          </li>
        </ul>
        <div className="w-full  max-w-[100%] sm:mb-10 ">
          <hr className="border-[#242F5C] border-t-1 m-auto w-[80%]" />
          <div className="flex items-center justify-center mt-8 gap-4">
          <div className="relative w-14 h-14">
            {avatarLoading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full border-[#242F5C]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#242F5C]"></div>
              </div>
            )}
            <Image
              src="/images/avatarprofile.svg"
              alt="avatarprofile"
              width={50}
              height={50}
              className={`rounded-full object-cover w-14 h-14 border-[1px] border-transparent outline outline-2 outline-offset-2 outline-[#242F5C] transition-opacity duration-300 ${avatarLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={() => setAvatarLoading(false)}
            />
          </div>
            <div className="">
              <p className="text-center text-lg font-normal text-[#242F5C]">
                Abdellah
              </p>
              <p className="text-center text-[12px] mt-[-5px] font-light text-[#8988DE]  ">
                My Account
              </p>
            </div>
            <Image
              src="/images/logout.svg"
              alt="arrow"
              width={20}
              height={20}
              className="cursor-pointer w-[20px] h-[20px]"
              onClick={logout}
            />
            </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Sidebar;
