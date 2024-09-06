



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


                <div className="flex-1 p-10 ]">{/* for the padding to make chlids far from the bar and the sidebar */}

                    <div className="Boxes flex h-full w-full border-2 border-[#C6C6E1] bg-[#F4F4FF] rounded-xl flex-row-revers">

                        
                        {/* <div className="Boxe1 h-full rounded-tl-xl rounded-bl-xl p-10 flex-1 bg-[#555555] ">
                            <h2>hellow world</h2>
                        </div> 

                        <div className="Boxe2 h-full rounded-tr-xl rounded-br-xl flex-2 p-10 bg-[#f4ffff]">
                            <h2>hellow world</h2>
                        </div>  */}
                    </div>


                    
                </div>









            </div>
        </div>
    );
}



