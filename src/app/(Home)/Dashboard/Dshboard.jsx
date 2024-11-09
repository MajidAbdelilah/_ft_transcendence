"use client";

import { useEffect } from "react";
import { DashContext } from "./Dashcontext";
import { useContext } from "react";
import Achievements from "./Achievements";
import MatchHistory from "./MatchHistory";
import PlayNow from "./PlayNow";
import Link from "next/link";
import withAuth from "../../HOC.tsx";




function Dashboard() {
  const DashData = useContext(DashContext);

  useEffect(() => {
    const handleResize = () => {
      DashData.setIsMobile(window.innerWidth <= 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
  }, [DashData]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        DashData.setIsScrolled(true);
      } else {
        DashData.setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (

    <div className="flex-1 overflow-y-auto p-4 flex flex-wrap items-center justify-center h-full">
      <PlayNow />
      <Achievements />
      <MatchHistory />
      <Link href="/">
        <button type="button" className="text-white bg-[#111B47] hover:bg-[#0e1739] hover:ring-4 focus:ring-[#1d2f7a] font-bold rounded-full text-xs h-[45px] w-[80px] sm:text-lg sm:h-[70px] sm:w-[180px] text-center me-2 mb-2 transition duration-300 ease-in-out shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] border-solid border-b-4 border-gray-600">Dashboard</button>
      </Link>
    </div>
  );
}

export default withAuth(Dashboard);
