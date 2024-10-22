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


export default function Chat() {
  // loggedInUser -------------------------------------------------------

  const userAgent = navigator.userAgent;
  let UserId; // Assume this is the logged-in user's ID
  let [loggedInUser, setLoggedInUser] = useState(null);
  
  if (userAgent.includes("Chrome")) {
    UserId = 1; // Chrome
  } else if (userAgent.includes("Firefox")) {
    UserId = 3; // Firefox

  } else {
    UserId = 3; // Default for other browsers
  }
  

  // Fetch data -------------------------------------------------------
  let [fullFriendConversations, setFullFriendConversations] = useState([]);
  
  useEffect(() => {
    async function mainFetch() {
      try {
        const response = await fetch('/data.json');
        const data = await response.json();
  
        // Find the logged-in user
        const usr = data.find((user) => user.userId === UserId);
        // console.log("LoggedInUser : ",usr);
        setLoggedInUser(usr);
  
        if (usr && usr.conversations) {
          // Create a new array to store friend objects and their conversations
          const conversationsWithFriends = usr.conversations.map((conversation) => {
            // Find the friend object based on the friendId
            const friend = data.find((user) => user.userId === conversation.friendId);
  
            return {
              friendData: friend, // Include full friend details (name, status, etc.)
              messages: conversation.messages, // Include the conversation messages
            };
          });
  
          // Store this array in state for later processing
          setFullFriendConversations(conversationsWithFriends);
  
          // Log the result to the console for now
          // console.log("Full Friend Conversations:", conversationsWithFriends);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  
    mainFetch();
  }, []);
  // console.log("Full Friend Conversations outside mainFetch:", fullFriendConversations);
//  stage one get an array of the id and teh converstaon
// create a cecond array where you change the id with the user data, cause you need his name and avatar.




const [selectedFriend, setSelectedFriend] = useState(null);
const [selectedConversation, setSelectedConversation] = useState(null);

  // Clicking on icons -------------------------------------------------------
  const [iconState, setIconState] = useState({
    chatState: false,
    dropDownState: false,
  });
 

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

  function MessagesBox({ loggedInUser, friend, conversation }) {
    // no friend selected yet just return FriendChatInfo compomet with empty friend object
    if (friend == null) {
      let noFriendYet = { avatar: "", name: "", status: "" };
      return (
        <div className="messagesBox w-full lg:w-3/5 p-2 h-full rounded-tr-xl rounded-br-xl  flex flex-col ">
          <FriendChatInfo
          loggedInUser={loggedInUser}
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
      <div className="messagesBox w-full lg:w-3/5 p-2 h-full rounded-tr-xl rounded-br-xl flex flex-col ">
        {/* FriendChatInfo ---------------------------------------------------------------------------------------*/}
        <FriendChatInfo
          loggedInUser={loggedInUser}
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
          {conversation.map((message, index) =>
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

  if (loggedInUser === null) return (<div>loggedInUser is null...</div>);

  return (


        <div className="chattSection flex-1 p-5 md:p-10 h-full w-full ">
          <div className="boxes relative flex h-full w-full border-2 border-[#C6C6E1] bg-[#F4F4FF] rounded-xl flex-row-revers ">
            {/* friendsBox ------------------------------------------------------- */}

            <div
              ref={iconState.chatState ? chatRef : null}
              className={`menuList w-full lg:w-2/5 h-full flex-col lg:block absolute z-50 lg:relative bg-[#F4F4FF] rounded-xl ${
                iconState.chatState
                  ? "block bg-[#F4F4FF]  w-full top-32 lg:top-0  h-4/5 lg:h-full"
                  : "hidden "
              } `}
            >
              <div className="friendsBox  p-2 rounded-tl-xl rounded-bl-xl  border-r-2  border-[#C6C6E1]  flex-col flex-grow overflow-y-auto custom-scrollbar  h-4/5 lg:h-full ">
              
                <ProfileInfo avatar={loggedInUser.avatar} name={loggedInUser.name} status={loggedInUser.status}/>

                <ConversationsHeader />

                <div className="MessagesList flex flex-col">
                  {/* <FriendInfo  friend={tournament} conversation={tournament.conversation} 
                    onClick={() => {
                      setSelectedFriend(tournament);
                      setIconState({ chatState: false, dropDownState: false });
                    }}
                  /> */}
                  <FriendInfo  
                  name={fullFriendConversations[0].friendData.name} 
                  avatar={fullFriendConversations[0].friendData.avatar} 
                  conversation={fullFriendConversations[0].messages} 
                    onClick={() => {
                      setSelectedFriend(fullFriendConversations[0].friendData);
                      setSelectedConversation(fullFriendConversations[0].messages);
                      setIconState({ chatState: false, dropDownState: false });
                    }}
                  />
                  <FriendInfo friend={fullFriendConversations[1].friendData} 
                  name={fullFriendConversations[1].friendData.name} 
                  avatar={fullFriendConversations[1].friendData.avatar}   
                  conversation={fullFriendConversations[1].messages} 
                    onClick={() => {
                      setSelectedFriend(fullFriendConversations[1].friendData);
                      setSelectedConversation(fullFriendConversations[1].messages);
                      setIconState({ chatState: false, dropDownState: false });
                    }}
                  />
                  
                </div>
              </div>
            </div>

            <MessagesBox loggedInUser={loggedInUser} friend={selectedFriend}  conversation={selectedConversation}/>
          </div>
        </div>

  );
}
