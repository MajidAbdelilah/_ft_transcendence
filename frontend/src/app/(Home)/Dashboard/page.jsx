"use client";

import Dashboard from "./Dshboard";





import DashProvider from "./Dashcontext";


function Home() {


  return (
    <DashProvider>
      <Dashboard />

    </DashProvider>
  );
}
export default Home;

