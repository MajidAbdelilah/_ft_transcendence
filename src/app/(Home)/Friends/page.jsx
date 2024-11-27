'use client'

import { Montserrat } from "next/font/google"
import { useState, useEffect } from "react"
import Image from "next/image"
import FriendsComponent from "./FriendsList"
import ScrollBlur from "./ScrollBlur"
import FriendRequests from "./FriendRequests.tsx"
import BlockedFriends from "./BlockedFriends.tsx"
import customAxios from "../../customAxios"
import { Loader2 } from 'lucide-react'
import websocketService from '../../services/websocket'

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

function Friends() {
  const [isMobile, setIsMobile] = useState(false)
  const [activeItem, setActiveItem] = useState("Friends List")
  const [navItems] = useState([
    "Friends List",
    "Friend Requests",
    "Blocked Friends",
  ])
  const [friendsData, setFriendsData] = useState([])
  const [friendRequestsData, setFriendRequestsData] = useState([])
  const [blockedFriendsData, setBlockedFriendsData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const navItemsIcons = [
    {
      name: "Friends List",
      activeImg: "/images/FriendList.svg",
      inactiveImg: "/images/inactiveFriendList.svg",
    },
    {
      name: "Friend Requests",
      activeImg: "/images/FriendRequest.svg",
      inactiveImg: "/images/inactiveFriendRequest.svg",
    },
    {
      name: "Blocked Friends",
      activeImg: "/images/BlockedFriends.svg",
      inactiveImg: "/images/inactiveBlockedFriends.svg",
    },
  ]
  const [activeIcon, setActiveIcon] = useState(navItemsIcons[0].activeImg)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1698)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [friendsRes, requestsRes, blockedRes] = await Promise.all([
          customAxios.get('/api/friends'),
          customAxios.get('/api/friend-requests'),
          customAxios.get('/api/blocked-friends')
        ]);

        setFriendsData(friendsRes.data)
        setFriendRequestsData(requestsRes.data)
        setBlockedFriendsData(blockedRes.data)
      } catch (error) {
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    const handleWebSocketMessage = (data) => {
      switch (data.type) {
        case 'friends':
          setFriendsData(prev => 
            prev.map(friend => 
              friend.id === data.userId 
                ? { ...friend, status: data.status }
                : friend
            )
          )
          break;

        case 'friends-add':
          setFriendRequestsData(prev => [...prev, data.request])
          break;

        case 'friends-accept':
          setFriendRequestsData(prev => 
            prev.filter(request => request.id !== data.requestId)
          )
          setFriendsData(prev => [...prev, data.newFriend])
          break;

        case 'friends-block':
          setFriendsData(prev => 
            prev.filter(friend => friend.id !== data.userId)
          )
          setBlockedFriendsData(prev => [...prev, data.blockedUser])
          break;

        case 'friends-unblock':
          setBlockedFriendsData(prev => 
            prev.filter(blocked => blocked.id !== data.userId)
          )
          break;
      }
    }

    websocketService.connect();
    websocketService.addHandler(handleWebSocketMessage);

    // Fetch initial data
    fetchData();

    // Cleanup: remove message handler when component unmounts
    return () => {
      websocketService.removeHandler(handleWebSocketMessage);
    }
  }, [])

  if (isLoading) {
    return <LoadingSpinner/>
  }

  if (error) {
    return <div className="flex items-center justify-center h-full text-red-500">Error: {error}</div>
  }

  return (
    <div className={`flex-1 overflow-y-auto flex flex-wrap items-center justify-center h-full ${isMobile ? '' : 'p-4'}`}>
      <div
        className={`${isMobile ? 'w-full mt-4' : 'rounded-3xl border-solid border-[#BCBCC9] bg-[#F4F4FF] rounded-3xl border-[#BCBCC9] bg-[#F4F4FF]'} flex flex-col shadow-lg shadow-[#BCBCC9] items-center 
            md:w-[90%] h-[80vh] sm:h-[80vh] bg-[#F4F4FF] justify-center p-4`}
      >
        <div className="w-full p-2 max-w-[1300px] h-full mt-2 md:mt-2 lg:mt-5 flex flex-col items-center justify-center space-y-8">
          <h1 className="text-3xl lg:text-5xl md:text-3xl font-extrabold content-center tracking-wide text-[#242F5C] motion-preset-fade ">
            FRIENDS
          </h1>
          <hr className="lg:w-[50%] lg:h-[3px] md:w-[40%] md:h-[3px] w-[65%] h-[3px] bg-[#CDCDE5] border-none rounded-full" />
          {!isMobile ? (
            <div className="flex w-[70%] h-[8%] flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 lg:space-x-8 xl:space-x-12 motion-preset-bounce  ">
              {navItems.map((item) => (
                <h1
                  key={item}
                  className={`
                      md:text-sm lg:text-3xl
                      font-extrabold tracking-wide text-center cursor-pointer
                      transition-colors duration-200
                      ${activeItem === item
                      ? "text-[#242F5C]"
                      : "text-[#A7ACBE]"
                    }
                    `}
                  onClick={() => setActiveItem(item)}
                >
                  {item}
                </h1>
              ))}
            </div>
          ) : (
            <div className="w-full h-[10%] flex flex-row items-center content-center justify-around motion-preset-bounce  ">
              {navItemsIcons.map((item) => (
                <Image
                  key={item.name}
                  src={
                    activeIcon === item.activeImg
                      ? item.activeImg
                      : item.inactiveImg
                  }
                  alt={item.name}
                  width={35}
                  height={35}
                  className="cursor-pointer transition-opacity duration-200 hover:opacity-80 w-[35px] h-[35px]"
                  onClick={() => { setActiveIcon(item.activeImg); setActiveItem(item.name); }}
                />
              ))}
            </div>
          )}
          <div className="w-full h-full flex flex-col space-y-7 overflow-y-auto scrollbar-hide custom-scrollbar motion-preset-expand  ">
            <ScrollBlur>
              {activeItem === "Friends List" && (
                <FriendsComponent friends={friendsData} />
              )}
              {activeItem === "Friend Requests" && (
                friendRequestsData.map((request, index) => (
                  <FriendRequests key={index} request={request} />
                ))
              )}
              {activeItem === "Blocked Friends" && (
                blockedFriendsData.map((blockedFriend, index) => (
                  <BlockedFriends key={index} blockedFriend={blockedFriend} />
                ))
              )}
            </ScrollBlur>
          </div>
        </div>
      </div>
    </div>
  )
}

export function LoadingSpinner() {
  return (
      <Loader2 className="w-8 h-8 text-[#242F5C]" />
  )
}

export default Friends