"use client";
import React from "react";
import Image from "next/image";
import { Inter, Montserrat } from 'next/font/google'
import './styles.css';
import { useRouter } from "next/navigation";


const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
})


export default function App() {

  const router = useRouter();
  const handleLogin = () => {
    router.push('/login');
  }
  const handleSignUp = () => {
    router.push('/signup');
  }
  return (
    <body>
      <div className={` h-[100vh]${montserrat.className}`}>
        <nav className="flex justify-between pl-20 pt-18 pr-20 w-full items-center h-[200px] fixed">
          <Image src="images/logo.svg" alt="Logo" width="150" height="150" />
          <div className="flex gap-2 ">
            <button onClick={handleSignUp} type="button" className="text-white bg-[#111B47] hover:bg-[#0e1739] hover:ring-4 focus:ring-[#1d2f7a] font-bold rounded-full text-lg h-[70px] w-[180px] text-center me-2 mb-2 transition duration-300 ease-in-out shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] border-solid border-b-4 border-gray-600">Sign up</button>
            <button onClick={handleLogin} type="button" className="text-white bg-[#111B47] hover:bg-[#0e1739] hover:ring-4 focus:ring-[#1d2f7a] font-bold rounded-full text-lg h-[70px] w-[180px] text-center me-2 mb-2 transition duration-300 ease-in-out shadow-[rgba(50,50,93,0.25)_0px_6px_12px_-2px,_rgba(0,0,0,0.3)_0px_3px_7px_-3px] border-solid border-b-4 border-gray-600">Login</button>
          </div>
        </nav>
        <div className="w-full flex justify-center items-center">
        <div className="flex justify-around w-full items-center max-w-[2000px] h-[100vh]">
          <div className="w-[50%] max-w-[800px]">
            <h1 className={`font-bold xxl:text-[100px] text-[60px] flex flex-col  pb-5 ${montserrat.className}`}>
              <span className="block -mb-[0.4em] font-extrabold text-[#091133]">ONLINE</span>
              <span className="block -mb-[0.4em] font-extrabold text-[#091133]">PING PONG</span>
              <span className="block font-extrabold text-[#091133]">GAME</span>
            </h1>
            <p className={`text-lg  pt-2 text-[#505F98] ${montserrat.className}`}>
              Welcome to Ultimate Pong Arena, where the classic game meets modern competition.
              <br/>
              Dive into fast-paced matches, climb the leaderboards, and join a community of enthusiasts.
              <br/>
              Ready for action? <span className="font-bold">Let the games begin!</span>
            </p>
          </div>
          <div className="w-[50%] max-w-[600px]">
            <Image
              src="images/pong.svg"
              alt="Pong"
              width={600}
              height={400}
              className="pongImg w-full"
            />
          </div>
        </div>
        </div>
      </div>
    </body>
  )
}