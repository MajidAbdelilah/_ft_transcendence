import { Inter, Montserrat } from 'next/font/google'
import Image from "next/image";

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
  })


  function Sidebar() {
    return (
      <div className={`w-64 h-[100vh] bg-[#F4F4FF] p-8 flex flex-col ${montserrat.className}`}>
        <ul className="flex flex-col space-y-8">
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
          {/* Add more links with icons as needed */}
        </ul>
      </div>
    );
  }
  
  
  export default Sidebar;