'use client';
import axios from 'axios';
// import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

async function handleVerification(code, router)  {
    

    // console.log("code : ", code);

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


export default handleVerification