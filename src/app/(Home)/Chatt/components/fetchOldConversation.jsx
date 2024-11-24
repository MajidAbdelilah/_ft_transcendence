
import axios from 'axios';

export const fetchOldConversation = async (loggedInUser, friend) => 
    {
        try {
            const response = await axios.get("/Conversation.json");
            console.log(response.data.messages);
            return response.data.messages;
        } catch (error) {
            console.error("Error catched fetching old conversation ...", error);
        }
    }