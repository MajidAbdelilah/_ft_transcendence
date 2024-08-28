import { Inter, Montserrat } from 'next/font/google'
import Image from 'next/image';
import Link from 'next/link';

const montserrat = Montserrat({
    subsets: ['latin'],
    variable: '--font-montserrat',
  })


function signup_page() {
  return (
    <div className={`h-[100vh] flex justify-center items-center ${montserrat.className}`}>
        <form class="max-w-[700px] w-[90%] bg-[rgba(66,74,120,0.05)] bg-blend-hard-light shadow-[inset_0px_0px_4.6px_#A8B4FF] p-8 rounded-xl h-[800px] w-[600px] flex flex-col items-center">
        <div className="w-full flex justify-center">
            <Image src="images/logo.svg" alt="Logo" width="100" height="100"/>    
        </div>
        <h1 class="sm:text-4xl text-xl text-center text-[#111B47] font-bold">Create your account</h1>
            <div class="mb-5 mt-8 max-w-[350px] w-full flex flex-col justify-center items-center">
                <div className='max-w-[350px] w-full'>
                    <label for="username" class="block mb-2 text-lg font-bold text-gray-900 text-[#111B47]">Username</label>
                    <input type="email" id="email" class="bg-[#F8FBFF] border  text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 mb-5 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Username" required />
                    <label for="email" class="block mb-2 text-lg font-bold text-gray-900 text-[#111B47]">Email</label>
                    <input type="email" id="email" class="bg-[#F8FBFF] border  text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@gmail.com" required />
                    <label for="password" class="block mb-2 mt-5 text-lg font-bold text-gray-900 text-[#111B47]">Password</label>
                    <input type="password" id="password" class="bg-[#F8FBFF] border  text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 mb-5 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter your password" required />
                    <label for="Confim Password" class="block mb-2 mt-5 text-lg font-bold text-gray-900 text-[#111B47]">Confim Password</label>
                    <input type="Confim Password" id="Confim Password" class="bg-[#F8FBFF] border  text-gray-900 text-sm rounded-[10px] focus:ring-blue-500 mb-5 focus:border-blue-500 block w-full p-3.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Confirm your password" required />
                    <button type="submit" class="text-white bg-[#111B47] focus:ring-4 focus:outline-none font-semibold rounded-[10px] text-lg w-full px-20 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-600 dark:focus:ring-blue-800 mb-5 transition-transform duration-300 ease-in-out transform hover:scale-105">Login</button>
                </div>
            <p className="font-medium text-[#111B47] pb-2  flex justify-center">Already have an account? <span className="font-semibold transition-transform duration-300 ease-in-out transform hover:scale-110">&nbsp; <Link href="/login">Login</Link></span></p>
        </div>
        </form>
    </div>
)
}

export default signup_page