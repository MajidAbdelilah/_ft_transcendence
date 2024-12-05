// import { div } from "framer-motion/client";
// import { DashContext } from "../../Dashboard/Dashcontext";
// import { useContext } from "react";
"use client";
import { BsChatLeftText } from "react-icons/bs";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { LuUserX } from "react-icons/lu";
import axios from "axios";
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
// import { DashContext } from "../../Dashboard/Dashcontext";
// import { useContext } from "react";
// -- colors -----------------------------------------------------co
//  #F4F4FF   #242F5C   #8988DE   #BCBCC9   #F4F4FF   #EAEAFF   #C0C7E0



// loggedInUser --------------------------
// {
//   "userName": "UserId1",
//   "userId": 1,
//   "name": "UserId1",
//   "avatar": "/images/avatarprofile.svg",
//   "status": "Online",
//   "level": 0,
//   "score": "",
//   "result": "",
//   "map": ""
// }
// user --------------------------
// {
//   "id": 1,
//   "password": "pbkdf2_sha256$600000$WPB5zIWRwuWqBhBgaiHPOk$m1chTvfAFUhSED42D333HWsE61ONKArensEWqUIATD4=",
//   "username": "UserId1",
//   "fullname": "",
//   "email": "user1user1@gmail.com",
//   "image_name": "profilepng.png",
//   "image_field": "",
//   "is_2fa": false,
//   "_2fa_code": "",
//   "state": "no state assigned",
//   "is_on": 0
// }





const handleTextUser = (router) => {
  
  router.push(`/Chatt`);
}


const handleAddFriend = async (loggedInUser, user) => {
  try {
    // const respond = await axios.post("http://127.0.0.1:8000/friend/friends-add", 
    // {friendUsername: user.userName},
    // { withCredentials: true, headers: {} }
    // );
    // if(respond.data.status === "ok")
    // {
    //   toast.success('friend request sent successfully');
     
    // }
    // else
    // {
    //   toast.error('friend request failed');
    // }



  } catch (error) {
    console.error(error);
  }



}


const handleBlockUser = async (loggedInUser, user) => {
  try {
    // const respond = await axios.post("http://127.0.0.1:8000/friend/friends-remove",
    // {toBlock: user.userName},
    // { withCredentials: true, headers: {} }
    // );

    // if(respond.data.status === "ok")
    // {
    //   toast.success('user blocked successfully');
    // }
    // else
    // {
    //   toast.error('blocking user failed');
    // }
    toast.success('user blocked successfully');


  } catch (error) {
    console.error(error);
  }



  // const response = await axios.post('https://jsonplaceholder.typicode.com/posts', 
  //   {blockerId: loggedInUser.userId, blockedId: user.userId}//depends on the the info back end needs ...
  // );

  // console.log("response.data : ", response.data);
}





function Part1({loggedInUser, user, isSelf}) {
  const router = useRouter();
  return (
    <div className="part1 relative w-1/3 p-2 rounded-l-2xl bg-[#F4F4FF] border-[#BCBCC9] border-r-2 min-w-32 ">


    <div className="flex flex-col items-center">
        <img
        src={user.image_feild === undefined || user.image_feiled === null || user.image_feiled === "" 
          ? "/images/avatarprofile.svg"
          : user.image_feild}

        
        alt="Profile"
        className="absolute w-20 h-20 rounded-full border-2 border-[#BCBCC9] -top-10  shadow-md shadow-[#BCBCC9]"
        />
      <div className="mt-12 text-sm md:text-md lg:text-lg xl:text-xl font-bold text-[#242F5C]">
        {user.username}
      </div>
      <span className="text-xs   mt-1 text-[#8988DE]">{user.state}</span>
      <div className={`flex flex-row mt-2 text-[#242F5C] ${isSelf === true ? "invisible" : "visible"}`}>
        <BsChatLeftText className="textUser mr-1 text-lg lg:text-xl cursor-pointer" onClick={() => handleTextUser(router)}/>
        <MdOutlinePersonAddAlt className="addFriend ml-1 text-xl lg:text-2xl cursor-pointer" onClick={() => handleAddFriend(loggedInUser, user)}/>
      </div>
    </div>
  </div>
  );
}

function Part2({loggedInUser, user, isSelf}) {
  
  return (
      <div className="part2 w-2/3 p-4 flex flex-col items-end ml-auto   ">

      <LuUserX  
      onClick={() => handleBlockUser(loggedInUser, user)}
      className={`blockUser text-[#242F5C] text-3xl ${isSelf === true ? "invisible" : "visible"} cursor-pointer`} />

      <div className="level flex flex-col items-start w-full mb-4">
        <span className=" text-[#242F5C] font-semibold text-xs ">Level {user.level}</span>

        
        <div className="relative w-full h-3 bg-gray-300 rounded-full mt-1 ">
          
          <div
            className="absolute top-0 left-0 h-3 bg-[#8988DE] rounded-full "
            style={{ width: `${user.level * 20}%` }} 
          ></div>
        </div>

        
        <div className="flex justify-between w-full mt-1 text-[#242F5C] text-xs ">
          <span >Next level</span>
          <span >Level {user.level + 1}</span>
        </div>


      </div>
      <button className="gameStats bg-[#242F5C] p-1  px-2 text-[#F4F4FF] text-xs rounded-full font-semibold">
          Level  {user.level}
      </button>
    </div>
  )
}


export default function UserProfile({loggedInUser, user, isSelf}) {
      // console.log("LoggedInUser: -------------", loggedInUser);
      // console.log("User: -------------", user);
      // console.log("IsSelf: -------------", isSelf);



    if(!user || !loggedInUser)
      return  null;
    return (
    <div className="flex shadow-md shadow-[#BCBCC9] border border-[#BCBCC9] rounded-2xl bg-[#F4F4FF] h-40 w-[80%] mt-10">
      <Toaster /> 
      <Part1 loggedInUser={loggedInUser} user={user} isSelf={isSelf}/>
      <Part2  loggedInUser={loggedInUser} user={user} isSelf={isSelf}/>

    </div>
  );
}
