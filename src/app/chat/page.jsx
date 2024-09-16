import Sidebar_test from "./components/sidebar"; // import the real one as a componant later
import Navbar_test from "./components/navbar"; // import the real one as a componant later
import Image from "next/image";

import { FaAngleDown } from "react-icons/fa";
import { RiSendPlaneLine } from "react-icons/ri";
import { IoIosChatboxes } from "react-icons/io";




import "./style.css";
import { Inter, Montserrat } from "next/font/google";
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});



    // - sm : `min-width: 640px`
    // - md : `min-width: 768px`
    // - lg : `min-width: 1024px`   
    // - xl : `min-width: 1280px`
    // - 2xl : `min-width: 1536px`




export default function ChatPage() {
  
  
  // -- friends -----------------------------------------------------
  function ProfileInfo ({path, name, status}) {
    return (
      <div className="profileInfo pt-5 pl-5 w-full flex items-center overflow-hidden">
        <Image
          src={path}
          alt="avatarprofile"
          width={75}
          height={75}
          className="left-0 top-0 "
        />
        <div className=" ml-4  ">
            <h3 className="text-3xl  top-0 left-0 text-[#242F5C] ">{name}</h3>
            <p className="text-sm text-[#302FA5] left">{status}</p>
        </div>
      </div>
    );

  }
  function FriendInfo({path, name, lastMsg, time}) {
    return (
      <div className="friendInfo my-3 w-full flex flex-row items-center overflow-hidden">
        <Image
          src={path}
          alt="avatarprofile"
          width={50}
          height={50}
          className="left-0 top-0 "
        />
        <div className=" ml-2 ">
          <h3 className="text-2xl top-0 left-0 text-[#242F5C]">{name}</h3>
          <p className="text-xs text-[#302FA5] overflow-hidden whitespace-nowrap text-ellipsis max-w-[15ch]">{lastMsg}</p>
        </div>
        <span className="text-xs text-[#242F5C] ml-auto hidden md:block">{time}</span>
     </div>
    );
  }
  // -- chats -----------------------------------------------------
  function FriendChatInfo({path, name, status}) {
    return (
      <div className="friendChatInfo p-5 flex items-center" >



        <div className="hisProfile w-full flex items-center overflow-hidden">
          <Image
            src={path}
            alt="avatarprofile"
            width="75"
            height="75"
            className="left-0 top-0 "
            />
            <div className=" ml-4 hidden md:block ">
              <h3 className="text-3xl  top-0 left-0 text-[#242F5C] ">{name}</h3>
              <p className="text-sm text-[#302FA5] left ">{status}</p>
          </div>

        </div>
        {/* button - edit later  -------------------------------------------------------------- */}
        
        <div className="ChatListIcon block lg:hidden text-3xl text-[#242F5C]  mr-10" >
          <IoIosChatboxes className="ChatListIcon   " />
        </div>


        <div className="dropDownIcon text-4xl ml-auto mr-8  text-[#242F5C]" >
          <FaAngleDown className="dropDownIcon " />
        </div>
      </div>
    )
  }


  function FriendMsgBox ({time, msg}) {
    return (
      <div className="friendMsgBox ml-8 my-1">
        <span className="msgTime text-sm pl-5 text-[#3D3D3D] block">{time}</span>
        <p className="msgConetnt text-xl py-3 px-6 inline-block text-[#FFFFFF] bg-[#2C3E86] bg-opacity-80 rounded-3xl ">{msg}</p>
      </div>  
    );
  }
  function MyMsgBox ({time, msg}) {
    return (
      <div className="myMsgBox my-1 mr-8 ml-auto flex flex-col">
        <span className="msgTime text-sm pr-5 text-[#3D3D3D] ml-auto">{time}</span>
        <p className="msgConetnt text-xl py-3 px-6 inline-block text-[#000000] bg-[#9191D6] bg-opacity-40 rounded-3xl ">{msg}</p>
      </div>  
    );
  }
  return (




  
    <div className={`flex flex-col h-full  ${montserrat.className}`}>
      <Navbar_test />
      <div className="parent flex flex-1  ">
        
      {/* hidden on smaller screens and only visible on screens 1280px or larger. */}
        <div className="sidebar hidden xl:block">
        <Sidebar_test />
        </div>
        
        <div className="chattSection flex-1 p-5 md:p-10 h-screen w-screen">

          <div className="boxes flex h-full w-full border-2 border-[#C6C6E1] rounded-xl flex-row-revers bg-[#9191D6] bg-opacity-10">
            {/* friendsBox ------------------------------------------------------- */}
            

            <div className="menuList hidden lg:block w-2/5  h-full flex-col">
              <div className="friendsBox p-2 rounded-tl-xl rounded-bl-xl  border-r-2  border-[#C6C6E1] h-full  flex-col flex-grow overflow-y-auto">

                

                  < ProfileInfo path="/images/avatarprofile.svg" name="John Doe" status="Online"/>
                  <h2 className="text-center text-1xl my-8 py-2 rounded-full bg-[#9191D6] bg-opacity-20 text-[#242F5C] overflow-hidden">Conversations</h2>


                  <div className="MessagesList flex flex-col ">

                      <FriendInfo path="/images/avatarprofile.svg" name="John Wick" lastMsg="Graet Game! Rematch tomorrow?" time="2:15 AM"/>
                      <FriendInfo path="/images/avatarprofile.svg" name="lucy smith" lastMsg="hello dear" time="20:15 AM"/>
                      <FriendInfo path="/images/avatarprofile.svg" name="henry civil" lastMsg="hi john how are yaa?" time="20:15 AM"/>
                      <FriendInfo path="/images/avatarprofile.svg" name="henry civil" lastMsg="hi john how are yaa?" time="20:15 AM"/>
                      <FriendInfo path="/images/avatarprofile.svg" name="henry civil" lastMsg="hi john how are yaa?" time="20:15 AM"/>
                      <FriendInfo path="/images/avatarprofile.svg" name="henry civil" lastMsg="hi john how are yaa?" time="20:15 AM"/>
                      <FriendInfo path="/images/avatarprofile.svg" name="henry civil" lastMsg="hi john how are yaa?" time="20:15 AM"/>
                      <FriendInfo path="/images/avatarprofile.svg" name="henry civil" lastMsg="hi john how are yaa?" time="20:15 AM"/>
                      <FriendInfo path="/images/avatarprofile.svg" name="henry civil" lastMsg="hi john how are yaa?" time="20:15 AM"/>
                      <FriendInfo path="/images/avatarprofile.svg" name="henry civil" lastMsg="hi john how are yaa?" time="20:15 AM"/>
                      <FriendInfo path="/images/avatarprofile.svg" name="henry civil" lastMsg="hi john how are yaa?" time="20:15 AM"/>
                      <FriendInfo path="/images/avatarprofile.svg" name="henry civil" lastMsg="hi john how are yaa?" time="20:15 AM"/>
                      <FriendInfo path="/images/avatarprofile.svg" name="henry civil" lastMsg="hi john how are yaa?" time="20:15 AM"/>
                      <FriendInfo path="/images/avatarprofile.svg" name="henry civil" lastMsg="hi john how are yaa?" time="20:15 AM"/>
                      <FriendInfo path="/images/avatarprofile.svg" name="henry civil" lastMsg="hi john how are yaa?" time="20:15 AM"/>
                      <FriendInfo path="/images/avatarprofile.svg" name="henry civil" lastMsg="hi john how are yaa?" time="20:15 AM"/>
                      <FriendInfo path="/images/avatarprofile.svg" name="henry civil" lastMsg="hi john how are yaa?" time="20:15 AM"/>

                  
                </div>
              </div>
            </div>

            {/* messagesBox ------------------------------------------ */}
            
            

            <div className="messagesBox md:w-full lg:w-3/5 p-2 h-full rounded-tr-xl rounded-br-xl   bg-[#F4F4FF ] flex flex-col ">
              
              <FriendChatInfo path="/images/avatarprofile.svg" name="John Wick" status="Online"/>

              {/* emplimenting peerToPeer */}
              <div className="peerToPeer flex flex-col flex-grow overflow-y-auto">


                <FriendMsgBox time="02:22 PM" msg="Hi John, up for a ping pong match this evening? "/>
                <MyMsgBox time="02:23 PM" msg="Sure, I'm in!"/>
                <FriendMsgBox time="02:22 PM" msg="Hi John, up for a ping pong match this evening?"/>
                <MyMsgBox time="02:23 PM" msg="Sure, I'm in!"/>
                <FriendMsgBox time="02:22 PM" msg="Hi John, up for a ping pong match this evening? "/>
                <MyMsgBox time="02:23 PM" msg="Sure, I'm in!"/>
                <FriendMsgBox time="02:22 PM" msg="Hi John, up for a ping pong match this evening?"/>
                <MyMsgBox time="02:23 PM" msg="Sure, I'm in!"/>
                <FriendMsgBox time="02:22 PM" msg="Hi John, up for a ping pong match this evening? "/>
                <MyMsgBox time="02:23 PM" msg="Sure, I'm in!"/>
                <FriendMsgBox time="02:22 PM" msg="Hi John, up for a ping pong match this evening?"/>
                <MyMsgBox time="02:23 PM" msg="Sure, I'm in!"/>
                <FriendMsgBox time="02:22 PM" msg="Hi John, up for a ping pong match this evening? "/>
                <MyMsgBox time="02:23 PM" msg="Sure, I'm in!"/>
                <FriendMsgBox time="02:22 PM" msg="Hi John, up for a ping pong match this evening?"/>
                <MyMsgBox time="02:23 PM" msg="Sure, I'm in!"/>
                <FriendMsgBox time="02:22 PM" msg="Hi John, up for a ping pong match this evening? "/>
                <MyMsgBox time="02:23 PM" msg="Sure, I'm in!"/>
                <FriendMsgBox time="02:22 PM" msg="Hi John, up for a ping pong match this evening?"/>
                <MyMsgBox time="02:23 PM" msg="Sure, I'm in!"/>
                <MyMsgBox time="02:23 PM" msg="Sure, I'm in!"/>
                <MyMsgBox time="02:23 PM" msg="Sure, I'm in!"/>
                <MyMsgBox time="02:23 PM" msg="Sure, I'm in!"/>
                <MyMsgBox time="02:23 PM" msg="Sure, I'm in!"/>
                <MyMsgBox time="02:23 PM" msg="Sure, I'm in!"/>

                
              </div>
              {/* emplimenting SendMsg */}
              <div className="sendMsg mx-8 my-5 relative " >
                <input type="text" placeholder="Message" className="text-xl bg-[#9191D6] bg-opacity-20 py-3 pl-6 pr-16 w-full rounded-full" />
                <RiSendPlaneLine className="text-3xl absolute right-4 top-3  text-[#2C3E86] text-opacity-80 "/>
              </div>
            

            
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
