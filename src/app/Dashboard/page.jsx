import { Inter, Montserrat } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

function Dashboard() {
  return (
    <nav className="bg-[#F4F4FF] py-4 h-[90px] flex items-center">
      <div className="container mx-auto flex justify-between">
        <div className="text-blue font-bold text-xl">LOGO</div> 
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="py-2 px-10 rounded-full bg-[#]text-white focus:outline-none focus:ring-2 focus:ring-[#3CDCDE5]"
          />
          <svg
            className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <div className="flex items-center border-2 border-solid border-transparent outline-2 outline-[#505F98] rounded-full">
          <Image
            id="avatarButton"
            type="button"
            data-dropdown-toggle="userDropdown"
            data-dropdown-placement="bottom-start"
            class="w-10 h-10 rounded-full cursor-pointer"
            src="/images/avatar.svg"
            alt="User dropdown"
            width="100"
            height="100"
          />
          <div
            id="userDropdown"
            class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600 "
            
          >
            <div class="px-4 py-3 text-sm text-gray-900 dark:text-white"></div>
            <ul
              class="py-2 text-sm text-gray-700 dark:text-gray-200"
              aria-labelledby="avatarButton"
            >
              <li>
                <a
                  href="#"
                  class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  Settings
                </a>
              </li>
            </ul>
            <div class="py-1">
              <a
                href="#"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Dashboard;
