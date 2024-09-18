import Image from "next/image";
import { DashContext } from "./Dashcontext";
import { useContext } from "react";

function PlayNow() {
    const DashData = useContext(DashContext);
    return (
        <div
            className={` ${
              !DashData.isMobile
                ? "bg-[#F4F4FF] drop-shadow-md rounded-3xl border-[#BCBCC9] mt-10 md:w-[70%] shadow-md shadow-[#BCBCC9] md:h-[48%] lg:w-[800px] lg:h-[500px] "
                : "min-h-[235px]"
            } w-[90%] h-[25%] relative p-4 flex flex-col justify-center items-center`}
          >
            <div className="w-full h-[80%] relative mb-4">
              <Image
                src="/images/gamePic.svg"
                alt="Game Image"
                fill
                className="object-contain rounded-xl"
              />
            </div>
            <button className="bg-[#242F5C] drop-shadow-xl text-[#E0E0FF] font-extrabold md:py-2 md:px-4 lg:py-3 lg:px-5 py-2 px-4 text-sm rounded-3xl absolute md:bottom-[7%] lg:bottom-[5%] bottom-2 lg:right-[4%] right-[8%] transition-transform duration-300 ease-in-out transform hover:scale-110">
              PLAY NOW
            </button>
          </div>
    )
}

export default PlayNow;