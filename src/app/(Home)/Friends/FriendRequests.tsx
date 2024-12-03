"use client"

import Image from "next/image"
import { Montserrat } from "next/font/google"
import { useState, useEffect } from "react"
import customAxios from '../../customAxios'
import { useWebSocket } from '../../contexts/WebSocketProvider';
import {IconUserExclamation} from '@tabler/icons-react'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

interface FriendRequestProps {
  request: {
    user: {
      id: number;
      username: string;
      profile_photo: string;
      is_on: boolean;
    };
    friendship_id: number;
    is_accepted: boolean;
    blocked: boolean;
    is_user_from: boolean;
  }
}

export default function FriendRequests({ request }: FriendRequestProps) {
  const [isMobileRq, setIsMobileRq] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState({
    accept: false,
    reject: false
  })
  const [error, setError] = useState<string | null>(null)
  const { send } = useWebSocket();

  const handleAccept = async () => {
    if (isLoading.accept) return;
    setError(null);
    setIsLoading(prev => ({ ...prev, accept: true }));
    try {
      await customAxios.post(`/api/friends/accept`, { 
        friendship_id: request.friendship_id 
      })
      send({
        type: 'friends-accept',
        friendship_id: request.friendship_id
      })
    } catch (error) {
      console.error('Error accepting friend request:', error)
      setError('Failed to accept friend request. Please try again.')
    } finally {
      setIsLoading(prev => ({ ...prev, accept: false }))
    }
  }

  const handleReject = async () => {
    if (isLoading.reject) return;
    setError(null);
    setIsLoading(prev => ({ ...prev, reject: true }));
    try {
      await customAxios.post(`/api/friends/reject`, {
        friendship_id: request.friendship_id
      })
      send({
        type: 'friends-reject',
        friendship_id: request.friendship_id
      })
    } catch (error) {
      console.error('Error rejecting friend request:', error)
      setError('Failed to reject friend request. Please try again.')
    } finally {
      setIsLoading(prev => ({ ...prev, reject: false }))
    }
  }

  useEffect(() => {
    const handleResize = () => {
      setIsMobileRq(window.innerWidth <= 1700)
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
      {!request ? (
        <div className="flex flex-col items-center justify-center h-full p-4">
          <IconUserExclamation size={50} className="mb-2 opacity-50" />
          <p className="text-[#7C829D] text-sm text-center">
            No pending friend requests
          </p>
        </div>
      ) : (
        <div className="flex items-center h-full p-2">
          <div className="flex flex-row items-center justify-center lg:w-[10%] lg:h-[90%] md:w-[10%] md:h-[90%] w-[20%] h-[90%]">
            <Image 
              priority 
              src={request.user.profile_photo} 
              alt={`${request.user.username}'s profile`} 
              width={50} 
              height={50} 
              className="lg:w-[90%] lg:h-[90%] md:w-[80%] md:h-[80%] w-[100%] h-[100%]" 
            />
          </div>
          <div className="ml-4 flex flex-col justify-center">
            <h2 className="text-[#242F5C] text-sm lg:text-lg md:text-base font-bold">{request.user.username}</h2>
            <p className={`${request.user.is_on ? 'text-green-600' : 'text-gray-500'} lg:text-sm text-xs font-medium`}>
              {request.user.is_on ? 'Online' : 'Offline'}
            </p>
          </div>
          {!isMobileRq ? (
            <div className="flex flex-row items-center justify-end lg:w-[50%] lg:h-[90%] md:w-[10%] md:h-[90%] w-[20%] h-[90%] absolute md:right-10 right-5 top-1 md:gap-5 gap-2">
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <button
                onClick={handleAccept}
                disabled={isLoading.accept || isLoading.reject}
                className={`
                  bottom-2 right-[8%] 
                  md:bottom-[7%] 
                  lg:bottom-[5%] lg:right-[4%]
                  text-base tracking-wide
                  bg-[#242F5C] text-white px-4 py-2 rounded-lg 
                  ${(isLoading.accept || isLoading.reject) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#1a2340]'}
                  transition-colors
                `}
              >
                {isLoading.accept ? 'Accepting...' : 'Accept'}
              </button>
              <button
                onClick={handleReject}
                disabled={isLoading.accept || isLoading.reject}
                className={`
                  bg-red-500 text-white px-4 py-2 rounded-lg 
                  ${(isLoading.accept || isLoading.reject) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'}
                  transition-colors
                `}
              >
                {isLoading.reject ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-end lg:w-[20%] lg:h-[90%] md:w-[20%] md:h-[90%] w-[20%] h-[90%] absolute md:right-4 right-5 top-1 md:gap-5 gap-5">
              <button onClick={handleAccept} aria-label={`Accept friend request from ${request.user.username}`}>
                <Image src="/images/Accept.svg" alt="Accept" width={50} height={50} className="lg:w-[32%] lg:h-[32%] md:w-[40%] md:h-[40%] w-[30%] h-[30%] cursor-pointer" />
              </button>
              <button onClick={handleReject} aria-label={`Reject friend request from ${request.user.username}`}>
                <Image src="/images/Reject.svg" alt="Reject" width={50} height={50} className="lg:w-[32%] lg:h-[32%] md:w-[40%] md:h-[40%] w-[30%] h-[30%] cursor-pointer" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}