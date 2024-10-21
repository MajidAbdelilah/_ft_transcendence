
import Image from "next/image";


export default function ProfileInfo({ avatar, name, status }) {
    return (
      <div className="profileInfo  w-full flex items-center overflow-hidden py-5 pl-5 ">
        <Image
          src={avatar}
          alt="avatarprofile"
          width={75}
          height={75}
          className="left-0 top-0 w-[75px] h-[75px] "
        />
        <div className=" ml-4  ">
          <h3 className="text-3xl  top-0 left-0 text-[#242F5C] ">
            {name}
          </h3>
          <p className="text-sm text-[#302FA5] left">{status}</p>
        </div>
      </div>
    );
  }




  