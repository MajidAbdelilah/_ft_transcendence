



import Sidebar_test from "./components/sidebar";// import the real one as a componant later
import Navbar_test from "./components/navbar";// import the real one as a componant later





import './style.css';

// // import Image from 'next/image';
// // import Link from 'next/link';

// import { Sidebar } from '../Dashboard/sidebar';

// import { Inter, Montserrat } from 'next/font/google'
// const montserrat = Montserrat({
//     subsets: ['latin'],
//     variable: '--font-montserrat',
//   })






// // or w-full h-full  flex gap-4 


// h-full
// h-screen: 100% of the viewport height.
// h-1/2: 50% of the parent height.
// h-auto: Height adjusts based on content.
// h-[size]: Custom height (e.g., h-64 for 16rem).



export default function ChatPage() {
    return (
        <div className="flex flex-col h-screen">
            <Navbar_test />
            <div className="flex flex-1">
                <Sidebar_test />  


                <div className="flex-1 p-10 bg-[#dcf80f]">{/* efewg */}
                    <div className="boxes bg-[#0ffc66]">

                        <h2>hellow world</h2>
                        <div className="h-full  bg-[#F4F4FF] border border-[#C6C6E1] rounded-md">
                            <h2>hellow world</h2>
                        </div> 
                    </div>
                </div>









            </div>
        </div>
    );
}



