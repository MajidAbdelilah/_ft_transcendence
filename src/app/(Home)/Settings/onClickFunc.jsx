
import Services from './services';
import toast from 'react-hot-toast';
// import Services from './services';

export const sendCode = async() => 
    {
  
      try {
        
        const result = await Services.sendCodeService();
        // console.log("--- sendCode has been called : ", result.data.data);
        if(!result.data.data) {
          const errorMsg = result.data.message;
          console.log(errorMsg);
          toast.error( errorMsg?errorMsg:'Something Went Wrong!');
          // setError(errorMsg);
        }
        else {
          const successMsg = result.data.message;
          console.log(successMsg);
          toast.success(successMsg);
  
          // console.log(result.data);
        }
  
      }
  
      catch (error) {
        console.log("sendCode http request failed; ", error);
      }
    }

export    const handleVerify = async(code, setError) => {
        
        if (!code.trim()) {
          setError('Please enter the security code.');
          return;
        }
        if (code.length < 4) {
          setError('Please enter a valid security code.');
          return;
        } 



        try {
            const result = await Services.handleVerifyService(code);
            if(!result.data.data) {
                const errorMsg = result.data.message;
                console.log(errorMsg);
                toast.error( errorMsg?errorMsg:'Something Went Wrong!');
                setError(errorMsg);
            }
            else {
                const successMsg = result.data.message;
                console.log(successMsg);
                toast.success(successMsg);
            }
        }
        catch (error) {
          console.log("handleVerify http request failed; ", error);
        }

          
          setError('');
        
      };




    