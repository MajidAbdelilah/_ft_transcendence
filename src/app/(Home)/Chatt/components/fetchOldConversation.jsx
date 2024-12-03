
import axios from 'axios';

export const fetchOldConversation = async (loggedInUser, friend) => 
    {
        try {
            const response = await axios.get("http://127.0.0.1:8000/chat/messages",
            { withCredentials: true, headers: {} }
            );
            const allMessages = response.data.messages;


                    // Check if 'response.data.messages' is an array

            // if (!Array.isArray(allMessages)) {
            //     throw new Error("the file fetched in not an array");
            // }


            // console.log("allMessages : ----------------", allMessages)
            // console.log("All messages: ", allMessages);
            // console.log("Logged in user: ", loggedInUser);
            // console.log("Friend: ", friend);
            const filteredMessages = allMessages.filter((message) => {
                return (
                    (message.sender === loggedInUser.username && message.receiver === friend.username)
                    || (message.sender === friend.username && message.receiver === loggedInUser.username)
                );
            });

            return filteredMessages;
            // console.log(response.data.messages);
            
        } catch (error) {
            console.error("Error catched fetching old conversation ...", error);
        }
    }