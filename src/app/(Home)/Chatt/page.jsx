"use client";

import Image from "next/image";

// -- icons -----------------------------------------------------

// -- hooks -----------------------------------------------------
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useUser } from "../../UserContext";

// -- components -----------------------------------------------------

import Sidebar from "../../sidebar";
import Navbar from "../../Navbar";

import ProfileInfo from "./components/ProfileInfo";
import FriendInfo from "./components/FriendInfo";
import { FriendMsgBox, MyMsgBox } from "./components/peerToPeer";
import { FriendChatInfo } from "./components/FriendChatInfo";
import { ConversationsHeader } from "./components/BasicComp";
import { SendMsgBox } from "./components/SendMsgBox";
import axios from 'axios';


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


  // LoggedInUser -----------------------------------------------------------------------------------------
  const LoggedInUser = useUser();
  console.log("LoggedInUser", LoggedInUser.userData);
  // if (LoggedInUser.userData === null) return (<div>LoggedInUser Loading...</div>);

// LoggedInUser -----------------------------------------------------------------------------------------
  



  let [loggedInUser, setLoggedInUser] = useState(
    {
      userName: "",
      userId: 10,
      name: "",
      avatar: "/images/avatarprofile.svg",
      status: "Online",
      level: 1,
      score: "",
      result: "",
      map: "",
    }
  );

  
  useEffect(() => {

    if (LoggedInUser.userData !== null) {

      const filledUser = {
        userName: LoggedInUser.userData.username || '',   
        userId: LoggedInUser.userData.id || null,        
        name: LoggedInUser.userData.username || 'Unknown', 
        avatar: "/images/avatarprofile.svg", 
        status: 'Online', 
        level: 0,
        score: "",
        result: "",
        map: "",
      };
  
      // Update the state with the filled user data
      setLoggedInUser(filledUser);
      // console.log("filledUser", filledUser);
      // console.log("loggedInUser ============= ", loggedInUser);

    }
  }, [LoggedInUser]); 


//  -----------------------------------------------------------------------------------------
let [fullFriendConversations, setFullFriendConversations] = useState([]);














  

  //       // 2 - create and full the conversationsWithFriends


  //       // if (usr && usr.conversations) {
  //       //   const conversationsWithFriends = usr.conversations.map((conversation) => 
  //       //   {
  //       //     // Find the friend object based on the friendId
  //       //     const friend = data.find((users) => users.userId === conversation.friendId);
  
  //       //     return {
  //       //       friendData: friend, // Include full friend details (name, status, etc.)
  //       //       messages: conversation.messages, // Include the conversation messages
  //       //     };
  //       //   });
  //       //   setFullFriendConversations(conversationsWithFriends);
  //       // }

  //     }, []);


// -----------------------------------------------------------------------------------------

  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  
  

// Clicking on icons -----------------------------------------------------------------------------------------
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

// Hide components when clikcing outside  -----------------------------------------------------------------------------------------

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




// -----------------------------------------------------------------------------------------

  function MessagesBox({ loggedInUser, friend, conversation }) {

    // websocket -----------------------------------------------------------------------------------------
      // const [socket, setSokcet] = useState(null);
      // const [messages, setMessages] = useState(conversation);


      // useEffect(() =>{

      //   // step 1 : Initialize the WebSocket connection
      //   const socketInstance = new WebSocket('ws://localhost:8000');
      //   setSokcet(socketInstance);

      //   // step 2 :  check that the loogedInUser and the friend are part of the message - and add the message to the conversation
      //   socketInstance.onmessage = (event) => {
      //     const message = JSON.parse(event.data);
      //     if(
      //       (message.sender === friend.userId       && message.reciever === loggedInUser.userId) || // case loggedInUser recieves a message
      //       (message.sender === loggedInUser.userId && message.reciever === friend.userId))         // case loggedInUser sends a message
      //       {
      //         setMessages((prevMessages) => [...prevMessages, message]);
      //       }
      //   };

      //   // step 3 :  cleanup the WebSocket on component unmount
      //   return () => { socketInstance.close();};


      // }, [friend, loggedInUser]);



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
      // console.log(conversation),
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
            message.sender === friend.userId ? (
              <FriendMsgBox key={index} time={message.time} msg={message.content} />
            ) : (
              <MyMsgBox key={index} time={message.time} msg={message.content} />
            )
          )}
        </div>

        {/*  SendMsgBox ---------------------------------------------------------------------------------------*/}
        <SendMsgBox loggedInUser={loggedInUser} friend={friend} />
      </div>
    );
  }
  
  if (loggedInUser === null) return (<div>loggedInUser is null...</div>);

  return (


        <div className="chattSection flex-1 p-5 md:p-10 h-full w-full ">
          <div className="boxes relative flex h-full w-full border-2 border-[#C6C6E1] bg-[#F4F4FF] rounded-xl flex-row-revers overflow-auto">
            {/* friendsBox ------------------------------------------------------- */}

            <div
              ref={iconState.chatState ? chatRef : null}
              className={`menuList w-full lg:w-2/5 h-full flex-col lg:block absolute z-50 lg:relative bg-[#F4F4FF] rounded-xl ${
                iconState.chatState
                  ? "block bg-[#F4F4FF]  w-full top-32 lg:top-0  h-4/5 lg:h-full "
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

  
                  {fullFriendConversations.map((friendConversation, index) => (
                    <FriendInfo
                      key={index}
                      name={friendConversation.friendData.name}
                      avatar={friendConversation.friendData.avatar}
                      conversation={friendConversation.messages}
                      onClick={() => {
                        setSelectedFriend(friendConversation.friendData);
                        setSelectedConversation(friendConversation.messages);
                        setIconState({ chatState: false, dropDownState: false });
                      }}
                    />
                  ))}







                  
                </div>
              </div>
            </div>

            <MessagesBox loggedInUser={loggedInUser} friend={selectedFriend} conversation={selectedConversation}/>
          </div>
        </div>

  );
}





// ---------------------------------------------------------------









