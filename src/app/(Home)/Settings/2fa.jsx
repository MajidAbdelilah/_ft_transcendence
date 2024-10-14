'use client'; 
import Image from "next/image";
import { useState } from "react";



function TwoFA({setIs2FA}) {
  const [code, setCode] = useState("");
  const [error, setError] = useState('');


  // const sendCode = () => {

  // };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter the security code.');
    }
    else if (code.length < 4) {
      setError('Please enter a valid security code.');
    } 
    else {
      // Perform verification logic here
      console.log('Verifying code:', code);
      // Clear error if verification is successful
      setError('');
    }
  };
  
  const handleChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,4}$/.test(value)) {
      setCode(value);
    }
  };
    return (
      <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center animate-fadeIn  absolute top-0 left-0">
            <div className="bg-[#F4F4FF] flex flex-col items-center shadow-lg rounded-xl w-[95%] h-[80%] sm:h-[90%] border-solid border-[#BCBCC9] border-2 max-w-[900px] max-h-[900px] min-h-[580px] rounded-xl pt-8 animate-scaleIn">
              <div className="relative flex flex-col items-center w-full h-full">
                <h1 className="text-lg sm:text-3xl font-bold tracking-wide text-[#242F5C] pt-4 sm:pt-8 text-center">Two Factor Authenticator</h1>
                <hr className="w-[70%] h-[3px] bg-[#CDCDE5] border-none rounded-full mt-4 sm:mt-8" />
                <h1 className="text-md sm:text-xl font-bold tracking-wide text-[#242F5C] pt-4 sm:pt-8 text-center pt-20 pb-8">Please check your E-mail for the security code.</h1>
                <h1 className="text-lg sm:text-xl font-bold tracking-wide text-[#242F5C] pt-4 sm:pt-8 text-right absolute top-[38%] sm:top-[25%] left-[6%] sm:left-[17%]">2FA Security code</h1>
                <div className="flex flex-col items-center bg-[#DAE4FF] w-[90%] sm:w-[70%] h-[10%] rounded-xl my-28 sm:my-28 relative">
                  <input 
                    type="text"  
                    value={code} 
                    max="9999"
                    id="code"
                    onChange={handleChange} 
                    onKeyDown={(e) => {
                      if (e.key === 'e' || e.key === '+' || e.key === '-' || e.key === '.') {
                        e.preventDefault();
                      }
                    }}
                    className="w-[90%] sm:w-[90%] h-[90%] text-[#242F5C] text-lg sm:text-xl font-semibold bg-[#DAE4FF] focus:outline-none dark:bg-[#242F5C] dark:text-white"
                    placeholder="Enter your code."/>
                    <button type="submit"  className="text-white bg-[#111B47] focus:ring-4 focus:outline-none absolute top-[23%] left-[80%] font-semibold rounded-full text-sm sm:text-lg w-[18%] h-[50%] text-center dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition-transform duration-300 ease-in-out transform hover:scale-105">Send
                  </button>
                </div>
                  {error && <p className="text-red-500 text-sm font-semibold">{error}</p>}
                <button onClick={handleVerify} type="submit" className="text-white bg-[#111B47] focus:ring-4 focus:outline-none font-semibold rounded-full text-lg w-[60%] sm:w-[20%] py-3 sm:h-[6%] text-center dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800 transition-transform duration-300 ease-in-out transform hover:scale-105 mt-4 sm:mt-4">Verify</button>
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
    );
  }
export default TwoFA;
