"use client";

import { useEffect, useState } from "react";
import Navbar from "./../Navbar";
import Sidebar from "./../sidebar.tsx";
import { UserProvider } from '../contexts/UserContext';
import { WebSocketProvider } from '../contexts/WebSocketProvider';
import { GameInviteWebSocketProvider } from '../contexts/GameInviteWebSocket';
import { useRouter } from 'next/navigation';
import DashProvider from './Dashboard/Dashcontext';
import GameInvitationHandler from './Game/GameInvitationHandler';

function RootLayout({ children }) {
  const [isMobile, setIsMobile] = useState(false); 

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



  // useEffect(() => {
  //  if(userData._2fa_enable == true){
  //     if(userData.redirect_to == true)
  //       router.replace("/Dashboard");
  //     else
  //       router.replace("/authLogin");
  //  }
  // }, []);

  return (
    <UserProvider>
      <WebSocketProvider>
        <GameInviteWebSocketProvider>
          <DashProvider>
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
          </DashProvider>
        </GameInviteWebSocketProvider>
      </WebSocketProvider>
    </UserProvider>
  );
}

export default RootLayout;
