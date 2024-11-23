
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
                alt="/avatarprofile.svg"
                width={45}
                height={45}
                className="rounded-full left-0 top-0 w-[45px] h-[45px]"

            />
            
            </div>
        ))}


        </div>
    );
}