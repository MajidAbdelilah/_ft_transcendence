

import { RiSendPlaneLine } from "react-icons/ri";
import { getCurrentTime, createFriendMsgBox, createMyMsgBox } from './peerToPeer';
import { useWebSocket } from '../WebSocketProvider';



  
  export function SendMsgBox({ loggedInUser, friend}) {
    // socket ---------------------------------------------------------
  
    const { send } = useWebSocket();
    const sendMessage = async (e) => {
      


      if (e.code !== 'Enter' && e.type !== 'click') return;
  
      const inputText = document.querySelector('.msgToSend');
      if (!inputText || inputText.value.trim() === '') return;
  
      const messageContent = inputText.value.trim();

      const messageObject = {
        message: messageContent,
        send: loggedInUser.username,
        receive: friend.username,
        timestamp: new Date().toISOString(),
        chat_id: loggedInUser.id.toString()
      };
  
      send(messageObject);
      inputText.value = ''; // Clear input after sending



    };




    return (
      <div className="sendMsgBox mx-8 my-5 relative ">
        <input
          className="msgToSend text-xl bg-[#9191D6] bg-opacity-20 py-3 pl-6 pr-16 w-full rounded-full"
          type="text"
          placeholder="Message"
          onKeyUp={sendMessage}
        />
        <RiSendPlaneLine
          className="text-3xl absolute right-4 top-3 text-[#2C3E86] text-opacity-80 cursor-pointer"
          onClick={sendMessage}
        />
      </div>
    );
  }

