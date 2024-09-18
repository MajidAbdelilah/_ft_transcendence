"use client";
import { Inter, Montserrat } from "next/font/google";
import Dashboard from "./Dshboard";
import DashProvider from "./Dashcontext";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

function Home() {
  return (
    <DashProvider>
      <Dashboard />
    </DashProvider>
  );
}

export default Home;
