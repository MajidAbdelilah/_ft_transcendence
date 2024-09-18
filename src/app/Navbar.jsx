import Image from 'next/image';
import { useClickAway, } from "@uidotdev/usehooks";
import { Montserrat } from "next/font/google";
import { useState } from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});


function Navbar() {

    const [userDropdown, setUserDropdown] = useState(false);
    const [notificationDropdown, setNotificationDropdown] = useState(false);
    const userDropdownRef = useClickAway(() => {
        setUserDropdown(false);
      });
    
      const notificationDropdownRef = useClickAway(() => {
        setNotificationDropdown(false);
      });

    return (
        <nav
            className={`bg-[#F4F4FF] py-4 h-[90px] flex items-center shadow-md shadow-[#BCBCC9] ${montserrat.className}`}
      >
        <div className="flex justify-end flex-auto sm:gap-5 gap-3 sm:mr-10 ml-5">
          <div className="relative">
            <div
              className="p-5 overflow-hidden w-[20px] h-[20px] sm:w-[50px] sm:h-[50px] focus-within:w-[150px] sm:hover:w-[257px] bg-[#CDCDE5] shadow-md rounded-full flex group items-center hover:duration-300 duration-300"
            >
              <div className="flex items-center justify-center fill-[#242F5C] absolute left-0 w-[50px] sm:pr-0 pr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="Isolation_Mode"
                  data-name="Isolation Mode"
                  viewBox="0 0 24 24"
                  width="22"
                  height="22"
                >
                  <path
                    d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z"
                  ></path>
                </svg>
              </div>
              <input
                type="text"
                className="outline-none text-[15px] sm:text-[20px] bg-transparent w-full text-[#242F5C] font-normal pl-[50px] pr-4"
              />
            </div>

          </div>
          <div>
            <Image
              onClick={() => setNotificationDropdown(!notificationDropdown)}
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
              dropdown-toggle="userDropdown"
              dropdown-placement="bottom-start"
              className="sm:w-10 sm:h-10 w-8 h-8 rounded-full cursor-pointer "
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
            {userDropdown && (
              <div ref={userDropdownRef} className="w-[200px] h-[200px] bg-[#EAEAFF] absolute bottom-[-210px] right-[3px] z-[10] rounded-[5px]"></div>
            )}
            {notificationDropdown && (
              <div ref={notificationDropdownRef} className="w-[400px] h-[200px] bg-[#EAEAFF] absolute bottom-[-210px] right-[70px] z-[10] rounded-[5px]"></div>
            )}
          </div>
        </div>
      </nav>
    );
}
  
export default Navbar;
