"use client";
import { Inter, Montserrat } from "next/font/google";
import { useState, useEffect } from "react";
import Navbar from "./../../Navbar";
import Sidebar from "./../../Sidebar";
import Image from "next/image";

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

  const handleFileUpload = (e) => {
    // Add your file upload logic here
    console.log(e.target.files[0]);
  };

  return (
    <div className={`flex flex-col h-screen ${montserrat.className}`}>
      <Navbar />
      <div className="flex flex-1 overflow-y-auto flex-wrap">
        <Sidebar />
        <div className={`flex-1 overflow-y-auto flex flex-wrap items-center justify-center relative h-full ${isMobile ? '' : 'p-4'}`}>
          <div
            className={` ${isMobile ? 'w-full mt-4' : 'rounded-3xl border-solid border-[#BCBCC9] bg-[#F4F4FF] rounded-3xl border-[#BCBCC9] bg-[#F4F4FF]'} flex flex-col min-w-[500px] min-h-[600px] relative shadow-lg shadow-[#BCBCC9] items-center 
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
              <div onClick={() => { setIsProfile(!isProfile)}} className="w-full max-w-md rounded-xl flex items-center justify-center bg-[#D7D7EA] shadow-md shadow-[#BCBCC9] p-4 cursor-pointer hover:bg-[#E1E1EF] transition-colors duration-300 transition-transform duration-300 transform hover:scale-105 ease-in-out">
                <Image src="/images/profile.svg" alt="Profile" width={64} height={64} className="w-12 h-12 sm:w-16 sm:h-16" />
                {!isIcon && (
                  <h1 className="ml-4 text-xl sm:text-2xl md:text-3xl font-bold tracking-wide text-[#242F5C]">Profile</h1>
                )}
              </div>
              <div onClick={() => { setIs2FA(!is2FA)}} className="w-full max-w-md rounded-xl flex items-center justify-center bg-[#D7D7EA] shadow-md shadow-[#BCBCC9] p-4 cursor-pointer hover:bg-[#E1E1EF] transition-colors duration-300 transition-transform duration-300transform hover:scale-105 ease-in-out">
                <Image src="/images/auth.svg" alt="Profile" width={64} height={64} className="w-12 h-12 sm:w-16 sm:h-16" />
                {!isIcon && (
                  <h1  className="ml-4 text-xl sm:text-xl md:text-2xl font-bold tracking-wide text-[#242F5C]">2FA Authentication</h1>
                )}
              </div>
            </div>
          </div>
          {isProfile && (
              <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center absolute top-0 left-0 w-full h-full animate-fadeIn">
                <div className="bg-[#F4F4FF] flex flex-col items-center shadow-lg rounded-xl w-full  h-full border-solid border-[#BCBCC9] border-2 max-w-[800px] mt-[160px] max-h-[900px] min-h-[800px] min-hrounded-xl pt-8 animate-scaleIn">
                <div className="relative flex flex-col items-center w-full h-full">
                    <Image
                      src="/images/close.svg"
                      alt="Close"
                      width={32}
                      height={32}
                      className="absolute top[15px] right-11 cursor-pointer"
                      onClick={() => setIsProfile(false)}
                    />
                  <div className="flex flex-col items-center relative">
                    
                      <Image
                        src="/images/DefaultAvatar.svg"
                        alt="Profile"
                        width={100}
                        height={100}
                        className="w-[150px] h-[150px] cursor-pointer rounded-full object-cover"
                        
                        />
                        <div className="absolute bottom-[-5px] right-6">
                          <Image
                            src="/images/upload.svg"
                            alt="Camera"
                            width={32}
                            height={32}
                        className="w-8 h-8 cursor-pointer"
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
                  <h1 className="text-2xl font-bold tracking-wide text-[#242F5C] pt-8">Update Profile</h1>
                  <form className="w-full h-full flex flex-col items-center justify-center">

                  <div className='max-w-[350px] w-full mt-4 '>
                    <label for="username" className="block mb-2 text-lg font-bold text-gray-900 text-[#242F5C]">Username</label>
                    <input type="email" id="email" className="bg-[#F8FBFF] border  text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Username" required />
                    <label for="Current Password" className="block mb-2 mt-5 text-lg font-bold text-gray-900 text-[#242F5C]">Current Password *</label>
                    <input type="Current Password" id="Current Password" className="bg-[#F8FBFF] border  text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 mb-5 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Current Password" required />
                    <label for="New Password" className="block mb-2 mt-5 text-lg font-bold text-gray-900 text-[#242F5C]">New Password</label>
                    <input type="New Password" id="New Password" className="bg-[#F8FBFF] border  text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 mb-5 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your password" required />
                    <label for="Confim Password" className="block mb-2 mt-5 text-lg font-bold text-gray-900 text-[#242F5C]">Confim Password</label>
                    <input type="Confim Password" id="Confim Password" className="bg-[#F8FBFF] border  text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 mb-5 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Confirm your password" required />
                    <button type="submit" className="text-white bg-[#111B47] focus:ring-4 focus:outline-none font-semibold rounded-[10px] text-lg w-full px-20 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800 mb-5 transition-transform duration-300 ease-in-out transform hover:scale-105">Update</button>
                </div>
                  </form>
                  </div>
                </div>
              </div>
          )}
          {is2FA && (
              <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center animate-fadeIn  absolute top-0 left-0">
              <div className="bg-[#F4F4FF] flex flex-col items-center shadow-lg rounded-xl w-[95%] h-[80%] sm:h-[90%] border-solid border-[#BCBCC9] border-2 max-w-[900px] max-h-[900px] min-h-[580px] rounded-xl pt-8 animate-scaleIn">
               <div className="relative flex flex-col items-center w-full h-full">
                 <h1 className="text-2xl sm:text-3xl font-bold tracking-wide text-[#242F5C] pt-4 sm:pt-8 text-center">Two Factor Authenticator</h1>
                 <hr className="w-[70%] h-[3px] bg-[#CDCDE5] border-none rounded-full mt-4 sm:mt-8" />
                 <h1 className="text-lg sm:text-xl font-bold tracking-wide text-[#242F5C] pt-4 sm:pt-8 text-center pt-20 pb-8">Please check your E-mail for the security code.</h1>
                 <h1 className="text-lg sm:text-xl font-bold tracking-wide text-[#242F5C] pt-4 sm:pt-8 text-right absolute top-[38%] sm:top-[25%] left-[6%] sm:left-[17%]">2FA Security code</h1>
                 <div className="flex flex-col items-center bg-[#DAE4FF] w-[90%] sm:w-[70%] h-[10%] rounded-xl my-28 sm:my-28 relative">
                   <button type="submit" className="text-white bg-[#111B47] focus:ring-4 focus:outline-none absolute top-[23%] left-[80%] font-semibold rounded-full text-sm sm:text-lg w-[18%] h-[50%] text-center dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition-transform duration-300 ease-in-out transform hover:scale-105">Send</button>
                 </div>
                 <button type="submit" className="text-white bg-[#111B47] focus:ring-4 focus:outline-none font-semibold rounded-full text-lg w-[60%] sm:w-[20%] py-3 sm:h-[6%] text-center dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition-transform duration-300 ease-in-out transform hover:scale-105 mt-4 sm:mt-0">Verify</button>
                 <Image
                   src="/images/close.svg"
                   alt="Close"
                   width={32}
                   height={32}
                   className="absolute top-[-4px] sm:top-2 right-2 sm:top-[15px] sm:right-11 cursor-pointer w-[20px] h-[20px] sm:w-10 sm:h-10"
                   onClick={() => setIs2FA(false)}
                 />
               </div>
              </div>
             </div>
             
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;