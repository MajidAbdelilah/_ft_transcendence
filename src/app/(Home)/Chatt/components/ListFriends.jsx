
import { useState, useEffect} from "react";
import Image from "next/image";

export default function ListFriends() {

    const [friendsList, setFriendsList] = useState([]);

    // fetching friends ...
    useEffect (() => 
    {
        const fetchFriends = async () => 
            {
                try{
                    
                    const response = await fetch("/friends.json");
                    if(!response.ok)
                    {
                        throw new Error("Failed to fetch friends data.");
                    }

                const data = await response.json();
                setFriendsList(data);
                
                } catch (error)
                {
                    console.error("Error catched fetching friends data", error);
                }
            };
        fetchFriends();



    }, []);

    return (
        <div className="friendsList">

        {friendsList.map((friend) => (
            <div key={friend.id} className="friendInfo my-2 px-1 w-full flex flex-row items-center overflow-hidden cursor-pointer" > 

            
            
            <Image 
                src={friend.image_url}
                alt="/images/avatarprofile.svg"
                width={45}
                height={45}
                className="rounded-full left-0 top-0 w-[45px] h-[45px]"

            />
            <h3 className="text-xl xl:text-2xl top-0 left-0 text-[#242F5C] ml-2 ">{friend.username}</h3>

            <div
                className={`text-xs ${friend.is_online ? "bg-green-500" : "bg-gray-300"} ml-auto hidden lg:block rounded-full w-2 h-2`}
            ></div>



            </div>
        ))}


        </div>
    );
}