"use client";

import { useEffect, useState } from "react";
import Navbar from "./../Navbar";
import Sidebar from "./../sidebar";
import { Montserrat } from "next/font/google";





const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
  });
  

export default function RootLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false); // You might want to implement actual mobile detection

  

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize)
    };
  }, []);

    return (
        <div className={`flex flex-col h-screen ${montserrat.className}`}>
        <Navbar />
        <div className="flex flex-1 overflow-y-auto flex-wrap">
          <Sidebar />
          <div className={`flex-1 overflow-y-auto flex flex-wrap items-center justify-center ${isMobile ? '' : 'ml-64'}`}>
            {children}
          </div>
        </div>
      </div>
    );
}
