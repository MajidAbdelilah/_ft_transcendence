"use client";
import { Inter, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "./sidebar";
import { useState } from "react";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

function Dashboard() {
  const [userDropdown, setUserDropdown] = useState(false);
  const [notificationDropdown, setNotificationDropdown] = useState(false);
  return (
    <div className="flex flex-col h-screen">
      <nav
        className={`bg-[#F4F4FF] py-4 h-[90px] flex items-center ${montserrat.className}`}
      >
        <div className="flex justify-end flex-auto gap-5 mr-10">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="py-3 px-10 rounded-full bg-[#ECECEC] text-black focus:outline-none focus:ring-2 focus:ring-[#3CDCDE5]"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
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
              className="w-9 h-12 flex items-center justify-center ml-8 cursor-pointer"
              src="/images/notification.svg"
              alt="Notification"
              width="20"
              height="20"
            />
          </div>
          <div
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white text-white relative cursor-pointer"
            onClick={() => setUserDropdown(!userDropdown)}
          >
            <Image
              id="avatarButton"
              type="button"
              data-dropdown-toggle="userDropdown"
              data-dropdown-placement="bottom-start"
              className="w-10 h-10 rounded-full cursor-pointer"
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
      <Sidebar />
    </div>
  );
}

export default Dashboard;
