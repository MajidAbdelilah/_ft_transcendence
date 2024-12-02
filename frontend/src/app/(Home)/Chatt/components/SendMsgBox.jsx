

import { RiSendPlaneLine } from "react-icons/ri";
import { getCurrentTime, createFriendMsgBox, createMyMsgBox } from './peerToPeer';



  
  export function SendMsgBox({ loggedInUser, friend}) {
  
    const sendMessage = async (e) => {

      if (e.code !== "Enter" && e.type !== "click") return;
      let inputText = document.getElementsByClassName("msgToSend")[0];
      if (inputText.value.trim() === "") return ;
        
      const messageContent = inputText.value;





      //  -----  using websocket  -------------------------------------------------------
      const message = {
        message_content: messageContent,
        message_date: getCurrentTime(),
        sender: loggedInUser.userId,
        receiver: friend.userId
      };

      // Send the message to WebSocket server
      socket.send(JSON.stringify(message));




      

          conv.scrollTop = conv.scrollHeight;
          inputText.value = ""; // Clear the input
    }



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

