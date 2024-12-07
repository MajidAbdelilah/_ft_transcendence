'use client'

import Image from "next/image";
import { Montserrat } from "next/font/google";
import { useState, useEffect } from "react";
import { useWebSocket } from '../../contexts/WebSocketProvider';
import customAxios from '../../customAxios';
import {IconUserExclamation} from '@tabler/icons-react'
import { useRouter } from "next/navigation";

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})

interface Friend {
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

interface FriendsListProps {
  friends: Friend[];
}

export default function FriendsList({ friends = [] }: FriendsListProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: string]: boolean }>({});
  const { send } = useWebSocket();

  const router = useRouter();

  const handleInviteGame = async (friend: Friend) => {
    try {
      await customAxios.post(`/api/game/invite`, {
        friendship_id: friend.friendship_id
      });
      send({
        type: 'GAME_INVITE',
        friendship_id: friend.friendship_id,
        message: `Invited ${friend.user.username} to a game`
      });
    } catch (error) {
      console.error('Error inviting friend to game:', error);
    }
  };

  const handleChat = async (friend: Friend) => {
    try {
      await customAxios.post(`/api/chat/messages`, {
        friendship_id: friend.friendship_id
      });
      send({
        type: 'messages',
        friendship_id: friend.friendship_id
      });
    } catch (error) {
      console.error('Error initiating chat:', error);
    }
  };

  const handleBlock = async (friend: Friend) => {
    try {
      await customAxios.post(`/api/friends/block`, {
        friendship_id: friend.friendship_id
      });
      send({
        type: 'friends-block',
        friendship_id: friend.friendship_id
      });
    } catch (error) {
      console.error('Error blocking friend:', error);
    }
  };

  const getProfile = (username: string) => {
    router.push(`/Profile/${username}`);
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
      {friends.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full h-[200px] p-4">
          <IconUserExclamation size={50} color="#242F5C" />
          <h3 className="text-[#242F5C] text-lg font-bold mb-2">No Friends Yet</h3>
          <p className="text-[#7C829D] text-sm text-center">
            You don't have any friends in your list yet.<br/>
            Start by accepting friend requests or adding new friends!
          </p>
        </div>
      ) : (
        friends.map((friend) => (
          <div onClick={() => getProfile(friend.user.username)} key={friend.user.id} className={`w-full h-20 lg:h-[12%] cursor-pointer md:h-[15%] md:h-[20%] rounded-xl bg-[#D8D8F7] shadow-md shadow-[#BCBCC9] relative ${isMobile ? 'w-full' : 'min-h-[90px]'}`}>
            <div className="flex items-center h-full p-2">
              <div  className="flex flex-row items-center justify-center lg:w-[10%] lg:h-[90%] md:w-[10%] md:h-[90%] w-[20%] h-[90%] relative">
                {imageLoadingStates[friend.user.id] !== false && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#242F5C]"></div>
                  </div>
                )}
                <Image 
                  priority 
                  src={friend.user.profile_photo}
                  alt={`${friend.user.username}'s avatar`}
                  width={50} 
                  height={50} 
                  className={`absolute inset-0 lg:w-[90%] lg:h-[90%] md:w-[80%] md:h-[80%] w-[100%] h-[100%] transition-opacity duration-300 ${imageLoadingStates[friend.user.id] === false ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => handleImageLoad(friend.user.id.toString())}
                />
              </div>
              <div className="ml-4 flex flex-col justify-center">
                <h2 className="text-[#242F5C] text-sm lg:text-lg md:text-base font-bold">{friend.user.username}</h2>
                <p className={`${friend.user.is_on ? 'text-green-600' : 'text-gray-500'} lg:text-sm text-xs font-medium`}>
                  {friend.user.is_on ? 'Online' : 'Offline'}
                </p>
              </div>
              <div className="flex flex-row items-center justify-end lg:w-[90%] lg:h-[90%] md:w-[90%] md:h-[90%] w-[90%] h-[90%] absolute md:right-10 right-5 top-1 lg:gap-12 md:gap-4 gap-4">
                <button 
                  onClick={() => handleInviteGame(friend)}
                  aria-label={`Invite ${friend.user.username} to game`} 
                  className="cursor-pointer hover:scale-110 transition-transform"
                >
                  <Image src="/images/InviteGame.svg" alt="" width={50} height={50} className="lg:w-[40px] lg:h-[40px] md:w-[30px] md:h-[30px] w-[30px] h-[30px]" />
                </button>
                <button 
                  onClick={() => handleChat(friend)}
                  aria-label={`Chat with ${friend.user.username}`} 
                  className="cursor-pointer hover:scale-110 transition-transform"
                >
                  <Image src="/images/chat.svg" alt="" width={50} height={50} className="lg:w-[40px] lg:h-[40px] md:w-[30px] md:h-[30px] w-[30px] h-[30px]" />
                </button>
                <button 
                  onClick={() => handleBlock(friend)}
                  aria-label={`Block ${friend.user.username}`} 
                  className="cursor-pointer hover:scale-110 transition-transform"
                >
                  <Image src="/images/BlockedFriends.svg" alt="" width={50} height={50} className="lg:w-[40px] lg:h-[40px] md:w-[30px] md:h-[30px] w-[30px] h-[30px]" />
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}