



import Sidebar_test from "./components/sidebar";// import the real one as a componant later
import Navbar_test from "./components/navbar";// import the real one as a componant later
import Image from 'next/image';




import './style.css';


// // import Link from 'next/link';

// import { Sidebar } from '../Dashboard/sidebar';

// import { Inter, Montserrat } from 'next/font/google'
// const montserrat = Montserrat({
//     subsets: ['latin'],
//     variable: '--font-montserrat',
//   })






{/* <div className="w-full pb-40 max-w-[100%] mx-auto relative">
<hr className="border-[#242F5C] border-t-1" />
<Image src="/images/avatarprofile.svg" alt="avatarprofile" width={50} height={50} className="mx-auto pt-9 left-5 absolute left-[-7px]" />

<p className="text-center text-lg font-normal text-[#242F5C] pt-10 absolute left-12 ">John Doe</p>

<p className="text-center text-[12px] font-light text-[#8988DE] pt-10 absolute left-12 top-6 ">My Account</p>
<Image src="/images/logout.svg" alt="arrow" width={20} height={20} className="mx-auto pt-10 absolute right-[12px] top-2 cursor-pointer" />
</div> */}

{/* <div class="absolute left-0 top-0 h-16 w-16 ...">01</div> */}


export default function ChatPage() {
    return (
        <div className="flex flex-col h-screen">
            <Navbar_test />
            <div className="flex flex-1">
                <Sidebar_test />  


                <div className="flex-1 p-10 ]">{/* for the padding to make chlids far from the bar and the sidebar */}

                    <div className="Boxes flex h-full w-full border-2 border-[#C6C6E1] bg-[#F4F4FF] rounded-xl flex-row-revers">

                        
                        <div className="Boxe1 h-full w-1/3 rounded-tl-xl rounded-bl-xl flex-1 p-4 border-r-2 border-[#C6C6E1] bg-[#F4F4FF] ">
                            {/* <div>hfugfrf<div/> */}
                            <Image src="/images/avatarprofile.svg" alt="avatarprofile" width={60} height={60} className="left-0 top-0"/>
                            <p classname="text-">John Doe</p>
                        </div> 




                        <div className="Boxe2 h-full w-2/3 rounded-tr-xl rounded-br-xl flex-2 p-4 bg-[#F4F4FF ]">
                            <h2>hellow world</h2>
                        </div> 
                    </div>


                    
                </div>









            </div>
        </div>
    );
}



