"use client";

import MatchHistory from "../Dashboard/MatchHistory";
import DashProvider from "../Dashboard/Dashcontext";
// export const DashContext = createContext();
// import MatchHistory from "../Dashboard/MatchHistory";

export default function Profile() {
  return (
    <div className="flex-1 overflow-y-auto p-4 flex flex-wrap items-center justify-center h-full">
      <div className="p-8  bg-red-400 ">degwqrgrhthtwerhthththre</div>
      <div className="p-8  bg-yellow-400 ">degwqrgrhthtwerhthththre</div>
      {/* <PlayNow />
        <Achievements />  */}
      {/* <MatchHistory /> */}
      <DashProvider>
        <MatchHistory />
      </DashProvider>
    </div>
  );
}
