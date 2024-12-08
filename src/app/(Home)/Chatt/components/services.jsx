
"use client";
import axios from 'axios';
import toast from 'react-hot-toast';


export async function profileService(friend, router) {
    

    router.push(`/Profile/${friend.username}`);
}

export async function playWithService(friend)
{
    console.log('playWithService called with:', friend);
    toast.success('impliment a play with logic!');
}
export async function blockService(friend) {

        
    try {
        console.log(friend);
        // const respond = await axios.post(
        //     "http://127.0.0.1:8000/friend/friends-remove/",
        //     { username: user.username },
        //     { withCredentials: true, headers: {} }
        // );
    
        console.log("respond : ---------------", respond);
    
        
        // if (respond.status === 200 && respond.data?.success) {
        //     toast.success(respond.data.success); 
        // } else {
        //     toast.error('Blocking user failed'); 
        // }
        } catch (error) {
        console.error(error);
        toast.error('An error occurred while blocking the user');
        }


}