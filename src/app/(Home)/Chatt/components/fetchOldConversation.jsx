
import axios from 'axios';

export const fetchOldConversation = async (loggedInUser, friend) => 
    {
        try {
            const response = await axios.get("/Conversation.json");
            const allMessages = response.data.messages;


            const filteredMessages = allMessages.filter((message) => {
                return (
                    (message.sender === loggedInUser.username && message.receiver === friend.username)
                    || (message.sender === friend.username && message.receiver === loggedInUser.username)
                );
            });

            return filteredMessages;
            // console.log(response.data.messages);
            return response.data.messages;
        } catch (error) {
            console.error("Error catched fetching old conversation ...", error);
        }
    }