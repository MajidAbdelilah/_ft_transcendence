"use client";

import { useEffect, useState } from "react";
import Navbar from "./../Navbar";
import Sidebar from "./../sidebar.tsx";
import { Montserrat } from "next/font/google";
import { UserProvider } from '../contexts/UserContext';
import { WebSocketProvider } from '../contexts/WebSocketProvider';
import { useRouter } from 'next/navigation';

const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
});

function RootLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false); 
  const router = useRouter();

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
    <UserProvider>
      <WebSocketProvider>
        <div className={`flex flex-col h-screen ${montserrat.className}`}>
          <Navbar />
          <div className="flex flex-1 overflow-y-auto flex-wrap">
            <Sidebar />
            <div className={`flex-1 flex flex-wrap items-center justify-center ${isMobile ? '' : 'ml-64'}`}>
              {children}
            </div>
          </div>
        </div>
      </WebSocketProvider>
    </UserProvider>
  );
}

export default RootLayout;
