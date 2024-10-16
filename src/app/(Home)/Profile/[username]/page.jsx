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

// //data ------------------------------------------
let user1 = {
  userName: "John Wick",
  avatar: "/images/avatarprofile.svg",
  status: "Online",
  level: 1,
  score: "5-4",
  result: "Win",
  map: "Blue",
};

let user2 = {
  avatar: "/images/avatar3.svg",
  userName: "Ali",
  score: "5-4",
  result: "Win",
  map: "Blue",
  status: "Offline",
  level: 2,
};

let user3 = {
  avatar: "/images/avatarprofile.svg",
  userName: "Malcom Smith",
  score: "3-4",
  result: "Lose",
  map: "Blue",
  status: "Offline",
  level: 3,
};


export default function Profile() {

  const params = useParams();
  const userSearchedFor = params.username;

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => 
    {
      const response = await axios.get("/profile.json");
      const users = response.data;

      const usr = users.find((user) => user.userName === userSearchedFor);

      if(usr)
        {
          setUserData(usr);
          console.log(usr);
        }
      else
        {
          console.log("User not found)");
        }

    };
    fetchUserData();
  
  }, [userSearchedFor]);


  

  
   
  return (
    <DashProvider>
      <div
        className={`flex-1 overflow-y-auto p-4 flex flex-wrap items-center justify-center h-full ${montserrat.variable}`}
      >
        <div className="flex flex-col lg:flex-row w-full lg:mx-8 items-center justify-center gap-8">
          {userData ? 
            (<UserProfile user={userData} />)
            :
            (<div>NULL OBJECT</div>)
          }

          <LeaderBoard first={user3} second={user2} third={user3} />
        </div>

        <MatchHistory />
      </div>
    </DashProvider>
  );
}
