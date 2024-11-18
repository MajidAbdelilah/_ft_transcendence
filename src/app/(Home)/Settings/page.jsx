"use client";
import { Inter, Montserrat } from "next/font/google";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion"
import TwoFA from "./2fa";
<<<<<<< HEAD


=======
import withAuth from "../../HOC.tsx";
import UpdateProfile from "./UpdateProfile"
import toast, { Toaster } from 'react-hot-toast';
>>>>>>> origin/frontend-hed-dyb

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});





function Settings() {

  const [isMobile, setIsMobile] = useState(false);
  const [isIcon, setIsIcon] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [is2FA, setIs2FA] = useState(false);








  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsIcon(window.innerWidth <= 1317);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);



  return (

    <div className={`flex-1 overflow-y-auto flex flex-wrap items-center justify-center relative h-full ${isMobile ? '' : 'p-4'}`}>
      <Toaster /> 
      <motion.div
        className={` ${isMobile ? 'w-full mt-4' : 'motion-preset-expand rounded-3xl border-solid border-[#BCBCC9] bg-[#F4F4FF] rounded-3xl border-[#BCBCC9] bg-[#F4F4FF]'} flex flex-col min-w-[500px] min-h-[600px] relative shadow-lg shadow-[#BCBCC9] items-center 
            md:w-[45%] h-full sm:h-[80%] md:h-[72%] bg-[#F4F4FF] justify-center p-4`}

      >
        <div className="w-[70%] xl:w-[70%] lg:w-[70%]  md:w-[70%] h-full mt-2 md:mt-2 lg:mt-5 flex flex-col items-center space-y-16 relative">
          <div className="flex flex-row items-center justify-arround space-x-4">
            <Image src="/images/settings.svg" alt="Settings" width={80} height={80} className="w-20 h-20 " />
            {isIcon ? ''
              :
              <h1 className="text-3xl lg:text-3xl xl:text-5xl md:text-3xl  font-extrabold content-center tracking-wide text-[#242F5C]">
                SETTINGS
              </h1>}
          </div>
          <div className="w-full flex justify-center">
            <hr className="w-full h-[3px] bg-[#CDCDE5] border-none rounded-full my-2" />
          </div>




          
          <div onClick={() => { setIsProfile(!isProfile) }} className="w-full max-w-md rounded-xl flex items-center justify-center bg-[#D7D7EA] shadow-md shadow-[#BCBCC9] p-4 cursor-pointer hover:bg-[#E1E1EF] transition-colors duration-300 transition-transform duration-300 transform hover:scale-105 ease-in-out">
            <Image src="/images/profile.svg" alt="Profile" width={64} height={64} className="w-12 h-12 sm:w-16 sm:h-16" />
            {!isIcon && (
              <h1 className="ml-4 text-xl sm:text-2xl md:text-3xl font-bold tracking-wide text-[#242F5C]">Profile</h1>
            )}
          </div>
          <div onClick={() => { setIs2FA(!is2FA) }} className="w-full max-w-md rounded-xl flex items-center justify-center bg-[#D7D7EA] shadow-md shadow-[#BCBCC9] p-4 cursor-pointer hover:bg-[#E1E1EF] transition-colors duration-300 transition-transform duration-300transform hover:scale-105 ease-in-out">
            <Image src="/images/auth.svg" alt="Profile" width={64} height={64} className="w-12 h-12 sm:w-16 sm:h-16" />
            {!isIcon && (
              <h1 className="ml-4 text-xl sm:text-xl md:text-2xl font-bold tracking-wide text-[#242F5C]">2FA Authentication</h1>
            )}
          </div>






        </div>
      </motion.div>
<<<<<<< HEAD
      {isProfile && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-start sm:items-center absolute top-0 left-0 w-full h-full animate-fadeIn p-4">
        <div className=" bg-[#F4F4FF] flex flex-col items-center shadow-lg rounded-xl w-[95%] sm:w-full h-[85vh] sm:h-auto border-solid border-[#BCBCC9] border-2 max-w-[800px] sm:mt-[160px] max-h-[100vh] sm:max-h-[900px] min-h-[500px] sm:min-h-[800px] overflow-y-auto pt-4 sm:pt-8 animate-scaleIn">
          <div className="relative flex flex-col items-center w-full h-full px-3 sm:px-0 motion-preset-expand">
            <Image
              src="/images/close.svg"
              alt="Close"
              width={32}
              height={32}
              className="absolute top-[-8px] sm:top-[15px] right-3 sm:right-11 cursor-pointer w-[22px] h-[22px] sm:w-[32px] sm:h-[32px]"
              onClick={() => setIsProfile(false)}
            />
            
            <div className="flex flex-col items-center relative">
              <Image
                src="/images/DefaultAvatar.svg"
                alt="Profile"
                width={100}
                height={100}
                className="w-[100px] h-[100px] sm:w-[150px] sm:h-[150px] cursor-pointer rounded-full object-cover"
              />
              <div className="absolute bottom-[-5px] right-1 sm:right-6">
                <Image
                  src="/images/upload.svg"
                  alt="Camera"
                  width={32}
                  height={32}
                  className="w-6 h-6 sm:w-8 sm:h-8 cursor-pointer"
                  onClick={() => document.getElementById('fileInput').click()}
                />
              </div>
            </div>
  
            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={(e) => handleFileUpload(e)}
            />
  
            <h1 className="text-lg sm:text-2xl font-bold tracking-wide text-[#242F5C] pt-4 sm:pt-8">Update Profile</h1>
  
            <form className="w-full h-full flex flex-col items-center justify-center">
              <div className='w-[85%] sm:max-w-[350px] mt-2 sm:mt-4'>
                <label htmlFor="username" className="block mb-1 sm:mb-2 text-sm sm:text-lg font-bold text-[#242F5C]">Username</label>
                <input 
                  type="email" 
                  id="email" 
                  className="bg-[#F8FBFF] border text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 sm:p-3.5" 
                  placeholder="Username" 
                  required 
                />
  
                <label htmlFor="Current Password" className="block mb-1 sm:mb-2 mt-3 sm:mt-5 text-sm sm:text-lg font-bold text-[#242F5C]">Current Password *</label>
                <input 
                  type="password" 
                  id="Current Password" 
                  className="bg-[#F8FBFF] border text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 mb-3 sm:mb-5 focus:border-blue-500 block w-full p-2.5 sm:p-3.5" 
                  placeholder="Current Password" 
                  required 
                />
  
                <label htmlFor="New Password" className="block mb-1 sm:mb-2 mt-3 sm:mt-5 text-sm sm:text-lg font-bold text-[#242F5C]">New Password</label>
                <input 
                  type="password" 
                  id="New Password" 
                  className="bg-[#F8FBFF] border text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 mb-3 sm:mb-5 focus:border-blue-500 block w-full p-2.5 sm:p-3.5" 
                  placeholder="Enter your password" 
                  required 
                />
  
                <label htmlFor="Confirm Password" className="block mb-1 sm:mb-2 mt-3 sm:mt-5 text-sm sm:text-lg font-bold text-[#242F5C]">Confirm Password</label>
                <input 
                  type="password" 
                  id="Confirm Password" 
                  className="bg-[#F8FBFF] border text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 mb-3 sm:mb-5 focus:border-blue-500 block w-full p-2.5 sm:p-3.5" 
                  placeholder="Confirm your password" 
                  required 
                />
  
                <button 
                  type="submit" 
                  className="text-white bg-[#111B47] focus:ring-4 focus:outline-none font-semibold rounded-[10px] text-sm sm:text-lg w-full px-4 sm:px-20 py-2.5 sm:py-3 text-center mb-4 sm:mb-5 transition-transform duration-300 ease-in-out transform hover:scale-105"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      )}
      {is2FA && (
        <TwoFA setIs2FA={setIs2FA}/>
      )}
=======
      {/* My chnages --------------------------------------------------------------------------- */}
      {isProfile && (<UpdateProfile setIsProfile={setIsProfile} />)} 
      {is2FA && (    <TwoFA         setIs2FA={setIs2FA}       /> )}
>>>>>>> origin/frontend-hed-dyb
    </div>
  );
}

export default Settings;