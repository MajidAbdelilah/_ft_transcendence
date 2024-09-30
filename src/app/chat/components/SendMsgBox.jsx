

import { RiSendPlaneLine } from "react-icons/ri";
import { getCurrentTime, createFriendMsgBox, createMyMsgBox } from './peerToPeer';


export function sendMessage(e) {
    //forr testing createFriendMsgBox .. delete later -----------------
    if (e.code === "Enter" || e.type === "click") {
      let inputText = document.getElementsByClassName("msgToSend")[0];

      if (inputText.value.trim() === "receive") {
        let time = getCurrentTime();
        let theMsg = createFriendMsgBox(time, inputText.value);
        let conv = document.getElementsByClassName("peerToPeer")[0];
        conv.appendChild(theMsg);
        conv.scrollTop = conv.scrollHeight;
        inputText.value = ""; // Clear the input
      }
    }
    if (e.code === "Enter" || e.type === "click") {
      let inputText = document.getElementsByClassName("msgToSend")[0];

      if (inputText.value.trim() !== "") {
        let time = getCurrentTime();
        let theMsg = createMyMsgBox(time, inputText.value);
        let conv = document.getElementsByClassName("peerToPeer")[0];
        conv.appendChild(theMsg);
        conv.scrollTop = conv.scrollHeight;
        inputText.value = ""; // Clear the input
      }
    }
  }
  
  export function SendMsgBox({ friend}) {
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

