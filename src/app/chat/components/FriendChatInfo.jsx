import React from 'react';
import Image from 'next/image';
import { RiRobot3Line } from "react-icons/ri";
import { IoPersonOutline } from "react-icons/io5";
import { IoGameControllerOutline } from "react-icons/io5";
import { LuUserX } from "react-icons/lu";

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
        <li onClick={onClick}>
        <a className="p-2 text-lg text-[#242F5C] flex items-center border-[#C6C6E1] border-b-2">
        <IoPersonOutline /> <span className="ml-2">Profile</span>
        </a>
        </li>
);
}

export function PlayWithOption ({onClick}) {
    return (
      <li onClick={onClick} >
      <a className="p-2 text-lg text-[#242F5C] flex items-center">
        <IoGameControllerOutline />
        <span className="ml-2">Play with</span>
      </a>
    </li>
    );
  }

 export function BlockOption ({onClick}) {
    return (
      <li onClick={onClick} >
        <a className="p-2 text-lg text-[#242F5C] flex items-center border-[#C6C6E1] border-t-2">
          <LuUserX /> <span className="ml-2">Block</span>
        </a>
      </li>
    );
  }