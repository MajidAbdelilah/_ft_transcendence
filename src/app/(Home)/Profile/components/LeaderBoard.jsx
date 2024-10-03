// import { div } from "framer-motion/client";
// import { DashContext } from "../../Dashboard/Dashcontext";
// import { useContext } from "react";


import { BsChatLeftText } from "react-icons/bs";
import { MdOutlinePersonAddAlt } from "react-icons/md";

// -- colors -----------------------------------------------------co
//  #F4F4FF   #242F5C   #8988DE   #BCBCC9   #F4F4FF   #EAEAFF   #C0C7E0

export default function LeaderBoard () {


  
    return (
        <div     className="flex border border-[#BCBCC9] rounded-2xl bg-[#F4F4FF] h-40">

        
        <div className="part1 relative w-1/3 p-2 rounded-l-2xl bg-[#F4F4FF] border-[#BCBCC9] border-r-2 "> 
            <img 
                src="/images/avatar3.svg" 
                alt="Profile"
                className="absolute w-20 h-20 rounded-full border-2 border-[#BCBCC9] -top-10 left-6"
            />


            <div className="mt-10 text-sm font-bold text-[#242F5C]">John Smith</div>
            <span className="text-sm text-[#8988DE]">Online</span>




            <div className="flex flex-row mt-2 text-[#text-[#242F5C]">
                <BsChatLeftText />
                <MdOutlinePersonAddAlt />
            </div>
 
        </div>



        






        {/* <div className="border-l-2 border-gray-300 h-full mx-4"></div> */}
        {/* Right Section (2/3 width) */}
        <div className="part2 w-2/3 p-4">
            {/* Right section content can go here */}
            <p>Additional profile infor can go here.</p>
        </div>
        </div>
        
    )
}



