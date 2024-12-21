"use client";

import { useEffect, useState, useRef } from "react";
import Navbar from "./../Navbar";
import Sidebar from "./../sidebar.tsx";
import { UserProvider, useUser } from '../contexts/UserContext';
import { WebSocketProvider } from '../contexts/WebSocketProvider';
import { GameInviteWebSocketProvider } from '../contexts/GameInviteWebSocket';
import { useRouter } from 'next/navigation';
import DashProvider from './Dashboard/Dashcontext';
import GameInvitationHandler from './Game/GameInvitationHandler';

function RootLayoutContent({ children }) {
  const [isMobile, setIsMobile] = useState(false); 
  const router = useRouter();
  const { userData } = useUser();
  const previousPathRef = useRef(null);

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

  const checkUserData = () => {
    // console.log("dkhaaaaal", userData);
    // console.log("userData  ::::::::::",userData);
    if (userData && userData.is_2fa === true) {
      if (userData.redirect_to === false) {
        // console.log("dkhaaaaal33333");
        setTimeout(() => { router.replace("/authLogin"); }, 1000);
        
        // router.replace("/authLogin");
      }
    }
  };

  useEffect(() => {
    if (router && router.pathname !== previousPathRef.current) {
      // console.log("dkhaaaaal22222");
      checkUserData();
    }
    previousPathRef.current = router.pathname;
  }, [router, router?.pathname]);

 

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <GameInvitationHandler />
      <div className="flex flex-1 overflow-y-auto flex-wrap">
        <Sidebar />
        <div className={`flex-1 flex flex-wrap items-center justify-center ${isMobile ? '' : 'ml-64'}`}>
          {children}
        </div>
      </div>
    </div>
  );
}
function RootLayout({ children }) {
  return (
    <UserProvider>
      <WebSocketProvider>
        <GameInviteWebSocketProvider>
          <DashProvider>
            <RootLayoutContent>{children}</RootLayoutContent>
          </DashProvider>
        </GameInviteWebSocketProvider>
      </WebSocketProvider>
    </UserProvider>
  );
}

export default RootLayout;