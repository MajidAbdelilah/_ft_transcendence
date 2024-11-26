
"use client";
import axios from 'axios';
import toast from 'react-hot-toast';


export async function profileService(friend, router) {
    
    router.push(`/Friends`);
    // router.push(`/Profile/${friend.username}`);
}

export async function playWithService(friend)
{
    console.log('playWithService called with:', friend);
    toast.success('impliment a play with logic!');
}
export async function blockService(friend) {

        // console.log(friend);
        


    try {
        const response = await axios.post('http://127.0.0.1:8000/api/block',
            {username : friend.username},
            { withCredentials: true, headers: {} }
        );

        // if block successded
        
        toast.success('Blocked successfully!');
        // window.location.reload();

        // else
        toast.success('Something went wrong!');
        



    } catch (error) {
        console.error(error);
    }
}