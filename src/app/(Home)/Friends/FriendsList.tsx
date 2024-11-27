'use client'

import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useState, useEffect } from "react";
import websocketService from '../../services/websocket';
import customAxios from '../../customAxios';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

interface FriendsListProps {
  friends: Friend[];
}

export default function FriendsList({ friends = [] }: FriendsListProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: string]: boolean }>({});

  const handleInviteGame = async (friendId: string, friendName: string) => {
    try {
      await customAxios.post(`/api/game/invite/${friendId}`);
      websocketService.send({
        type: 'GAME_INVITE',
        friendId,
        message: `Invited ${friendName} to a game`
      });
    } catch (error) {
      console.error('Error inviting friend to game:', error);
    }
  };

  const handleChat = async (friendId: string) => {
    try {
      await customAxios.post(`/api/chat/initiate/${friendId}`);
      websocketService.send({
        type: 'CHAT_INITIATE',
        friendId
      });
    } catch (error) {
      console.error('Error initiating chat:', error);
    }
  };

  const handleBlock = async (friendId: string) => {
    try {
      await customAxios.post(`http://127.0.0.1:8000/friend/friends-block`);
      websocketService.send({
        type: 'BLOCK_FRIEND',
        friendId
      });
    } catch (error) {
      console.error('Error blocking friend:', error);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleImageLoad = (friendId: string) => {
    setImageLoadingStates(prev => ({ ...prev, [friendId]: false }));
  };

  return (
    <div className={`w-full mx-auto space-y-2 ${montserrat.className}`}>
      {friends.map((friend) => (
        <div key={friend.id} className={`w-full h-20 lg:h-[12%] md:h-[20%] rounded-xl bg-[#D8D8F7] shadow-md shadow-[#BCBCC9] relative ${isMobile ? 'w-full' : 'min-h-[90px]'}`}>
          <div className="flex items-center h-full p-2">
            <div className="flex flex-row items-center justify-center lg:w-[10%] lg:h-[90%] md:w-[10%] md:h-[90%] w-[20%] h-[90%] relative">
              {imageLoadingStates[friend.id] !== false && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#242F5C]"></div>
                </div>
              )}
              <Image 
                priority 
                src={friend.avatar}
                alt={`${friend.name}'s avatar`}
                width={50} 
                height={50} 
                className={`absolute inset-0 lg:w-[90%] lg:h-[90%] md:w-[80%] md:h-[80%] w-[100%] h-[100%] transition-opacity duration-300 ${imageLoadingStates[friend.id] === false ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => handleImageLoad(friend.id)}
              />
            </div>
            <div className="ml-4 flex flex-col justify-center">
              <h2 className="text-[#242F5C] text-sm lg:text-lg md:text-base font-bold">{friend.name}</h2>
              <p className={`${friend.status === 'online' ? 'text-green-600' : 'text-gray-500'} lg:text-sm text-xs font-medium`}>
                {friend.status === 'online' ? 'Online' : 'Offline'}
              </p>
            </div>
            <div className="flex flex-row items-center justify-end lg:w-[90%] lg:h-[90%] md:w-[90%] md:h-[90%] w-[90%] h-[90%] absolute md:right-10 right-5 top-1 lg:gap-12 md:gap-4 gap-4">
              <button 
                onClick={() => handleInviteGame(friend.id, friend.name)}
                aria-label={`Invite ${friend.name} to game`} 
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                <Image src="/images/InviteGame.svg" alt="" width={50} height={50} className="lg:w-[40px] lg:h-[40px] md:w-[30px] md:h-[30px] w-[30px] h-[30px]" />
              </button>
              <button 
                onClick={() => handleChat(friend.id)}
                aria-label={`Chat with ${friend.name}`} 
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                <Image src="/images/chat.svg" alt="" width={50} height={50} className="lg:w-[40px] lg:h-[40px] md:w-[30px] md:h-[30px] w-[30px] h-[30px]" />
              </button>
              <button 
                onClick={() => handleBlock(friend.id)}
                aria-label={`Block ${friend.name}`} 
                className="cursor-pointer hover:scale-110 transition-transform"
              >
                <Image src="/images/BlockedFriends.svg" alt="" width={50} height={50} className="lg:w-[40px] lg:h-[40px] md:w-[30px] md:h-[30px] w-[30px] h-[30px]" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}