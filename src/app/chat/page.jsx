import Sidebar_test from "./components/sidebar"; // import the real one as a componant later
import Navbar_test from "./components/navbar"; // import the real one as a componant later
import Image from "next/image";


import "./style.css";
import { Inter, Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});



{/* <div className="profil-infos">
  <div className="image">
    <img src="/images/avatarprofile.svg" />
  </div>
  <div className="infos">
    <h3>Knetero Jack</h3>
    <span className="status">Online</span>
  </div>
</div> */}




export default function ChatPage() {
  return (
    <div className={`flex flex-col h-screen ${montserrat.className}`}>
      <Navbar_test />
      <div className="parent flex flex-1">
        <div className="sidebar hidden md:block">
        <Sidebar_test />
        </div>
        
        <div className="chattSection flex-1 p-10">
          {/* for the padding to make chlids far from the bar and the sidebar */}
          <div className="boxes flex h-full w-full border-2 border-[#C6C6E1] bg-[#F4F4FF] rounded-xl flex-row-revers">
            {/* friendsBox ------------------------------------------------------- */}
            <div className="friendsBox h-full w-1/3 rounded-tl-xl rounded-bl-xl flex-1 p-4 border-r-2 border-[#C6C6E1] bg-[#F4F4FF] ">
            



              <div className="menuList">
                <div className="profileInfo w-full flex  items-center overflow-hidden">
                  <Image
                    src="/images/avatarprofile.svg"
                    alt="avatarprofile"
                    width={70}
                    height={70}
                    className="left-0 top-0 "
                  />
                  <div className=" ml-4 flex-col flex-grow">
                      <p className="text-xl top-0 right-0 text-[#242F5C] left">John Doe</p>
                      <p className="text-sm text-[#302FA5] left">Online</p>
                  </div>
                </div>
                <h2>Messages List</h2>
                {/* div_message_list */}
              
              
              
              
              
              
              
              
              
              
              </div>



              
              
              
            </div>
            {/* messagesBox ------------------------------------------ */}
            <div className="messagesBox h-full w-2/3 rounded-tr-xl rounded-br-xl flex-2 p-4 bg-[#F4F4FF ]">
              <h2>hellow world</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
