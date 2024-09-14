import Sidebar_test from "./components/sidebar"; // import the real one as a componant later
import Navbar_test from "./components/navbar"; // import the real one as a componant later
import Image from "next/image";
import { FaAngleDown } from "react-icons/fa";


import "./style.css";
import { Inter, Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});



export default function ChatPage() {
  
  function ProfileInfo () {
    return (
      <div className="profileInfo w-full flex items-center overflow-hidden">
        <Image
          src="/images/avatarprofile.svg"
          alt="avatarprofile"
          width={75}
          height={75}
          className="left-0 top-0 "
        />
        <div className=" ml-4  ">
            <h3 className="text-3xl  top-0 left-0 text-[#242F5C] ">John Doe</h3>
            <p className="text-sm text-[#302FA5] left">Online</p>
        </div>
      </div>
    );

  }
  function FriendInfo() {
    return (
      <div className="friendInfo my-3 w-full flex flex-row items-center overflow-hidden">
        <Image
          src="/images/avatarprofile.svg"
          alt="avatarprofile"
          width={50}
          height={50}
          className="left-0 top-0 "
        />
        <div className=" ml-2 ">
          <h3 className="text-2xl top-0 left-0 text-[#242F5C]">John Wick</h3>
          <p className="text-xs text-[#302FA5] overflow-hidden ">Graet Game! Rematch tomorrow?</p>
        </div>
        <span className="text-xs text-[#242F5C] ml-auto">2:15 AM</span>
     </div>
    );
  }

  function FriendChatInfo() {
    return (
      <div className="friendChatInfo p-5 flex items-center" >

        <div className="hisProfile w-full flex items-center overflow-hidden">
          <Image
            src="/images/avatarprofile.svg"
            alt="avatarprofile"
            width="75"
            height="75"
            className="left-0 top-0 "
            />
            <div className=" ml-4  ">
              <h3 className="text-3xl  top-0 left-0 text-[#242F5C] ">John Wick</h3>
              <p className="text-sm text-[#302FA5] left">Online</p>
          </div>

        </div>
        {/* edit later----------------- */}
        <div className="dropDownIcon" >
          <FaAngleDown className="bottomIcon text-3xl ml-auto mr-8" />
        </div>
      </div>
    )
  }

  function FriendMsgBox () {
    return (
      <div className="friendMsgBox ml-8 my-1">
        <span className="msgTime text-sm pl-5 text-[#3D3D3D] block">02:22 PM</span>
        <p className="msgConetnt text-xl py-3 px-6 inline-block text-[#FFFFFF] bg-[#2C3E86] bg-opacity-80 rounded-3xl ">Hi john, up for a ping pong match this evening?</p>
      </div>  
    );
  }
  return (




  
    <div className={`flex flex-col h-screen ${montserrat.className}`}>
      <Navbar_test />
      <div className="parent flex flex-1 whitespace-nowrap ">
        <div className="sidebar hidden md:block">
        <Sidebar_test className="hidden md:block"/>
        </div>
        
        <div className="chattSection flex-1 p-10">
          <div className="boxes flex h-full w-full border-2 border-[#C6C6E1] bg-[#F4F4FF] rounded-xl flex-row-revers">
            {/* friendsBox ------------------------------------------------------- */}
            <div className="friendsBox h-full w-1/4 rounded-tl-xl rounded-bl-xl flex-1 p-4 border-r-2 border-[#C6C6E1] bg-[#9191D6] bg-opacity-10 ">

              <div className="menuList p-5 hidden md:block">


              <ProfileInfo />

                <h2 className="text-center text-2xl my-8 py-2 rounded-full bg-[#9191D6] bg-opacity-20 text-[#242F5C] overflow-hidden">Conversations</h2>

                <div className="MessagesList w-full flex flex-col items-center overflow-hidden">

                  <FriendInfo />
                  <FriendInfo />
                  <FriendInfo />
                  <FriendInfo />
                  <FriendInfo />
                  <FriendInfo />
                  <FriendInfo />
                  <FriendInfo />
                  <FriendInfo />




 
                  </div>
              
              
              
              
              
              
              
              
              </div>
            </div>
            {/* messagesBox ------------------------------------------ */}
            
            
            
            <div className="messagesBox h-full w-3/4 rounded-tr-xl rounded-br-xl flex-2 p-4 bg-[#F4F4FF ]">
              
              <FriendChatInfo />


              {/* emplimenting peerToPeer */}
              <div className="peerToPeer">
                <FriendMsgBox />
                <FriendMsgBox />
                <FriendMsgBox />
                <FriendMsgBox />
                <FriendMsgBox />
                <FriendMsgBox />
                <FriendMsgBox />







              </div>
              {/* emplimenting SendMsg */}
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
