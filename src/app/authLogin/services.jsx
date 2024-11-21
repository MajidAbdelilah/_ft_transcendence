'use client';
import axios from 'axios';
// import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';


// async function sendAutomaticEmail() {
//     // console.log("sendAutomaticEmail has been called -----");
// }

export async function handleVerification(code, router)  {
    

    // console.log("code : ", code);
    // 1 send code on email  automatically
    // try {
    //     const result = await axios.get('http://127.0.0.1:8000/api/sendcode/',
    //         // {withCredentials: true, headers: {} }
    //     );
    //     if(result.statusText === 'OK') {
    //         const successMsg = 'Email sent successfully!';
    //         console.log(successMsg);
            
    //         return;
    //       }

    // } catch (error){
    //     throw new Error (result);
    // }

    // 2 handel virification 
    try {

        const result = await axios.post('http://127.0.0.1:8000/api/handleVerification',
        {code : code},
        { withCredentials: true, headers: {} });




        if(result.data.message === '2fa is done') // check what the back end send later ...
        {
            toast.success('Verification done successfully!');
            router.push('/Dashboard');
        } else {
            toast.error(result.data.message);
        }

    } catch (error) {
        console.log('Post request failed .......');
        console.log(result);
    }


  }
