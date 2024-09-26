"use client";


import Image from "next/image";

// -- icons -----------------------------------------------------
import { FaAngleDown } from "react-icons/fa";
import { RiSendPlaneLine } from "react-icons/ri";
import { IoIosChatboxes } from "react-icons/io";


// -- hooks -----------------------------------------------------
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

// -- components -----------------------------------------------------

import Sidebar from "../sidebar";
import Navbar from "../Navbar";




import ProfileInfo from "./components/ProfileInfo";
import FriendInfo from "./components/FriendInfo";
import { createFriendMsgBox, createMyMsgBox, FriendMsgBox, MyMsgBox, getCurrentTime} from './components/peerToPeer';
import { HisProfile, PleaseSelectAConversation, ProfileOption, PlayWithOption, BlockOption} from "./components/FriendChatInfo";
import { ConversationsHeader } from "./components/BasicComp";


// -- font -----------------------------------------------------
import { Inter, Montserrat } from "next/font/google";
import path from "path";
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});


// -- colors -----------------------------------------------------co
//  #F4F4FF   #242F5C   #8988DE   #BCBCC9   #F4F4FF   #EAEAFF   #C0C7E0

// -- data -----------------------------------------------------

let user = { name: "John Wick", path: "/images/avatarprofile.svg", status: "Online", };

let friend1 = { name: "Henry smith", path: "/images/avatar3.svg", status: "Online", 
  conversation: [
    { time: "02:22 PM", msg: "Hi John, up for a ping pong match this evening?", sender: "friend",
    },
    { time: "02:22 PM", msg: "Hi John, up for a ping pong match this evenihtrerthwrehwerhwrehwerhwerhwrehwherhrehehewhrhwerrhwerherheng?", sender: "friend",
    },
    { time: "02:23 PM", msg: "Sure, I'm in!", sender: "me" },
    { time: "02:24 PM", msg: "Great, see you at 7 PM!", sender: "friend" },
    { time: "02:25 PM", msg: "Perfect, see you then!", sender: "me" },
  ],
};
let friend2 = {  name: "Lucy Smith",  path: "/images/avatar2.svg",  status: "Offline",
  conversation: [
    { time: "09:15 AM", msg: "Good morning, how are you?", sender: "friend" },
    {
      time: "09:16 AM",
      msg: "I'm doing well, thanks! How about you?",
      sender: "me",
    },
    {
      time: "09:18 AM",
      msg: "I'm good too. Have a great day!",
      sender: "friend",
    },
  ],
};

let tournament = { name: "tournament", // ###############  WARNING   ########## the tournament must be named like that , casue i ve built the logic so that the name is tournament. path: "/images/avatarprofile.svg", status: "Online",
  conversation: [
    {
      time: "09:15 AM",
      msg: "Your turn is up! Please join the match now to secure your spot in the tournament.",
      sender: "friend",
    },
  ],
};

export default function ChatPage() {

  // Clicking on icons -------------------------------------------------------
  const [iconState, setIconState] = useState({
    chatState: false,
    dropDownState: false,
  });
  const [selectedFriend, setSelectedFriend] = useState(null);

  const switchChatState = () => {
    setIconState((prevState) => ({
      ...prevState,
      chatState: !prevState.chatState,
    }));
  };

  const switchDropDownState = () => {
    setIconState((prevState) => ({
      ...prevState,
      dropDownState: !prevState.dropDownState,
    }));
  };

  // Hide components when clikcing outside  -------------------------------------------------------
  
  const chatRef = useRef();
  const dropDownRef = useRef();

  const handleClickOutSide = (event) => {
    if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
      setIconState({ dropDownState: false });
    }

    if (chatRef.current && !chatRef.current.contains(event.target)) {
      setIconState({ chatState: false });
    }
  };

  useEffect(() => {
    // Add event listener for clicks outside
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      // Remove event listener on cleanup
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, []);


  // -- -----------------------------------------------------
  
  function FriendChatInfo({ friend}) {
    return (
      <div className="friendChatInfo p-5 flex items-center border-b-2 border-[#9191D6] border-opacity-30 ">
        {/* ChatListIcon  -------------------------------------------------------------- */}

        <IoIosChatboxes
          className="ChatListIcon block lg:hidden text-6xl text-[#242F5C]  mr-12 "
          onClick={switchChatState}
        />

        {/* hisProfile -------------------------------------------------------------- */}
        {selectedFriend !== null ? (
          < HisProfile path={friend.path} name={friend.name} status={friend.status} />

        ) : (
          < PleaseSelectAConversation/>

        )}

        {/* dropDownIcon  -------------------------------------------------------------- */}
        {/*  if the user selected already a friend, and the friend is not the tournament robot , then show the drop down icon */}
        {selectedFriend && friend.name !== "tournament" && (
          <FaAngleDown
            className="dropDownIcon text-4xl ml-auto mr-8  text-[#242F5C]"
            onClick={switchDropDownState}
          />
        )}

        {iconState.dropDownState && (
          <ul
            ref={dropDownRef}
            className="list absolute right-16 top-20 bg-[#EAEAFF] border-[#C6C6E1] border-2 rounded-xl shadow-lg w-36 "
          >
            <ProfileOption onClick={() => {window.open('https://google.com'); setIconState({dropDownState: false });}}/>
            <PlayWithOption onClick={() => {window.open('https://facebook.com'); setIconState({dropDownState: false });}}/>
            <BlockOption onClick={() => {window.open('https://instagram.com'); setIconState({dropDownState: false });}}/>


          </ul>
        )}
      </div>
    );
  }

  function sendMessage(e) {
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
  
  function MessagesBox({ friend }) {
    // no friend selected yet just return FriendChatInfo compomet with empty friend object
    if (friend == null) {
      let noFriendYet = {path: "", name: "", status: ""};
      return (
        <div className="messagesBox md:w-full lg:w-3/5 p-2 h-full rounded-tr-xl rounded-br-xl bg-[#F4F4FF] flex flex-col "> 
          <FriendChatInfo friend={noFriendYet} />
        </div>
      );
    }
    return (
      <div className="messagesBox md:w-full lg:w-3/5 p-2 h-full rounded-tr-xl rounded-br-xl bg-[#F4F4FF] flex flex-col ">
        {/* FriendChatInfo ---------------------------------------------------------------------------------------*/}
        <FriendChatInfo friend={friend}/>

        {/* peerToPeer ---------------------------------------------------------------------------------------*/}
        <div className="peerToPeer flex flex-col flex-grow overflow-y-auto custom-scrollbar break-all ">
          {friend.conversation.map((message, index) =>
            message.sender === "friend" ? (
              <FriendMsgBox key={index} time={message.time} msg={message.msg} />
            ) : (
              <MyMsgBox key={index} time={message.time} msg={message.msg} />
            )
          )}
        </div>

        {/*  SendMsg ---------------------------------------------------------------------------------------*/}
        <div className="sendMsg mx-8 my-5 relative ">
          <input
            className="msgToSend text-xl bg-[#9191D6] bg-opacity-20 py-3 pl-6 pr-16 w-full rounded-full"
            type="text"
            placeholder="Message"
            onKeyUp={sendMessage}
          />
          <RiSendPlaneLine
            onClick={sendMessage}
            className="text-3xl absolute right-4 top-3 text-[#2C3E86] text-opacity-80 "
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-screen  ${montserrat.className}`}>
      <Navbar/>
      <div className="parent flex flex-1 ">
        {/* hidden on smaller screens and only visible on screens 1280px or larger. */}
        {/* <div className="sidebar hidden sm:block "> */}
          <Sidebar  />
        {/* </div> */}

        <div className="chattSection flex-1 p-5 md:p-10 h-screen w-screen">
          <div className="boxes relative flex h-full w-full border-2 border-[#C6C6E1] bg-[#F4F4FF] rounded-xl flex-row-revers ">
            {/* friendsBox ------------------------------------------------------- */}

            <div
              ref={iconState.chatState ? chatRef : null}
              className={`menuList w-full lg:w-2/5 h-full flex-col lg:block absolute z-50 lg:relative bg-[#F4F4FF]  ${
                iconState.chatState
                  ? "block bg-[#F4F4FF]  w-full top-32 lg:top-0 "
                  : "hidden"
              } `}
            >
              <div className="friendsBox  p-2 rounded-tl-xl rounded-bl-xl  border-r-2  border-[#C6C6E1] h-full  flex-col flex-grow overflow-y-auto custom-scrollbar bg-[#F4F4FF]">
                <ProfileInfo user={user} />
                < ConversationsHeader/>


                <div className="MessagesList flex flex-col ">
                  <FriendInfo
                    friend={tournament}
                    onClick={() => {
                      setSelectedFriend(tournament);
                      setIconState({ chatState: false, dropDownState: false });
                    }}
                  />
                  <FriendInfo
                    friend={friend1}
                    onClick={() => {
                      setSelectedFriend(friend1);
                      setIconState({ chatState: false, dropDownState: false });
                    }}
                  />
                  <FriendInfo
                    friend={friend2}
                    onClick={() => {
                      setSelectedFriend(friend2);
                      setIconState({ chatState: false, dropDownState: false });
                    }}
                  />
                </div>
              </div>
            </div>

            <MessagesBox friend={selectedFriend} />
          </div>
        </div>
      </div>
    </div>
  );
}
