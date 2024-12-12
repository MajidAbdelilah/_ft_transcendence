
"use client";
import axios from 'axios';
import toast from 'react-hot-toast';
// import { useUser } from '../../../contexts/UserContext';
// const { userData } = useUser();
// import { useGameInviteWebSocket } from '../../../contexts/GameInviteWebSocket';


// const { send } = useGameInviteWebSocket();

export async function profileService(friend, router) {
    

    router.push(`/Profile/${friend.username}`);
}


// {
//     "id": 3,
//     "username": "user2user2",
//     "is_on": 1,
//     "image_field": "/images/images/profile7.svg"
// }

// {
//     "username": "user1user1",
//     "id": 2,
//     "name": "user1user1",
//     "avatar": "/images/avatarprofile.svg",
//     "status": "Loading",
//     "level": 0,
//     "score": "",
//     "result": "",
//     "map": ""
// }

export async function playWithService(friend, loggedInUser, send)
{
    
    console.log('loggedInUser called with:--------', loggedInUser);
    toast.success('impliment a play with logic!');




        console.log('🎮 Attempting to send game invitation to:', friend.username);

          const message = {
            type: 'game_invitation',
            friendship_id: friend.id,
            map: "White Map",
            sender_username: loggedInUser.username,
            sender_image: loggedInUser.image_feiled,
            receiver_username: friend.username,

            timestamp: new Date().toISOString()
          };

          console.log('📤 Sending invitation message:', message);
          send(message);
          toast.success(`Invitation sent to ${friendUsername}!`);

        // } else {
        //   console.warn('❌ No map selected when trying to invite friend');
        //   toast.error('Please select a map first!');
        // }

}
export async function blockService(friend) {

        
    try {
        // console.log("friend------", friend);
        const respond = await axios.post(
            "http://127.0.0.1:8000/friend/friends-remove/",
            { username: friend.username },
            { withCredentials: true, headers: {} }
        );

    
        // console.log("respond : ---------------", respond);
    
        
        if (respond.status === 200 && respond.data?.success) {
            toast.success(respond.data.success); 
            setTimeout(() => {window.location.reload();}, 800);

        } else {
            toast.error('Blocking user failed'); 
        }
        } catch (error) {
        console.error(error);
        toast.error('An error occurred while blocking the user');
        }


}