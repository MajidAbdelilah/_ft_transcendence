import Image from "next/image";
import { TbTournament } from "react-icons/tb";
// import { useState } from "react";
// const [selectedFriend, setSelectedFriend] = useState(null);

export default function FriendInfo({ friend, onClick }) {
  let len = friend.conversation.length;
  return (
    <div
      className="friendInfo my-3 w-full flex flex-row items-center overflow-hidden "
      onClick={onClick}
    >
      {friend.name === "tournament" ? (
        <TbTournament
          size={45}
          className="bg-[#EAEAFF] rounded-full text-[#242F5C] left-0 top-0 "
        />
      ) : (
        <Image
          src={friend.path}
          alt="avatarprofile"
          width={45}
          height={45}
          className="rounded-full left-0 top-0 "
        />
      )}

      <div className=" ml-2 ">
        <h3 className="text-2xl top-0 left-0 text-[#242F5C]">{friend.name}</h3>

        <p className="text-xs text-[#302FA5] overflow-hidden whitespace-nowrap text-ellipsis max-w-[15ch]">
          {len > 0 ? friend.conversation[len - 1].msg : "No messages yet"}
        </p>
      </div>
      <span className="text-xs text-[#242F5C] ml-auto hidden xl:block">
        {len > 0 ? friend.conversation[len - 1].time : ""}
      </span>
    </div>
  );
}
