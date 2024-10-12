"use client";

import Navbar from "./../Navbar";
import Sidebar from "./../sidebar";
import { Montserrat } from "next/font/google";


const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-montserrat",
  });
  

export default function RootLayout({ children }) {
    return (
        <div className={`flex flex-col h-screen ${montserrat.className}`}>
        <Navbar />
        <div className="flex flex-1 flex-wrap">
          <Sidebar />
          {children}
        </div>
      </div>
    );
}
