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





function Part1({user, isSelf}) {
  return (
    <div className="part1 relative w-1/3 p-2 rounded-l-2xl bg-[#F4F4FF] border-[#BCBCC9] border-r-2 min-w-32 ">


    <div className="flex flex-col items-center">
        <img
        src={user.avatar}
        alt="Profile"
        className="absolute w-20 h-20 rounded-full border-2 border-[#BCBCC9] -top-10  shadow-md shadow-[#BCBCC9]"
        />
      <div className="mt-12 text-sm md:text-md lg:text-lg xl:text-xl font-bold text-[#242F5C]">
        {user.userName}
      </div>
      <span className="text-xs md:text-sm lg:text-md xl:text-lg mt-1 text-[#8988DE]">{user.status}</span>
      {isSelf === false &&
      (<div className="flex flex-row mt-2 text-[#242F5C] ">
        <BsChatLeftText className="mr-1 text-lg lg:text-xl" />
        <MdOutlinePersonAddAlt className="ml-1 text-xl lg:text-2xl" />
      </div>)}
    </div>
  </div>
  );
}

function Part2({user, isSelf}) {
  return (
      <div className="part2 w-2/3 p-4 flex flex-col items-end ml-auto   ">

      <LuUserX  className={`blockIcon text-[#242F5C] text-3xl ${isSelf === true ? "invisible" : "visible"}`} />

      <div className="level flex flex-col items-start w-full mb-4">
        <span className=" text-[#242F5C] font-semibold text-xs ">Level {user.level}</span>

        
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
          Level  {user.level}
      </button>
    </div>
  )
}


export default function UserProfile({user, isSelf}) {
  
    if(!user)
      return (<div></div>);
    return (
    <div className="flex shadow-md shadow-[#BCBCC9] border border-[#BCBCC9] rounded-2xl bg-[#F4F4FF] h-40 w-[80%] mt-10">
      
      <Part1 user={user} isSelf={isSelf}/>
      
      <Part2 user={user} isSelf={isSelf}/>

    </div>
  );
}
