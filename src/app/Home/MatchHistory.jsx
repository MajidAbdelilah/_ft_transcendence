import Image from "next/image";
import { DashContext } from "./Dashcontext";
import { useContext } from "react";

function MatchHistory() {
  const DashData = useContext(DashContext);
  return (
    <div
      className={`${
        !DashData.isMobile
          ? "shadow-md shadow-[#BCBCC9] rounded-3xl border-[#BCBCC9] bg-[#F4F4FF] w-[90%] md:w-[70%] h-[48%] md:h-[400px] lg:w-full lg:h-[500px] ml-[5%] mt-[50px] mr-[5%]"
          : "shadow-md shadow-[#BCBCC9] rounded-3xl bg-[#F4F4FF]/75 border-[#BCBCC9]/25 bg-[#F4F4FF] w-[90%] h-[48%] ml-[5%] mt-[50px] mr-[5%]"
      }`}
    >
      <h1 className="text-[#444E74] h-[18%] font-black text-center pt-5 tracking-wider lg:text-4xl md:text-3xl text-lg md:text-xl lg:text-2xl">
        MATCH HISTORY
      </h1>
      <div className="flex flex-col justify-content overflow-auto overflow-y-scroll custom-scrollbar h-[95%]">
        <div className="flex flex-col aspect-square overflow-y-auto gap-2 overflow-hidden">
          <div
            className={`flex flex-col w-full px-2 py-1 overflow-y-auto overflow-hidden custom-scrollbar pr-[5%] h-[80%] transition-all duration-300 ${
              DashData.isScrolled
                ? "bg-white/30 backdrop-blur-lg backdrop-filter"
                : "bg-transparent"
            }`}
          >
            <table className="w-full">
              <thead>
                {!DashData.isMobile ? (
                  <tr className="text-center font-semibold text-xs sm:text-sm md:text-base lg:text-lg text-[#4E5981]">
                    <th className="font-extrabold py-2 sm:py-3 md:py-4">
                      Avatar
                    </th>
                    <th className="font-extrabold py-2 sm:py-3 md:py-4">
                      Name
                    </th>
                    <th className="font-extrabold py-2 sm:py-3 md:py-4">
                      Score
                    </th>
                    <th className="font-extrabold py-2 sm:py-3 md:py-4">
                      Win/Loss
                    </th>
                    <th className="font-extrabold py-2 sm:py-3 md:py-4">Map</th>
                  </tr>
                ) : (
                  <tr className="text-center font-semibold text-xs sm:text-sm md:text-base lg:text-lg text-[#4E5981]">
                    <th className="font-extrabold py-2 sm:py-3 md:py-4">A</th>
                    <th className="font-extrabold py-2 sm:py-3 md:py-4">N</th>
                    <th className="font-extrabold py-2 sm:py-3 md:py-4">S</th>
                    <th className="font-extrabold py-2 sm:py-3 md:py-4">W/L</th>
                    <th className="font-extrabold py-2 sm:py-3 md:py-4">Map</th>
                  </tr>
                )}
              </thead>
              <tbody className="py-4 sm:py-6 md:py-8">
                {DashData.matchHistory.map((match, index) => (
                  <tr
                    key={index}
                    className="text-center font-semibold text-xs sm:text-sm md:text-base lg:text-lg text-[#4E5981]"
                  >
                    <td className="flex items-center justify-center py-2 sm:py-3 md:py-4">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-[70px] lg:h-[70px] overflow-hidden rounded-full">
                        <Image
                          src="/images/avatar1.svg"
                          alt="avatar"
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="font-normal py-2 sm:py-3 md:py-4">Ali</td>
                    <td className="font-normal py-2 sm:py-3 md:py-4">5-4</td>
                    <td className="font-normal py-2 sm:py-3 md:py-4">Win</td>
                    <td className="font-normal py-2 sm:py-3 md:py-4">Blue</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchHistory;
