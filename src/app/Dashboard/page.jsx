"use client";
import { Inter, Montserrat } from "next/font/google";
import Dashboard from "./Dashboard";
import DashProvider from "./Dashcontext";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";


const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

function AppDashboard() {
  return (
    <DashProvider>
      <Dashboard />
    </DashProvider>
  );
}

export default AppDashboard;
