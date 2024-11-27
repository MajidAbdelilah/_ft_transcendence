"use client"

import Image from "next/image"
import { Montserrat } from "next/font/google"
import { useState, useEffect } from "react"
import websocketService from '../../services/websocket'
import customAxios from '../../customAxios'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

interface FriendRequestProps {
  request: {
    freindship_id: number
    user: {
      id: number
      username: string
      profile_photo: string
      is_online: boolean
    }
    is_accepted: boolean
    blocked: boolean
    is_user_from: boolean
  }
}

export default function FriendRequests({ request }: FriendRequestProps) {
  const [isMobileRq, setIsMobileRq] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const handleAccept = async () => {
    try {
      await customAxios.post(`/api/friend-requests/accept`, { username: request.user.username })
      websocketService.send({
        type: 'friends-accept',
        freindship_id: request.freindship_id,
        user: request.user,
        is_user_from: request.is_user_from
      })
    } catch (error) {
      console.error('Error accepting friend request:', error)
    }
  }

  const handleReject = async () => {
    try {
      await customAxios.post(`/api/friend-requests/${request.freindship_id}/reject`)
      websocketService.send({
        type: 'friends-remove',
        freindship_id: request.freindship_id
      })
    } catch (error) {
      console.error('Error rejecting friend request:', error)
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
          <p className={`${request.user.is_online ? 'text-green-600' : 'text-gray-500'} lg:text-sm text-xs font-medium`}>
            {request.user.is_online ? 'Online' : 'Offline'}
          </p>
        </div>
        {!isMobileRq ? (
          <div className="flex flex-row items-center justify-end lg:w-[50%] lg:h-[90%] md:w-[10%] md:h-[90%] w-[20%] h-[90%] absolute md:right-10 right-5 top-1 md:gap-5 gap-2">
            <button
              onClick={handleAccept}
              className="
                bottom-2 right-[8%] 
                md:bottom-[7%] 
                lg:bottom-[5%] lg:right-[4%]
                text-base tracking-wide
                w-[100px] h-[40px]
                lg:w-[120px] lg:h-[60%]
                bg-[#242F5C] rounded-full cursor-pointer overflow-hidden 
                transition-all duration-500 ease-in-out shadow-md 
                hover:scale-105 hover:shadow-lg 
                before:absolute before:top-0 before:-left-full before:w-full before:h-full 
                before:bg-gradient-to-r before:from-[#242F5C] before:to-[#7C829D] 
                before:transition-all before:duration-500 before:ease-in-out before:z-[-1] 
                font-extrabold before:rounded-xl hover:before:left-0 text-[#fff]"
            >
              Accept
            </button>
            <button
              onClick={handleReject}
              className="
                bottom-2 right-[8%] 
                md:bottom-[7%] 
                lg:bottom-[5%] lg:right-[4%]
                text-base tracking-wide
                w-[100px] h-[40px]
                md:w-[100px] md:h-[40px]
                lg:w-[120px] lg:h-[60%]
                bg-[#242F5C] rounded-full cursor-pointer overflow-hidden 
                transition-all duration-500 ease-in-out shadow-md 
                hover:scale-105 hover:shadow-lg 
                before:absolute before:top-0 before:-left-full before:w-full before:h-full 
                before:bg-gradient-to-r before:from-[#242F5C] before:to-[#7C829D] 
                before:transition-all before:duration-500 before:ease-in-out before:z-[-1] 
                font-extrabold before:rounded-xl hover:before:left-0 text-[#fff]"
            >
              Reject
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
    </div>
  )
}