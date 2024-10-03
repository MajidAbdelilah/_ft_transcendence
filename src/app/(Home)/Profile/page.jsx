"use client";

import MatchHistory from "../Dashboard/MatchHistory";
import DashProvider from "../Dashboard/Dashcontext";



import { Inter, Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});







import LeaderBoard from "./components/LeaderBoard";


export default function Profile() {
  return (
    <DashProvider>
      <div className={`flex-1 overflow-y-auto p-4 flex flex-wrap items-center justify-center h-full ${montserrat.variable}`}>

      <LeaderBoard />
      {/* <UserProfile /> */}
      <MatchHistory />
      </div>
    </DashProvider>
  );
}
