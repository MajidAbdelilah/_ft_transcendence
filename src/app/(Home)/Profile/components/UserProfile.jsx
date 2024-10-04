// import { div } from "framer-motion/client";
// import { DashContext } from "../../Dashboard/Dashcontext";
// import { useContext } from "react";

import { BsChatLeftText } from "react-icons/bs";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { LuUserX } from "react-icons/lu";
// import { DashContext } from "../../Dashboard/Dashcontext";
// import { useContext } from "react";
// -- colors -----------------------------------------------------co
//  #F4F4FF   #242F5C   #8988DE   #BCBCC9   #F4F4FF   #EAEAFF   #C0C7E0





function Part1({user}) {
  return (
    <div className="part1 relative w-1/3 p-2 rounded-l-2xl bg-[#F4F4FF] border-[#BCBCC9] border-r-2 min-w-32 ">


    <div className="flex flex-col items-center">
        <img
        src={user.avatar}
        alt="Profile"
        className="absolute w-20 h-20 rounded-full border-2 border-[#BCBCC9] -top-10  shadow-md shadow-[#BCBCC9]"
        />
      <div className="mt-12 text-sm font-bold text-[#242F5C]">
        {user.name}
      </div>
      <span className="text-xs mt-1 text-[#8988DE]">{user.status}</span>

      <div className="flex flex-row mt-2 text-[#242F5C] ">
        <BsChatLeftText className="mr-1 text-lg" />
        <MdOutlinePersonAddAlt className="ml-1 text-xl" />
      </div>
    </div>
  </div>
  );
}

function Part2({user}) {
  return (
      <div className="part2 w-2/3 p-4 flex flex-col items-end ml-auto   ">

      <LuUserX className="blockIcon text-[#242F5C] text-3xl" />

      <div className="level flex flex-col items-start w-full mb-4">
        <span className="text-xs text-[#242F5C] font-semibold">Level {user.level}</span>

        
        <div className="relative w-full h-3 bg-gray-300 rounded-full mt-1 ">
          
          <div
            className="absolute top-0 left-0 h-3 bg-[#8988DE] rounded-full "
            style={{ width: `${user.level * 20}%` }} 
          ></div>
        </div>

        
        <div className="flex justify-between w-full mt-1 text-[#242F5C] text-xs ">
          <span >Next level</span>
          <span >Level {user.level + 1}</span>
        </div>


      </div>
      <button className="gameStats bg-[#242F5C] p-1  px-2 text-[#F4F4FF] text-xs rounded-full font-semibold">
          GAME STATS
      </button>
    </div>
  )
}


export default function UserProfile({user}) {
  

  return (
    <div className="flex shadow-md shadow-[#BCBCC9] border border-[#BCBCC9] rounded-2xl bg-[#F4F4FF] h-40 w-[80%]">
      
      <Part1 user={user} />
      <Part2 user={user}/>

    </div>
  );
}
