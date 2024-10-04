import { Inter, Montserrat } from "next/font/google";
import Image from "next/image";
import { FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaBarsStaggered } from "react-icons/fa6";
import { useClickAway } from "@uidotdev/usehooks";
import { useRef } from "react";
import { motion } from "framer-motion";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: "-100%" },
};

function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
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
          } bg-[#F4F4FF] p-8 flex justify-between shadow-md shadow-[#BCBCC9] flex-col  ${montserrat.className
          } `}
        animate={isMobile ? (isMobileMenuOpen ? "open" : "closed") : "open"}
        variants={variants}
        initial={isMobile ? "closed" : "open"}
        transition={{ duration: 0.3, ease: "easeInOut" }}


      >

        <ul className="flex flex-col gap-8 sm:mt-5 mt-10 pt-12 h-[80%]">
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
                className="mr-3"
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
                className="mr-3"
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
                className="mr-3"
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
                className="mr-3"
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
                className="mr-3"
              />
              Settings
            </a>
          </li>
        </ul>
        <div className="w-full sm:pb-40 max-w-[100%] mx-auto relative pb-20">
          <hr className="border-[#242F5C] border-t-1" />
          <Image
            src="/images/avatarprofile.svg"
            alt="avatarprofile"
            width={50}
            height={50}
            className="mx-auto pt-9 left-5 absolute left-[-7px]"
          />
          <p className="text-center text-lg font-normal text-[#242F5C] pt-10 absolute left-12 ">
            John Doe
          </p>
          <p className="text-center text-[12px] font-light text-[#8988DE] pt-10 absolute left-12 top-6 ">
            My Account
          </p>
          <Image
            src="/images/logout.svg"
            alt="arrow"
            width={20}
            height={20}
            className="mx-auto pt-10 absolute right-[12px] top-2 cursor-pointer"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default Sidebar;
