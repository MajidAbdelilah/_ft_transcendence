import { useEffect } from 'react';
import { useWebSocket } from '../../contexts/WebSocketProvider';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function GameInvitationHandler() {
  const { send, addHandler, removeHandler, socket } = useWebSocket();
  const router = useRouter();

  useEffect(() => {
    if (!socket) return;

    const handleGameInvitation = (data) => {
      console.log('📩 Received WebSocket message:', data);

      if (!data || !data.type) return;

      switch (data.type) {
        case 'game_invitation_received':
          console.log('🎲 New game invitation received:', data);
          // Show invitation toast with accept/decline options
          toast.custom((t) => (
            <div className="max-w-md w-full bg-[#F4F4FF] shadow-lg rounded-xl pointer-events-auto flex ring-1 ring-[#BCBCC9]">
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={data.sender_image || "/images/Default_profile.png"}
                      alt=""
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-[#242F5C]">
                      Game Invitation from {data.sender_username}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Wants to play on {data.map}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-[#BCBCC9]">
                <div className="flex flex-col border-l border-[#BCBCC9] divide-y divide-[#BCBCC9]">
                  <button
                    onClick={() => {
                      console.log('✅ Accepting game invitation from:', data.sender_username);
                      send({
                        type: 'game_invitation_response',
                        friendship_id: data.friendship_id,
                        accepted: true,
                        map: data.map
                      });
                      console.log('📤 Sending acceptance response:', {
                        type: 'game_invitation_response',
                        friendship_id: data.friendship_id,
                        accepted: true,
                        map: data.map
                      });
                      toast.dismiss(t.id);
                      router.push(`/Game/play?map=${data.map}&mode=friend&opponent=${data.sender_username}`);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-[#242F5C] hover:bg-[#242F5C] hover:text-white transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      console.log('❌ Declining game invitation from:', data.sender_username);
                      send({
                        type: 'game_invitation_response',
                        friendship_id: data.friendship_id,
                        accepted: false
                      });
                      console.log('📤 Sending decline response:', {
                        type: 'game_invitation_response',
                        friendship_id: data.friendship_id,
                        accepted: false
                      });
                      toast.dismiss(t.id);
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Decline
                  </button>
                </div>
              </div>
            </div>
          ), {
            duration: 15000, // 15 seconds
            position: 'top-right',
          });
          break;

        case 'game_invitation_response':
          if (data.accepted) {
            console.log('👍 Game invitation accepted!');
            toast.success('Game invitation accepted! Starting game...');
            router.push(`/Game/play?map=${data.map}&mode=friend&opponent=${data.receiver_username}`);
          } else {
            console.log('🚫 Game invitation declined');
            toast.error('Game invitation declined');
          }
          break;

        case 'game_invitation_error':
          console.error('❌ Game invitation error:', data.message);
          toast.error(data.message || 'Error with game invitation');
          break;
      }
    };

    // Add the WebSocket message handler
    addHandler(handleGameInvitation);
    console.log('🎮 GameInvitationHandler: WebSocket listener attached');

    return () => {
      removeHandler(handleGameInvitation);
      console.log('🎮 GameInvitationHandler: WebSocket listener removed');
    };
  }, [send, addHandler, removeHandler, router, socket]);

  return null; // This is a utility component, no UI needed
}
