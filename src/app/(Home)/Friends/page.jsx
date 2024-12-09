'use client'

import { Montserrat } from "next/font/google"
import { useState, useEffect, useContext } from "react"
import Image from "next/image"
import FriendsComponent from "./FriendsList"
import ScrollBlur from "./ScrollBlur"
import FriendRequests from "./FriendRequests.tsx"
import BlockedFriends from "./BlockedFriends.tsx"
import customAxios from "../../customAxios"
import { Loader2 } from 'lucide-react'
import { useWebSocket } from '../../contexts/WebSocketProvider';
import {IconForbid2} from '@tabler/icons-react'
import {IconUserExclamation} from '@tabler/icons-react'

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export default function Friends() {
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
  const [friendRequestsCount, setFriendRequestsCount] = useState(0);

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

  const {addHandler, removeHandler } = useWebSocket();

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
      try {
        const [friendsList, FriendRes , blockedRes] = await Promise.all([
          customAxios.get('http://127.0.0.1:8000/friend/friends'),
          customAxios.get('http://127.0.0.1:8000/friend/friend-request'),
          customAxios.get('http://127.0.0.1:8000/friend/blocked-friends'),
        ]);
        console.log("friendsList:",friendsList.data);
        console.log("FriendRes:",FriendRes.data);
        console.log("blockedRes:",blockedRes.data);
        setFriendsData(friendsList.data)
        setFriendRequestsData(FriendRes.data)
        setBlockedFriendsData(blockedRes.data)
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const handleWebSocketMessage = (data) => {
      if (!data || !data.type) {
        console.warn('Invalid WebSocket message received:', data);
        return;
      }

      try {
        switch (data.type) {
          case 'user_status':
            console.log('Received user_status update:', data);
            setFriendsData(prev => {
              const updatedFriends = prev.map(friend => {
                if (friend.user.id === data.id) {
                  console.log(`Updating status for friend ${friend.user.username} to ${data.is_on ? 'online' : 'offline'}`);
                  return {
                    ...friend,
                    user: {
                      ...friend.user,
                      is_on: data.is_on
                    }
                  };
                }
                return friend;
              });
              console.log('Updated friends data:', updatedFriends);
              return updatedFriends;
            });
            break;

          case 'friends_list_update':
            if (data.action === 'add') {
              // Add new friend to friends list
              setFriendsData(prev => [...prev, data.friend]);
              // Remove from friend requests if it exists
              setFriendRequestsData(prev => prev.filter(req => req.freindship_id !== data.friend.freindship_id));
            }
            break;

          // case 'friends-add':
          case 'friends_add':
            console.log('Friend request received:', data);
            setFriendRequestsCount(prev => prev + 1);
            // Add the new friend request to the list
            setFriendRequestsData(prev => [...prev, {
              freindship_id: data.freindship_id,
              user: data.user,
              is_accepted: false
            }]);
            break;

          case 'friend_request_sent':
            console.log('Friend request sent:', data);
            // Don't increment the count for sent requests
            break;

          case 'friends_accept':
            console.log('Friend request accepted:', data);
            // Update friend request count and data
            setFriendRequestsCount(prev => Math.max(0, prev - 1));
            setFriendRequestsData(prev => 
              prev.filter(req => req.freindship_id !== data.freindship_id)
            );
            break;

          case 'friend-rejected':
          case 'friend_rejected':
            console.log('Friend request rejected:', data);
            // Update friend request count and data
            setFriendRequestsCount(prev => Math.max(0, prev - 1));
            setFriendRequestsData(prev => 
              prev.filter(req => 
                !(req.user_from === data.user_from && req.user_to === data.user_to)
              )
            );
            break;

          case 'friends_remove_success':
            console.log('Friend request removed successfully:', data);
            // Update friend request data
            setFriendRequestsData(prev => 
              prev.filter(req => 
                req.freindship_id !== data.freindship_id
              )
            );
            break;

          case 'friends-block':
            console.log("reciiiiiiiiced");

            setFriendsData(prev => prev.filter(friend => 
              friend.freindship_id !== data.freindship_id
            ));
            console.log("Updated friendsData:", friendsData);
            setBlockedFriendsData(prev => [...prev, {
              freindship_id: data.freindship_id,
              user: data.user,
              is_accepted: true,
              blocked: true,
              is_user_from: data.is_user_from
            }]);
            console.log("Updated blockedFriendsData:", blockedFriendsData);
            break;

          case 'friends-unblock':
            console.log("reciiiiiiiiced");

            setBlockedFriendsData(prev => prev.filter(blocked => 
              blocked.freindship_id !== data.freindship_id
            ));
            console.log("Updated blockedFriendsData:", blockedFriendsData);
            break;

          default:
            console.warn('Unknown WebSocket message type:', data.type);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    };

    addHandler(handleWebSocketMessage);
    fetchData();

    return () => {
      removeHandler(handleWebSocketMessage);
    };
  }, [addHandler, removeHandler])

  useEffect(() => {
    const pendingRequests = friendRequestsData.filter(request => !request.is_accepted);
    setFriendRequestsCount(pendingRequests.length);
  }, [friendRequestsData]);

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
            <div className="flex w-[70%] h-[8%] flex-row justify-between items-center space-y-4 md:space-y-0 md:space-x-4 lg:space-x-8 xl:space-x-12 motion-preset-bounce">
              {navItems.map((item) => (
                <div key={item} className="relative">
                  <h1
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
                  {item === "Friend Requests" && friendRequestsCount > 0 && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">{friendRequestsCount}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-[10%] flex flex-row items-center content-center justify-around motion-preset-bounce">
              {navItemsIcons.map((item) => (
                <div key={item.name} className="relative">
                  <Image
                    src={activeIcon === item.activeImg ? item.activeImg : item.inactiveImg}
                    alt={item.name}
                    width={35}
                    height={35}
                    className="cursor-pointer transition-opacity duration-200 hover:opacity-80 w-[35px] h-[35px]"
                    onClick={() => { setActiveIcon(item.activeImg); setActiveItem(item.name); }}
                  />
                  {item.name === "Friend Requests" && friendRequestsCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">{friendRequestsCount}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="w-full h-full flex flex-col  space-y-7 overflow-y-auto scrollbar-hide custom-scrollbar motion-preset-expand  ">
            <ScrollBlur>
              {activeItem === "Friends List" && (
                <FriendsComponent friends={friendsData} />
              )}
              {activeItem === "Friend Requests" && (
                <div className="flex flex-col gap-4">
                  {friendRequestsData.length > 0 ? (
                    friendRequestsData.map((request) => (
                      <FriendRequests key={request.freindship_id} request={request} />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                      <IconUserExclamation className="w-16 h-16 text-gray-400" />
                      <p className="text-gray-500">No friend requests</p>
                    </div>
                  )}
                </div>
              )}
              {activeItem === "Blocked Friends" && (
                <div className="flex flex-col gap-4">
                  {blockedFriendsData.length > 0 ? (
                    blockedFriendsData.map((blocked) => (
                      <BlockedFriends key={blocked.friendship_id} blockedFriend={blocked} />
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                      <IconUserExclamation className="w-16 h-16 text-gray-400" />
                      <p className="text-gray-500">No blocked users</p>
                    </div>
                  )}
                </div>
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