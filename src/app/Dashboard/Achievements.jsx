import Image from "next/image";
import { DashContext } from "./Dashcontext";
import { useContext } from "react";

function Achievements() {
    const DashData = useContext(DashContext);
    return (
        <div
            className={`${
              !DashData.isMobile
                ? "shadow-md shadow-[#BCBCC9] rounded-3xl border-[#BCBCC9] bg-[#F4F4FF] md:w-[70%] md:h-[48%] lg:w-[800px] lg:h-[500px] w-[90%] h-[48%] ml-[5%] mt-[50px] mr-[5%]"
                : "shadow-md shadow-[#BCBCC9] border-[#BCBCC9]/25 border-solid bg-[#F4F4FF]/75 rounded-3xl border-[#BCBCC9] bg-[#F4F4FF]md:w-[70%] md:h-[48%] lg:w-[800px] lg:h-[500px] w-[90%] h-[48%] ml-[5%] mt-[50px] mr-[5%]"
            }`}
          >
            <h1 className="text-[#444E74] h-[18%] font-black text-center pt-5 tracking-wider lg:text-4xl md:text-3xl text-lg md:text-xl lg:text-2xl">
              ACHIEVEMENTS
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-4 justify-items-center  max-h-[80%] overflow-y-auto overflow-hidden custom-scrollbar">
              <div className="w-full aspect-square flex items-center overflow-y-auto overflow-hidden justify-center">
                <Image
                  src="/images/achvRockie.svg"
                  alt="achvRockie"
                  width={100}
                  height={100}
                  className="w-[70%] max-w-[80px] md:max-w-[90px] lg:max-w-[100px] object-contain"
                />
              </div>
              <div className="w-full aspect-square flex items-center justify-center">
                <Image
                  src="/images/achvRockie.svg"
                  alt="achvRockie"
                  width={100}
                  height={100}
                  className="w-[70%] max-w-[80px] md:max-w-[90px] lg:max-w-[100px] object-contain"
                />
              </div>
              <div className="w-full aspect-square flex items-center justify-center">
                <Image
                  src="/images/achvRockie.svg"
                  alt="achvRockie"
                  width={100}
                  height={100}
                  className="w-[70%] max-w-[80px] md:max-w-[90px] lg:max-w-[100px] object-contain"
                />
              </div>
              <div className="w-full aspect-square flex items-center justify-center">
                <Image
                  src="/images/achvRockie.svg"
                  alt="achvRockie"
                  width={100}
                  height={100}
                  className="w-[70%] blur-md max-w-[80px] md:max-w-[90px] lg:max-w-[100px] object-contain"
                />
              </div>
              <div className="w-full aspect-square flex items-center justify-center">
                <Image
                  src="/images/achvRockie.svg"
                  alt="achvRockie"
                  width={100}
                  height={100}
                  className="w-[70%] blur-md max-w-[80px] md:max-w-[90px] lg:max-w-[100px] object-contain"
                />
              </div>
              <div className="w-full aspect-square flex items-center justify-center">
                <Image
                  src="/images/achvRockie.svg"
                  alt="achvRockie"
                  width={100}
                  height={100}
                  className="w-[70%] blur-md max-w-[80px] md:max-w-[90px] lg:max-w-[100px] object-contain"
                />
              </div>
              <div className="w-full aspect-square flex items-center justify-center">
                <Image
                  src="/images/achvRockie.svg"
                  alt="achvRockie"
                  width={100}
                  height={100}
                  className="w-[70%] blur-md max-w-[80px] md:max-w-[90px] lg:max-w-[100px] object-contain"
                />
              </div>
              <div className="w-full aspect-square flex items-center justify-center">
                <Image
                  src="/images/achvRockie.svg"
                  alt="achvRockie"
                  width={100}
                  height={100}
                  className="w-[70%] blur-md max-w-[80px] md:max-w-[90px] lg:max-w-[100px] object-contain"
                />
              </div>
              <div className="w-full aspect-square flex items-center justify-center">
                <Image
                  src="/images/achvRockie.svg"
                  alt="achvRockie"
                  width={100}
                  height={100}
                  className="w-[70%] blur-md max-w-[80px] md:max-w-[90px] lg:max-w-[100px] object-contain"
                />
              </div>
              <div className="w-full aspect-square flex items-center justify-center">
                <Image
                  src="/images/achvRockie.svg"
                  alt="achvRockie"
                  width={100}
                  height={100}
                  className="w-[70%] blur-md max-w-[80px] md:max-w-[90px] lg:max-w-[100px] object-contain"
                />
              </div>
            </div>
          </div>
    )
}

export default Achievements;