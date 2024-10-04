import Image from "next/image";


 function BoardTemplate ({ user}) {
  return (
    <div className="flex items-center bg-[#E1E0F2] m-3 py-1 pl-3 rounded-full relative text-[#242F5C] lg:text-xl">
    <h2 className="font-bold ml-1 ">01</h2>
    <Image
      src={user.avatar}
      alt="avatarprofile"
      width={20}
      height={20}
      className="absolute w-20 h-20 transform -translate-x-[-18px] translate-y-[-50%] top-[50%] overflow-hidden"
    />
    <h2 className="ml-20 left-60 font-bold">{user.name}</h2>
  </div>
  );
}

export default function LeaderBoard({ first, second, third }) {
  return (
    <div className=" flex flex-col shadow-md shadow-[#BCBCC9] border border-[#BCBCC9] rounded-2xl bg-[#F4F4FF] h-auto w-[80%] mt-6">
      <h1 className="text-[#444E74]  h-[18%] font-black text-center pt-4 mb-5 tracking-wider text-md md:text-lg lg:text-2xl ">
        LEADER BOARD
      </h1>
      <BoardTemplate user={first}/>
      <BoardTemplate user={second}/>
      <BoardTemplate user={third}/>
    </div>
  );
}
