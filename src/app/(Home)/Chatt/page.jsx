"use client";

import Image from "next/image";

// -- icons -----------------------------------------------------

// -- hooks -----------------------------------------------------
import { useState } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useUser } from "../../contexts/UserContext";

// -- components -----------------------------------------------------

import Sidebar from "../../sidebar";
import Navbar from "../../Navbar";

import ProfileInfo from "./components/ProfileInfo";

import { FriendMsgBox, MyMsgBox } from "./components/peerToPeer";
import { FriendChatInfo } from "./components/FriendChatInfo";
import { ConversationsHeader } from "./components/BasicComp";
import { SendMsgBox } from "./components/SendMsgBox";
import axios from 'axios';
import { fetchOldConversation } from './components/fetchOldConversation';
import toast, { Toaster } from 'react-hot-toast';
import ListFriends from "./components/ListFriends";


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
  // console.log("LoggedInUser-------------- :", LoggedInUser.userData);



 
  // re comment those stuff in useeffect search for http://127.0.0.1:8000/api/user/

  // for testing perpse :

  // const LoggedInUser = {
  //   userData: {
  //     username: "userNameLoading",
  //     id: 10,
  //     name: "nameLoading",
  //     avatar: "/images/avatarprofile.svg",
  //     status: "Online",
  //     level: 1,
  //     score: "",
  //     result: "",
  //     map: "",
  //   }
  // };
  // console.log("LoggedInUser", LoggedInUser.userData);
  // if (LoggedInUser.userData === null) return (<div>LoggedInUser Loading...</div>);

// LoggedInUser -----------------------------------------------------------------------------------------
  



  let [loggedInUser, setLoggedInUser] = useState(
    {
      username: "",
      id: 0,
      name: "",
      avatar: "",
      status: "",
      level: 0,
      score: "",
      result: "",
      map: "",
    }
  );

  
  useEffect(() => {

    if (LoggedInUser.userData !== null && loggedInUser.username !== LoggedInUser.userData.username) {

      let filledUser = {
        username: LoggedInUser.userData.username || 'Loading',   
        id: LoggedInUser.userData.id || null,        
        name: LoggedInUser.userData.username || 'Loading', 
        avatar: "/images/avatarprofile.svg", 
        status: 'Loading', 
        level: 0,
        score: "",
        result: "",
        map: "",
      };
  
      // Update the state with the filled user data
      setLoggedInUser(filledUser);
      // console.log("loggedInUser", filledUser);
      // console.log("loggedInUser ============= ", filledUser);

    }
  }, [LoggedInUser.userData]); 


//  -----------------------------------------------------------------------------------------

const [selectedFriend, setSelectedFriend] = useState(null);
const getSelectedFriend = (friend) => {
  setSelectedFriend(friend); // Update the selected friend state
  // console.log("Selected Friend:", friend); // Log the selected friend
};





// -----------------------------------------------------------------------------------------

  // const [selectedConversation, setSelectedConversation] = useState(null);
  
  

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

  function MessagesBox({ friend }) {
    const [conversation, setConversation] = useState([]);

    useEffect(() => {
      const loadConversation = async () => 
        {
          if(friend === null) return;
          const conversation = await fetchOldConversation(loggedInUser, friend.user);
          setConversation(conversation);
        };
        loadConversation();
    }, [loggedInUser, friend]);

    //  -----  impliment the logic of reciving a message using websocket  -------------------------------------------------------

    // i supose to get the message weeither i am a sender or reciver , and insert it inside conversation , and map function should simply desplay it to the user 




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
    // console.log("friend", friend);
    return (
      // console.log(conversation),
      <div className="messagesBox w-full lg:w-3/5 p-2 h-full rounded-tr-xl rounded-br-xl flex flex-col ">
        {/* FriendChatInfo ---------------------------------------------------------------------------------------*/}
        <FriendChatInfo
          loggedInUser={loggedInUser}
          friend={friend.user}
          switchChatState={switchChatState}
          selectedFriend={selectedFriend}
          switchDropDownState={switchDropDownState}
          iconState={iconState}
          dropDownRef={dropDownRef}
          setIconState={setIconState}
        />
        
        {/* Conversataion ---------------------------------------------------------------------------------------*/}
        <div className="Conversation flex flex-col flex-grow overflow-y-auto custom-scrollbar break-words p-2">
          {Array.isArray(conversation) && conversation.length > 0 ? (
            conversation.map((message, index) =>
              message.sender === friend.user.username ? (
                <FriendMsgBox key={index} time={message.message_date} msg={message.message_content} />
              ) : (
                <MyMsgBox key={index} time={message.message_date} msg={message.message_content} />
              )
            )
          ) : (
            <p className="text-center text-gray-500">No conversation yet.</p>
          )}
        </div>



        {/*  SendMsgBox ---------------------------------------------------------------------------------------*/}
        <SendMsgBox loggedInUser={loggedInUser} friend={friend.user} />
      </div>
    );
  }
  
  if (loggedInUser === null) return (<div> Loading...</div>);

  return (


        <div className="chattSection flex-1 p-5 md:p-10 h-full w-full ">
          <Toaster /> 
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
              
                <ProfileInfo avatar={loggedInUser.avatar} name={loggedInUser.username} status={loggedInUser.status}/>

                <ConversationsHeader />

                <div className="MessagesList flex flex-col">




                {/* <i should fetch and list friends here ></> */}
                <ListFriends getSelectedFriend={getSelectedFriend} switchChatState={switchChatState} />


                  
                </div>
              </div>
            </div>
            {/* <i should show the converation with the friend here  */}
            {/* we need to log the selected friend first to make siure we managed to get  */}
            {/* <ConversationSec selectedFriend={selectedFriend} /> */}
            {/* <ConversationSec selectedFriend={selectedFriend} /> */}
            <MessagesBox friend={selectedFriend} />







             </div>
        </div>

  );
}





// ---------------------------------------------------------------









