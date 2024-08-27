import { Inter, Montserrat } from 'next/font/google'
import Image from "next/image";

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
  })


  function Sidebar() {
    return (
      <div className={`w-64 h-full bg-[#F4F4FF] p-8 flex justify-between flex-col ${montserrat.className}`}>
        <ul className="flex flex-col gap-8">
          <li>
            <a className="flex items-center py-2 px-4 font-semibold rounded transition-transform duration-200 ease-in-out transform hover:scale-110 text-xl text-[#242F5C] cursor-pointer transition-colors">
              <Image src="/images/dashboard.svg" alt="Dashboard" width={30} height={30} className="mr-3" />
              Dashboard
            </a>
          </li>
          <li>
            <a className="flex items-center py-2 px-4 rounded font-semibold transition-transform duration-200 ease-in-out transform hover:scale-110 text-xl text-[#242F5C] cursor-pointer transition-colors">
              <Image src="/images/friends.svg" alt="Friends" width={30} height={30} className="mr-3" />
              Friends
            </a>
          </li>
          <li>
            <a className="flex items-center py-2 px-4 rounded font-semibold transition-transform duration-200 ease-in-out transform hover:scale-110 text-xl text-[#242F5C] cursor-pointer transition-colors">
              <Image src="/images/chat.svg" alt="Chat" width={30} height={30} className="mr-3" />
              Chat
            </a>
          </li>
          <li>
            <a className="flex items-center py-2 px-4 rounded font-semibold transition-transform duration-200 ease-in-out transform hover:scale-110 text-xl text-[#242F5C] cursor-pointer transition-colors">
              <Image src="/images/game.svg" alt="Game" width={30} height={30} className="mr-3" />
              Game
            </a>
          </li>
          <li>
            <a className="flex items-center py-2 px-4 rounded font-semibold transition-transform duration-200 ease-in-out transform hover:scale-110 text-xl text-[#242F5C] cursor-pointer transition-colors">
              <Image src="/images/settings.svg" alt="Settings" width={30} height={30} className="mr-3" />
              Settings
            </a>
          </li>
        </ul>
        <div className="w-full pb-40 max-w-[100%] mx-auto relative">
          <hr className="border-[#242F5C] border-t-1" />
          <Image src="/images/avatarprofile.svg" alt="avatarprofile" width={50} height={50} className="mx-auto pt-9 left-5 absolute left-[-7px]" />
          <p className="text-center text-lg font-normal text-[#242F5C] pt-10 absolute left-12 ">John Doe</p>
          <p className="text-center text-[12px] font-light text-[#8988DE] pt-10 absolute left-12 top-6 ">My Account</p>
          <Image src="/images/logout.svg" alt="arrow" width={20} height={20} className="mx-auto pt-10 absolute right-[12px] top-2 cursor-pointer" />
        </div>
      </div>
    );
  }
  
  
  export default Sidebar;