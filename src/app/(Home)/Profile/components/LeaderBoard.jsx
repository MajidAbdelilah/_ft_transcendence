import Image from "next/image";

export default function LeaderBoard({ first, second, third }) {
  return (
    <div className=" flex flex-col shadow-md shadow-[#BCBCC9] border border-[#BCBCC9] rounded-2xl bg-[#F4F4FF] h-40 w-[80%]">
      <h1 className="text-[#444E74]  h-[18%] font-black text-center pt-4 mb-5 tracking-wider text-md md:text-lg lg:text-xl ">
        LEADER BOARD
      </h1>
      <div className="flex items-center bg-[#D4D6F6] m-3 py-1 pl-3 rounded-full">
        <h2>01</h2>
        <Image
          src="/images/avatar1.svg"
          alt="avatarprofile"
          width={20}
          height={20}
          className="absolute w-20 h-20 left-35"
        />
        <h2 className="ml-20 left-60">lfhdsß</h2>
      </div>
    </div>
  );
}
