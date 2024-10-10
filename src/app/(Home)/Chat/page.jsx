"use client";

import Image from "next/image";

// -- icons -----------------------------------------------------

// -- hooks -----------------------------------------------------
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";

// -- components -----------------------------------------------------

import Sidebar from "../../sidebar";
import Navbar from "../../Navbar";

import ProfileInfo from "./components/ProfileInfo";
import FriendInfo from "./components/FriendInfo";
import { FriendMsgBox, MyMsgBox } from "./components/peerToPeer";
import { FriendChatInfo } from "./components/FriendChatInfo";
import { ConversationsHeader } from "./components/BasicComp";
import { SendMsgBox } from "./components/SendMsgBox";

// -- font -----------------------------------------------------
import { Inter, Montserrat } from "next/font/google";
import path from "path";
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

// -- colors -----------------------------------------------------co
//  #F4F4FF   #242F5C   #8988DE   #BCBCC9   #F4F4FF   #EAEAFF   #C0C7E0

// -- data for testing -----------------------------------------------------

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
  path: "/images/avatarprofile.svg",
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
  name: "tournament", // ###############  WARNING   ########## the tournament must be named like that , casue i ve built the logic so that the name is tournament. path: "/images/avatarprofile.svg", status: "Online",
  conversation: [
    {
      time: "09:15 AM",
      msg: "Your turn is up! Please join the match now to secure your spot in the tournament.",
      sender: "friend",
    },
  ],
};

// -- data ---------------------------------------------------------------------------------------------------------------

export default function ChatPage() {
  // -------------------------------------------------------

  let UserId = 1 ;// find a way to get his id later
  let [loggedInUser, setLoggedInUser] = useState(null);
  
  useEffect(() => {
    async function mainFetch() {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      const data = await response.json();
      // setUsers(data);
      const usr = data.find(user => user.id === UserId);
      console.log(usr);
      setLoggedInUser(usr);
      // console.log(data);
    }
    mainFetch();
  }, []);




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

  // -------------------------------------------------------

  function MessagesBox({ friend }) {
    // no friend selected yet just return FriendChatInfo compomet with empty friend object
    if (friend == null) {
      let noFriendYet = { path: "", name: "", status: "" };
      return (
        <div className="messagesBox w-full lg:w-3/5 p-2 h-full rounded-tr-xl rounded-br-xl  flex flex-col ">
          <FriendChatInfo
            friend={noFriendYet}
            switchChatState={switchChatState}
            selectedFriend={selectedFriend}
            switchDropDownState={switchDropDownState}
            iconState={iconState}
            dropDownRef={dropDownRef}
            setIconState={setIconState}
          />
        </div>
      );
    }
    return (
      <div className="messagesBox w-full lg:w-3/5 p-2 h-[88vh] rounded-tr-xl rounded-br-xl flex flex-col ">
        {/* FriendChatInfo ---------------------------------------------------------------------------------------*/}
        <FriendChatInfo
          friend={friend}
          switchChatState={switchChatState}
          selectedFriend={selectedFriend}
          switchDropDownState={switchDropDownState}
          iconState={iconState}
          dropDownRef={dropDownRef}
          setIconState={setIconState}
        />

        {/* peerToPeer ---------------------------------------------------------------------------------------*/}
        <div className="peerToPeer flex flex-col  flex-grow overflow-y-auto custom-scrollbar break-all ">
          {friend.conversation.map((message, index) =>
            message.sender === "friend" ? (
              <FriendMsgBox key={index} time={message.time} msg={message.msg} />
            ) : (
              <MyMsgBox key={index} time={message.time} msg={message.msg} />
            )
          )}
        </div>

        {/*  SendMsgBox ---------------------------------------------------------------------------------------*/}
        <SendMsgBox friend={friend} />
      </div>
    );
  }

  if (!loggedInUser) return null;
  return (


        <div className="chattSection flex-1 p-5 md:p-10 h-full w-full ">
          <div className="boxes relative flex h-full w-full border-2 border-[#C6C6E1] bg-[#F4F4FF] rounded-xl flex-row-revers ">
            {/* friendsBox ------------------------------------------------------- */}

            <div
              ref={iconState.chatState ? chatRef : null}
              className={`menuList w-full lg:w-2/5 h-full flex-col lg:block absolute z-50 lg:relative bg-[#F4F4FF] rounded-xl ${
                iconState.chatState
                  ? "block bg-[#F4F4FF]  w-full top-32 lg:top-0 "
                  : "hidden"
              } `}
            >
              <div className="friendsBox  p-2 rounded-tl-xl rounded-bl-xl  border-r-2  border-[#C6C6E1] h-full  flex-col flex-grow overflow-y-auto custom-scrollbar bg-[#F4F4FF]">
              
                <ProfileInfo path="/images/avatarprofile.svg" name={loggedInUser.name} status={loggedInUser.username}/>

                <ConversationsHeader />

                <div className="MessagesList flex flex-col">
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

  );
}
