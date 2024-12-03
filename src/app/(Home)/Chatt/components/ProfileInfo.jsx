
import Image from "next/image";


export default function ProfileInfo({ avatar, name, status }) {
  // console.log("name : ", name);
    return (
      <div className="profileInfo  w-full flex items-center overflow-hidden py-2 pl-2 ">
        <Image
          src={avatar}
          alt="avatarprofile"
          width={60}
          height={60}
          className="left-0 top-0 w-[60px] h-[60px] "
        />
        <div className=" ml-4  ">
          <h3 className="text-lg xl:text-xl 2xl:text-3xl top-0 left-0 text-[#242F5C] ">
            {name}
          </h3>
          <p className="text-sm text-[#302FA5] left">{status}</p>
        </div>
      </div>
    );
  }




  