"use client";

import Sidebar_test from "./components/sidebar"; // import the real one as a componant later
import Navbar_test from "./components/navbar"; // import the real one as a componant later
import Image from "next/image";

import { FaAngleDown } from "react-icons/fa";
import { RiSendPlaneLine } from "react-icons/ri";
import { IoIosChatboxes } from "react-icons/io";
import { IoGameControllerOutline } from "react-icons/io5";
import { LuUserX } from "react-icons/lu";
import { TbTournament } from "react-icons/tb";

import { IoPersonOutline } from "react-icons/io5";

import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
// import React from 'react';
// import ReactDOM from "react-dom/client";

import "./style.css";
import { Inter, Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

// color bacjground  : #F4F4FF
// dark blue #242F5C
//   #8988DE
// #BCBCC9
// #F4F4FF

// #EAEAFF
// #C0C7E0

// - sm : `min-width: 640px`
// - md : `min-width: 768px`
// - lg : `min-width: 1024px`
// - xl : `min-width: 1280px`
// - 2xl : `min-width: 1536px`

// -- data -----------------------------------------------------




let user = {
  name: "John Wick",
  path: "/images/avatarprofile.svg",
  status: "Online",
};

let friend1 = {
  name: "Henry smith",
  path: "/images/avatar3.svg",
  status: "Online",
  conversation: [
    {
      time: "02:22 PM",
      msg: "Hi John, up for a ping pong match this evening?",
      sender: "friend",
    },
    {
      time: "02:22 PM",
      msg: "Hi John, up for a ping pong match this evenihtrerthwrehwerhwrehwerhwerhwrehwherhrehehewhrhwerrhwerherheng?",
      sender: "friend",
    },
    { time: "02:23 PM", msg: "Sure, I'm in!", sender: "me" },
    { time: "02:24 PM", msg: "Great, see you at 7 PM!", sender: "friend" },
    { time: "02:25 PM", msg: "Perfect, see you then!", sender: "me" },

  ],
};
let friend2 = {
  name: "Lucy Smith",
  path: "/images/avatar2.svg",
  status: "Offline",
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

let tournament = {
  name: "tournament",// teh tournament must be named like that , casue i ve built the logic so that the name is tournament.
  path: "/images/avatarprofile.svg",
  status: "Online",
  conversation: [
    {
      time: "",
      msg: "Your turn is up! Please join the match now to secure your spot in the tournament.",
      sender: "friend",
    },
  ],

};




export default function ChatPage() {
  
  // Clicking on icons -------------------------------------------------------
  const [iconState, setIconState] = useState({ chatState: false, dropDownState: false, });
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

  // Handle click outside
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

  // -- friends functions -----------------------------------------------------








  function ProfileInfo({ user }) {
    return (
      <div className="profileInfo  w-full flex items-center overflow-hidden py-5 pl-5">
        <Image
          src={user.path}
          alt="avatarprofile"
          width={75}
          height={75}
          className="left-0 top-0 "
        />
        <div className=" ml-4  ">
          <h3 className="text-3xl  top-0 left-0 text-[#242F5C] ">
            {user.name}
          </h3>
          <p className="text-sm text-[#302FA5] left">{user.status}</p>
        </div>
      </div>
    );
  }

  function FriendInfo({ friend }) {
    let len = friend.conversation.length;
    return (
      <div
        className="friendInfo my-3 w-full flex flex-row items-center overflow-hidden "
        onClick={() => {
          setSelectedFriend(friend);
          setIconState({ chatState: false, dropDownState: false });
        }}
      >
        {friend.name === "tournament" ? (
          
          <TbTournament size={45} className="bg-[#EAEAFF] rounded-full text-[#242F5C] left-0 top-0 " />
        ) : (
          <Image src={friend.path} alt="avatarprofile" width={45} height={45} className="rounded-full left-0 top-0 " />
        )}



        <div className=" ml-2 ">
          <h3 className="text-2xl top-0 left-0 text-[#242F5C]">
            {friend.name}
          </h3>

          <p className="text-xs text-[#302FA5] overflow-hidden whitespace-nowrap text-ellipsis max-w-[15ch]">
            {len > 0 ? friend.conversation[len - 1].msg : "No messages yet"}
          </p>
        </div>
        <span className="text-xs text-[#242F5C] ml-auto hidden xl:block">
          {len > 0 ? friend.conversation[len - 1].time : ""}
        </span>
      </div>
    );
  }
  // -- messages functions -----------------------------------------------------
  function FriendChatInfo({ path, name, status }) {
    return (
      <div className="friendChatInfo p-5 flex items-center border-b-2 border-[#9191D6] border-opacity-30 ">
        
        {/* ChatListIcon  -------------------------------------------------------------- */}

        <IoIosChatboxes
          className="ChatListIcon block lg:hidden text-6xl text-[#242F5C]  mr-12 "
          onClick={switchChatState}
        />

        {/* hisProfile -------------------------------------------------------------- */}
        {selectedFriend !== null ? (
        
        <div className="hisProfile w-full flex items-center overflow-hidden ">
          
          {name === "tournament" ? (
            <TbTournament size={75} className="bg-[#EAEAFF] rounded-full text-[#242F5C] left-0 top-0 " />
          ) : (
            <Image src={path} alt="avatarprofile" width={75} height={75} className=" rounded-full left-0 top-0 " />
          )}



          <div className=" ml-4 hidden lg:block ">
            <h3 className="text-3xl  top-0 left-0 text-[#242F5C] ">{name}</h3>
            <p className="text-sm text-[#302FA5] left ">{status}</p>
          </div>
        </div>)
        : ( 
          <div className="w-full flex items-center overflow-hidden">
            <p className="text-sm text-[#242F5C] ">Please select a conversation</p>
          </div>
        )}



        {/* dropDownIcon  -------------------------------------------------------------- */}

        { selectedFriend && (<FaAngleDown
          className="dropDownIcon text-4xl ml-auto mr-8  text-[#242F5C]"
          onClick={switchDropDownState}
        />)}

        {iconState.dropDownState && (
          <ul
            ref={dropDownRef}
            className="list absolute right-16 top-20 bg-[#EAEAFF] border-[#C6C6E1] border-2 rounded-xl shadow-lg w-36 "
          >
            <li>
              {" "}
              <a className="p-2 text-lg text-[#242F5C] flex items-center border-[#C6C6E1] border-b-2">
                {" "}
                <IoPersonOutline /> <span className="ml-2">Profile</span>{" "}
              </a>{" "}
            </li>
            <li>
              {" "}
              <a className="p-2 text-lg text-[#242F5C] flex items-center">
                {" "}
                <IoGameControllerOutline />{" "}
                <span className="ml-2">Play with</span>{" "}
              </a>{" "}
            </li>
            <li>
              {" "}
              <a className="p-2 text-lg text-[#242F5C] flex items-center border-[#C6C6E1] border-t-2">
                {" "}
                <LuUserX /> <span className="ml-2">Block</span>{" "}
              </a>{" "}
            </li>
          </ul>
        )}
      </div>
    );
  }

  function FriendMsgBox({ time, msg }) {
    return (
      <div className="friendMsgBox ml-1 my-1">
        <span className="msgTime text-sm pl-5 text-[#242F5C] block">
          {time}
        </span>
        <p className="msgConetnt text-xl py-3 px-6 inline-block text-[#FFFFFF] bg-[#2C3E86] bg-opacity-80 rounded-3xl ">
          {msg}
        </p>
      </div>
    );
  }

  function MyMsgBox({ time, msg }) {
    return (
      <div className="myMsgBox my-1 mr-1 ml-auto flex flex-col">
        <span className="msgTime text-sm pr-5 text-[#242F5C] ml-auto">
          {time}
        </span>
        <p className="msgConetnt text-xl py-3 px-6 inline-block text-[#242F5C] bg-[#9191D6] bg-opacity-40 rounded-3xl ">
          {msg}
        </p>
      </div>
    );
  }

  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    return `${hours}:${formattedMinutes} ${ampm}`;
  }

  function createMyMsgBox(time, msg) {
    let theMsg;
    theMsg = document.createElement("div");
    theMsg.className = "myMsgBox my-1 mr-8 ml-auto flex flex-col";

    let timeSpan;
    timeSpan = document.createElement("span");
    timeSpan.className = "msgTime text-sm pr-5 text-[#242F5C] ml-auto";
    timeSpan.textContent = time;

    let msgParagraph;
    msgParagraph = document.createElement("p");
    msgParagraph.className =
      "msgConetnt text-xl py-3 px-6 inline-block text-[#242F5C] bg-[#9191D6] bg-opacity-40 rounded-3xl ";
    msgParagraph.textContent = msg;

    theMsg.appendChild(timeSpan);
    theMsg.appendChild(msgParagraph);

    return theMsg;
  }

  function sendMessage(e) {
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
  //-----------------------------------------------------------------------------------

  function MessagesBox({ friend }) {

    if (friend == null) {
      return (
        <div className="messagesBox md:w-full lg:w-3/5 p-2 h-full rounded-tr-xl rounded-br-xl bg-[#F4F4FF] flex flex-col ">
          <FriendChatInfo path="" name="" status="" /> 
        </div>
      );
    }
    return (
      <div className="messagesBox md:w-full lg:w-3/5 p-2 h-full rounded-tr-xl rounded-br-xl bg-[#F4F4FF] flex flex-col ">
        <FriendChatInfo
          path={friend.path}
          name={friend.name}
          status={friend.status}
        />

        {/* emplimenting peerToPeer */}
        <div className="peerToPeer flex flex-col flex-grow overflow-y-auto custom-scrollbar break-all ">
          {friend.conversation.map((message, index) =>
            message.sender === "friend" ? (
              <FriendMsgBox key={index} time={message.time} msg={message.msg} />
            ) : (
              <MyMsgBox key={index} time={message.time} msg={message.msg} />
            )
          )}
        </div>

        {/* emplimenting SendMsg */}
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
      <Navbar_test />
      <div className="parent flex flex-1 ">
        {/* hidden on smaller screens and only visible on screens 1280px or larger. */}
        <div className="sidebar hidden sm:block ">
          <Sidebar_test />
        </div>

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
                <h2 className="text-center text-1xl my-3 py-2 rounded-full bg-[#EAEAFF] text-[#242F5C]  overflow-hidden ">
                  Conversations
                </h2>

                <div className="MessagesList flex flex-col ">
                  <FriendInfo friend={tournament} />
                  <FriendInfo friend={friend1} />
                  <FriendInfo friend={friend2} />
                  
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
