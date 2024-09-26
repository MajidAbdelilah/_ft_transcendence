"use client";

import { useEffect } from "react";
import { DashContext } from "./Dashcontext";
import { useContext } from "react";
import Achievements from "./Achievements";
import MatchHistory from "./MatchHistory";
import PlayNow from "./PlayNow";
import Navbar from "../Navbar";
import Sidebar from "../sidebar";

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
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-y-auto flex-wrap">
        <Sidebar />
        <div className="flex-1 overflow-y-auto p-4 flex flex-wrap items-center justify-center h-full">
          <PlayNow />
          <Achievements />
          <MatchHistory />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
