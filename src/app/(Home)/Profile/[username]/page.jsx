"use client";



import MatchHistory from "../../Dashboard/MatchHistory";
import DashProvider from "../../Dashboard/Dashcontext";

import UserProfile from "./components/UserProfile";
import LeaderBoard from "./components/LeaderBoard";

import { useParams } from 'next/navigation'; 
import axios from "axios";
import { useEffect, useState } from "react";

import { Inter, Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

import { useUser } from "../../../contexts/UserContext";
// //data ------------------------------------------
let user1 = {
  "userName": "john",
  "userId": 1,
  "name" : "John Doe",
  "avatar": "/images/avatarprofile.svg",
  "status": "Online",
  "level": 1,
  "score": "5-4",
  "result": "Win",
  "map": "Blue"
};

let user2 = {
  "userName": "lucy",
  "userId": 2,
  "name" : "lucy wilimas",
  "avatar": "/images/avatar3.svg",
  "status": "Offline",
  "level": 2,
  "score": "5-4",
  "result": "Win",
  "map": "Blue"
};

let user3 = {
  "userName": "malcom",
  "userId": 3,
  "name" : "Malcom smith",
  "avatar": "/images/avatarprofile.svg",
  "status": "Offline",
  "level": 1,
  "score": "3-4",
  "result": "Lose",
  "map": "Blue"
};


export default function Profile() {
  const [isMatchHistoryLoaded, setIsMatchHistoryLoaded] = useState(false);

  // Use a callback to update the loading state when matches are available
  const handleMatchHistoryLoaded = (isLoaded) => {
    setIsMatchHistoryLoaded(isLoaded);
  };

  // loggedInUser -----------------------------------------------------------------------------------

  // let UserId = 1; // Assume this is the logged-in user's ID
  // let [loggedInUser, setLoggedInUser] = useState(null);
  // // if (!loggedInUser) return null;

  // useEffect(() =>  {
  //   async function fetchLoggedInUser() {
  //     const response = await axios.get("/profile.json");
  //     const users = response.data;

  //     // find the loggedInUser
  //     const usr = users.find((user) => user.userId === UserId);
  //     // console.log("LoggedInUser : ",usr);
  //     setLoggedInUser(usr);
  //   }
  //   fetchLoggedInUser()
  // }, [])

  
  const LoggedInUser = useUser();

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
      console.log("loggedInUser ============= ", loggedInUser);

    }
  }, [LoggedInUser]); 







  // searchedText - Searched user from the URL -------------------------------------------------------
  const params = useParams();
  const searchedText = params.username;

  const [userSearchedFor, setuserSearchedFor] = useState(null);

  useEffect(() => {
    const fetchuserSearchedFor = async () => 
    {
      const response = await axios.get("/profile.json");
      const users = response.data;

      const usr = users.find((user) => user.userName === searchedText);

      if(usr)
        {
          setuserSearchedFor(usr);
          console.log("LoggedInUser : ",usr);

        }
      else
        {
          console.log("User not found)");
        }

    };
    fetchuserSearchedFor();
  
  }, [searchedText]);


  if(loggedInUser === null || userSearchedFor === null) {
    return null;
  }

  let isSelf = loggedInUser && loggedInUser.userName === searchedText;

  
   
  return (
    // <DashProvider>
      <div
        className={`flex-1 overflow-y-auto p-4 flex flex-wrap items-center justify-center h-full ${montserrat.variable}`}
      >
        <div className="flex flex-col lg:flex-row w-full  items-center justify-center lg:gap-10 xl:gap-32 2xl:gap-60      lg:mx-10 xl:mx-28 2xl:mx-40">
          {userSearchedFor && (<UserProfile loggedInUser={loggedInUser} user={userSearchedFor} isSelf={isSelf}/>)}
          
          <LeaderBoard first={user3} second={user2} third={user3} />
        </div>

        {/* <MatchHistory /> */}


      </div>
    // </DashProvider>
  );
}
