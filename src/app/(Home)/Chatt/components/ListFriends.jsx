"use client";
import { useState, useEffect} from "react";
import Image from "next/image";
import axios from "axios";


export default function ListFriends({ getSelectedFriend, switchChatState }) {

    const [friendsList, setFriendsList] = useState([]);



    // Fetching friends with Axios
    useEffect(() => {
        const fetchFriends = async () => {
        try {
            // console.log()
            const response = await axios.get("http://127.0.0.1:8000/friend/friends",
            
            { withCredentials: true, headers: {} }
            );
            // console.log("===", response);
            setFriendsList(response.data.friends); // Assuming the API returns { friends: [...] }
        } catch (error) {
            console.error("Error fetching friends data:", error);
        }
        };

        fetchFriends();
    }, []);


    
    if (friendsList.length === 0) {
        return <p className="text-center text-gray-500">loading friends ...</p>;
    }



    return (
        <div className="friendsList">

        {friendsList.map((friend) => (
            <div 
            key={friend.user.id} 
            className="friendInfo my-2 px-1 w-full flex flex-row items-center overflow-hidden cursor-pointer" 
            onClick={() =>{ getSelectedFriend(friend); switchChatState()}} >
            
            
                <Image 
                    src={friend.user.profile_photo === undefined || friend.user.profile_photo === null || friend.user.profile_photo === "" || friend.user.profile_photo === "/images/%7B%7D" 
                        ? "/images/avatarprofile.svg" 
                        : friend.user.profile_photo}
                    alt="/images/avatarprofile.svg"
                    width={45}
                    height={45}
                    className="rounded-full left-0 top-0 w-[45px] h-[45px]"

                />
                <h3 className="text-xl xl:text-2xl top-0 left-0 text-[#242F5C] ml-2 ">{friend.user.username}</h3>

                <div
                    className={`text-xs ${friend.user.is_online ? "bg-green-500" : "bg-gray-300"} ml-auto hidden lg:block rounded-full w-2 h-2`}
                ></div>



            </div>
        ))}


        </div>
    );
}