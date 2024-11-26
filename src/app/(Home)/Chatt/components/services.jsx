
"use client";
import axios from 'axios';
import toast from 'react-hot-toast';

export async function blockService(friend) {

        // console.log(friend);
        


    try {
        const response = await axios.post('http://127.0.0.1:8000/api/block',
            {username : friend.username},
            { withCredentials: true, headers: {} }
        );

        // if block successded
        window.location.reload();
        toast.success('Blocked successfully!');



    } catch (error) {
        console.error(error);
    }
}