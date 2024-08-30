import { Inter, Montserrat } from 'next/font/google'
import Image from 'next/image';
import Link from 'next/link';

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
  })
  

function login_page() {
    return (
        <div className={`h-[100vh] flex justify-center items-center ${montserrat.className}`}>
            <form className="max-w-[700px] w-[90%] bg-[rgba(66,74,120,0.05)] bg-blend-hard-light shadow-[inset_0px_0px_4.6px_#A8B4FF] p-8 rounded-xl h-[700px] w-[600px] flex flex-col items-center">
            <div className="w-full flex justify-center">
                <Image src="images/logo.svg" alt="Logo" width="100" height="100"/>    
            </div>
            <h1 class="sm:text-4xl  text-xl text-center text-[#111B47] font-bold">Login to your account</h1>
                <div class="mb-5 mt-8 max-w-[350px] w-full flex flex-col justify-center items-center">
                    <div className='max-w-[350px] w-full'>
                        <label for="email" class="block mb-2 text-lg font-bold text-gray-900 text-[#111B47]">Email</label>
                        <input type="email" id="email" class="bg-[#F8FBFF] border border-gray-300 text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your email" required />
                        <label for="password" class="block mb-2 mt-5 text-lg font-bold text-gray-900 text-[#111B47]">Password</label>
                        <input type="password" id="password" class="bg-[#F8FBFF] border border-gray-300 text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 mb-5 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your password" required />
                        <button type="submit" class="text-white bg-[#111B47] focus:ring-4 focus:outline-none font-semibold rounded-[10px] text-lg w-full px-20 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800 mb-5 transition-transform duration-300 ease-in-out transform hover:scale-105">Login</button>
                    </div>
                <p className="font-medium text-[#111B47] pb-2  flex justify-center">Don&apos;t have an account? <span className="font-semibold transition-transform duration-300 ease-in-out text-sm sm:text-base transform hover:scale-110">&nbsp; <Link href="/signup">Sign up</Link></span></p>
                    <button type="submit" class=" flex itemes-center justify-center gap-4 text-black bg-[#BFD5F6] focus:ring-4 focus:outline-none focus:ring-blue-300 sm:w-[80%] sm:w-[70%] font-semibold rounded-[10px] text-base sm:px-10 sm:py-3 px-5 py-5 text-center dark:bg-blue-600 mt-5 mb-2 transition-transform duration-300 ease-in-out transform hover:scale-105"> <Image src="images/42_Logo 1.svg" alt="Logo" width="40" height="40" /> Login Intra</button>            </div>
            </form>
        </div>
    )
}

export default login_page