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
    is_on: number;
  };
  freindship_id: number;
  is_accepted: boolean;
  user_from: number;
  user_to: number;
  user_is_logged_in: number;
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
        freindship_id: friend.freindship_id
      });
      send({
        type: 'GAME_INVITE',
        freindship_id: friend.freindship_id,
        message: `Invited ${friend.user.username} to a game`
      });
    } catch (error) {
      console.error('Error inviting friend to game:', error);
    }
  };

  const handleChat = async (friend: Friend) => {
    try {
      await customAxios.post(`/api/chat/messages`, {
        freindship_id: friend.freindship_id
      });
      send({
        type: 'messages',
        freindship_id: friend.freindship_id
      });
    } catch (error) {
      console.error('Error initiating chat:', error);
    }
  };

  const handleBlock = async (friend: Friend) => {
    try {
      await customAxios.post(`/api/friends/block`, {
        freindship_id: friend.freindship_id
      });
      send({
        type: 'friends-block',
        freindship_id: friend.freindship_id
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
              <div className="flex flex-row items-center justify-center lg:w-[10%] lg:h-[90%] md:w-[10%] md:h-[90%] w-[20%] h-[90%]">
                <Image
                  src="/images/default-avatar.png"
                  alt={`${friend.user.username}'s profile`}
                  width={50}
                  height={50}
                  className="lg:w-[90%] lg:h-[90%] md:w-[80%] md:h-[80%] w-[100%] h-[100%] rounded-full"
                />
              </div>
              <div className="ml-4 flex flex-col justify-center">
                <h2 className="text-[#242F5C] text-sm lg:text-lg md:text-base font-bold">{friend.user.username}</h2>
                <p className={`${friend.user.is_on === 1 ? 'text-green-600' : 'text-gray-500'} lg:text-sm text-xs font-medium`}>
                  {friend.user.is_on === 1 ? 'Online' : 'Offline'}
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