import React from 'react';
import Image from 'next/image';
import { RiRobot3Line } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
import { IoGameControllerOutline } from "react-icons/io5";
import { LuUserX } from "react-icons/lu";
import { IoIosChatboxes } from "react-icons/io";
import { FaAngleDown } from "react-icons/fa";



export function HisProfile ({path, name, status}) {
    return (
      <div className="hisProfile w-full flex items-center overflow-hidden ">
        {name === "tournament" ? (
          <RiRobot3Line
            size={75}
            className="bg-[#EAEAFF] rounded-full text-[#242F5C] left-0 top-0 "
          />
        ) : (
          <Image
            src={path}
            alt="avatarprofile"
            width={75}
            height={75}
            className=" rounded-full left-0 top-0 "
          />
        )}

        <div className=" ml-4 hidden lg:block ">
          <h3 className="text-3xl  top-0 left-0 text-[#242F5C] ">{name}</h3>
          <p className="text-sm text-[#302FA5] left ">{status}</p>
        </div>
    </div>
    )
  }

export function PleaseSelectAConversation() {
    return (
        <div className="w-full flex items-center overflow-hidden">
        <p className="text-sm text-[#242F5C] ">
            Please select a conversation
        </p>
        </div>
)
}

export function ProfileOption({onClick}) {
    return (
        <li onClick={onClick} className="cursor-pointer">
        <a className="p-2 text-lg text-[#242F5C] flex items-center border-[#C6C6E1] border-b-2">
        <IoPersonOutline /> <span className="ml-2">Profile</span>
        </a>
        </li>
);
}

export function PlayWithOption ({onClick}) {
    return (
      <li onClick={onClick } className="cursor-pointer">
      <a className="p-2 text-lg text-[#242F5C] flex items-center">
        <IoGameControllerOutline />
        <span className="ml-2">Play with</span>
      </a>
    </li>
    );
  }

 export function BlockOption ({onClick}) {
    return (
      <li onClick={onClick} className="cursor-pointer">
        <a className="p-2 text-lg text-[#242F5C] flex items-center border-[#C6C6E1] border-t-2">
          <LuUserX /> <span className="ml-2">Block</span>
        </a>
      </li>
    );
  }

  export function FriendChatInfo({ friend, ...rest }) {
    return (
      <div className="friendChatInfo p-5 flex items-center border-b-2 mb-4 border-[#9191D6] border-opacity-30 ">
        {/* ChatListIcon  -------------------------------------------------------------- */}

        <IoIosChatboxes
          className="ChatListIcon block lg:hidden text-6xl text-[#242F5C] mr-8 cursor-pointer"
          onClick={rest.switchChatState}
        />

        {/* hisProfile -------------------------------------------------------------- */}
        {rest.selectedFriend !== null ? (
          < HisProfile path={friend.path} name={friend.name} status={friend.status} />

        ) : (
          < PleaseSelectAConversation/>

        )}

        {/* dropDownIcon  -------------------------------------------------------------- */}
        {/*  if the user selected already a friend, and the friend is not the tournament robot , then show the drop down icon */}
        {rest.selectedFriend && friend.name !== "tournament" && (
          <FaAngleDown
            className="dropDownIcon text-4xl ml-auto mr-8  text-[#242F5C] cursor-pointer"
            onClick={rest.switchDropDownState}
          />
        )}

        {rest.iconState.dropDownState && (
          <ul
            ref={rest.dropDownRef}
            className="list absolute right-16 top-20 bg-[#EAEAFF] border-[#C6C6E1] border-2 rounded-xl shadow-lg w-36 "
          >
            <ProfileOption onClick={() => {window.open('https://google.com'); rest.setIconState({dropDownState: false });}}/>
            <PlayWithOption onClick={() => {window.open('https://facebook.com'); rest.setIconState({dropDownState: false });}}/>
            <BlockOption onClick={() => {window.open('https://instagram.com'); rest.setIconState({dropDownState: false });}}/>


          </ul>
        )}
      </div>
    );
  }




