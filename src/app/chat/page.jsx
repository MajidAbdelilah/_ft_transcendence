

// // import Image from 'next/image';
// // import Link from 'next/link';
import Sidebar from "../Dashboard/sidebar";
import Navbar from "./components/navbar";
import './style.css';
// import { Sidebar } from '../Dashboard/sidebar';

// import { Inter, Montserrat } from 'next/font/google'
// const montserrat = Montserrat({
//     subsets: ['latin'],
//     variable: '--font-montserrat',
//   })

function chat_page() {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="w-full h-full  flex gap-4">
                <Sidebar className="bg-[#F4F4FF]"/>
                <div>
                    dfghdg
                    <h1>Chat Pdfdfgdfhdfgdfage</h1>
                </div>
            </div>
        </div>
    )
}


export default chat_page