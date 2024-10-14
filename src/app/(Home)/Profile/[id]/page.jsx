"use client";

import MatchHistory from "../../Dashboard/MatchHistory";
import DashProvider from "../../Dashboard/Dashcontext";

import UserProfile from "./components/UserProfile";
import LeaderBoard from "./components/LeaderBoard";

import { Inter, Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

//data ------------------------------------------
let user1 = {
  name: "John Wick",
  avatar: "/images/avatarprofile.svg",
  status: "Online",
  level: 1,
  score: "5-4",
  result: "Win",
  map: "Blue",
};

let user2 = {
  avatar: "/images/avatar3.svg",
  name: "Ali",
  score: "5-4",
  result: "Win",
  map: "Blue",
  status: "Offline",
  level: 2,
};

let user3 = {
  avatar: "/images/avatarprofile.svg",
  name: "Malcom Smith",
  score: "3-4",
  result: "Lose",
  map: "Blue",
  status: "Offline",
  level: 3,
};

export default function Profile() {

  
    // const router = useRouter();
    // const { id } = router.query; // Get the user ID from the URL
  
  return (
    <DashProvider>
      <div
        className={`flex-1 overflow-y-auto p-4 flex flex-wrap items-center justify-center h-full ${montserrat.variable}`}
      >
        <div className="flex flex-col lg:flex-row w-full lg:mx-8 items-center justify-center gap-8">
          <UserProfile user={user1} />
          <LeaderBoard first={user1} second={user2} third={user3} />
        </div>

        <MatchHistory />
      </div>
    </DashProvider>
  );
}
