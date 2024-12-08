"use client"

import Image from "next/image"
import { Montserrat } from "next/font/google"
import { useState, useEffect } from "react"
import customAxios from '../../customAxios'
import { useWebSocket } from '../../contexts/WebSocketProvider';
import {IconUserCancel} from '@tabler/icons-react'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

interface BlockedFriendProps {
  blockedFriend: {
    user: {
      id: number;
      username: string;
      is_on: number;
    };
    freindship_id: number;
    is_accepted: boolean;
    user_from: number;
    user_to: number;
    user_is_logged_in: number;
  }
}

export default function BlockedFriends({ blockedFriend }: BlockedFriendProps) {
  const [isMobile, setIsMobile] = useState(false)
  const { send } = useWebSocket();

  const handleUnblock = async () => {
    try {
      await customAxios.post(`/api/friends/unblock`, { 
        freindship_id: blockedFriend.freindship_id 
      })
      send({
        type: 'friends-unblock',
        freindship_id: blockedFriend.freindship_id
      })
    } catch (error) {
      console.error('Error unblocking friend:', error)
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className={`w-full mx-auto h-20 lg:h-[12%] md:h-[20%] mt-2 rounded-xl bg-[#D8D8F7] shadow-md shadow-[#BCBCC9] relative ${isMobile ? '' : ' min-h-[90px]'} ${montserrat.className}`}>
      <div className="flex items-center h-full p-2">
        <div className="flex flex-row items-center justify-center lg:w-[10%] lg:h-[90%] md:w-[10%] md:h-[90%] w-[20%] h-[90%]">
          <Image 
            priority 
            src="/images/default-avatar.png"
            alt={`${blockedFriend.user.username}'s profile`} 
            width={50} 
            height={50} 
            className="lg:w-[90%] lg:h-[90%] md:w-[80%] md:h-[80%] w-[100%] h-[100%] rounded-full" 
          />
        </div>
        <div className="ml-4 flex flex-col justify-center">
          <h2 className="text-[#242F5C] text-sm lg:text-lg md:text-base font-bold">{blockedFriend.user.username}</h2>
          <p className={`${blockedFriend.user.is_on === 1 ? 'text-green-600' : 'text-gray-500'} lg:text-sm text-xs font-medium`}>
            {blockedFriend.user.is_on === 1 ? 'Online' : 'Offline'}
          </p>
        </div>
        <div className="flex flex-row items-center justify-end lg:w-[50%] lg:h-[90%] md:w-[10%] md:h-[90%] w-[20%] h-[90%] absolute md:right-10 right-5 top-1 md:gap-5 gap-2">
          <button
            onClick={handleUnblock}
            className="bg-[#242F5C] rounded-[12px] text-white px-4 py-2 rounded-lg hover:bg-[#1a2340] transition-colors"
          >
            Unblock
          </button>
        </div>
      </div>
    </div>
  )
}