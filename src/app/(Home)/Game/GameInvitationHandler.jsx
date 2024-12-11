"use client";

import { useEffect, useRef } from 'react';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { useRouter } from 'next/navigation';
import { useUser } from '../../contexts/UserContext';
import toast from 'react-hot-toast';
import Image from 'next/image';

const styles = `
  @keyframes shrink-width {
    from {
      width: 100%;
    }
    to {
      width: 0%;
    }
  }
`;

export default function GameInvitationHandler() {
  const { addHandler, removeHandler, send } = useWebSocket();
  const router = useRouter();
  const { userData } = useUser();
  const recentInvitationsRef = useRef(new Set());

  useEffect(() => {
    if (!userData) return;

    const handleWebSocketMessage = (data) => {
      try {
        console.log('Received WebSocket message:', data);
        
        if (data.type === 'game_invitation_received') {
          const inviteKey = `${data.sender_username}-${data.friendship_id}`;
          
          if (recentInvitationsRef.current.has(inviteKey)) {
            console.log('Duplicate invitation detected, skipping:', inviteKey);
            return;
          }
          
          recentInvitationsRef.current.add(inviteKey);
          
          setTimeout(() => {
            recentInvitationsRef.current.delete(inviteKey);
          }, 2000);

          console.log('Received game invitation:', data);
          
          // Dispatch a custom event for the notification system
          if (typeof window !== 'undefined') {
            const notificationEvent = new CustomEvent('newNotification', {
              detail: {
                id: Date.now(),
                type: 'game_invitation',
                avatar: data.sender_image ? `http://127.0.0.1:8000/api${data.sender_image}` : '/images/DefaultAvatar.svg',
                message: `${data.sender_username} invited you to play a game`,
                timestamp: new Date().toISOString(),
                isNew: true,
                senderUsername: data.sender_username
              }
            });
            window.dispatchEvent(notificationEvent);
          }

          toast((t) => (
            <div className="w-[500px] bg-[#F4F4FF] shadow-md rounded-3xl">
              <div className="p-4">
                {/* Content */}
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <img
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                      src={data.sender_image ? `http://127.0.0.1:8000/api${data.sender_image}` : "/images/DefaultAvatar.svg"}
                      alt=""
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-[#242F5C]">
                        {data.sender_username}
                      </span>
                      <span className="text-sm text-[#242F5C]">
                        {data.map}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-[#242F5C] opacity-70">
                      invites you to play
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      console.log('Accepting invitation:', {
                        type: 'accept_invitation',
                        player1: data.sender_username,
                        player2: userData.username,
                        map: data.map,
                        friendship_id: data.friendship_id
                      });
                      send({
                        type: 'accept_invitation',
                        player1: data.sender_username,
                        player2: userData.username,
                        map: data.map,
                        friendship_id: data.friendship_id
                      });
                      toast.dismiss(t.id);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-[#242F5C] rounded-full hover:bg-opacity-90 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      console.log('Declining invitation:', {
                        type: 'decline_invitation',
                        sender: data.sender_username,
                        friendship_id: data.friendship_id
                      });
                      send({
                        type: 'decline_invitation',
                        sender: data.sender_username,
                        friendship_id: data.friendship_id
                      });
                      toast.dismiss(t.id);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-full hover:bg-red-100 transition-colors"
                  >
                    Decline
                  </button>
                </div>

                {/* Progress bar */}
                <div className="w-full h-0.5 bg-gray-200 mt-4 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#242F5C] origin-left"
                    style={{
                      transform: 'scaleX(1)',
                      transition: 'transform linear',
                      transitionDuration: `${t.duration || 10000}ms`,
                      transformOrigin: 'left'
                    }}
                    ref={(el) => {
                      if (el) {
                        requestAnimationFrame(() => {
                          el.style.transform = 'scaleX(0)';
                        });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ), {
            duration: 10000,
            position: 'top-center',
            style: {
              background: 'none',
              boxShadow: 'none',
            },
          });
        } else if (data.type === 'invitation_accepted') {
          console.log('Invitation accepted:', data);
          
          // Generate a unique room name using friendship_id
          const roomName = `game_${data.friendship_id}`;
          
          // Properly encode URL parameters
          const params = new URLSearchParams({
            room_name: roomName,
            player1: data.player1,
            player2: data.player2,
            map: data.map
          });
          
          // Create game URL with encoded parameters
          const gameUrl = `/front/turn.html?${params.toString()}`;
          
          console.log('Redirecting to game:', gameUrl);
          router.push(gameUrl);
        }
      } catch (error) {
        console.error('Error handling WebSocket message:', error);
      }
    };

    console.log('Adding WebSocket message handler');
    addHandler(handleWebSocketMessage);

    return () => {
      console.log('Removing WebSocket message handler');
      removeHandler(handleWebSocketMessage);
    };
  }, [addHandler, removeHandler, send, router, userData]);

  return null;
}
