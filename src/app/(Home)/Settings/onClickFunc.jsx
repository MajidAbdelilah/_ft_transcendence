
import Services from './services';
import toast from 'react-hot-toast';
// import Services from './services';

export const sendCode = async() => 
    {
  
      try {
        
        const result = await Services.sendCodeService();
        console.log("--- sendCode has been called : ", result);


          if(result.statusText === 'OK') {
            const successMsg = 'Email sent successfully!';
            console.log(successMsg);
            toast.success(successMsg);//
            return;
          }
          else {
            throw new Error (result);
          }
          

  
      }
  
      catch (error) {
        console.log("sendCode http request failed; ", error);
      }
      setError('');
      // console.log("sending email is commented ....");
    }

export    const handleVerify = async(code, setError) => {
        
        if (!code.trim()) {
          setError('Please enter the security code.');
          return;
        }
        if (code.length < 6) {
          setError('Please enter a valid security code.');
          return;
        } 



        try {
            const result = await Services.handleVerifyService(code);
            // console.log("--- handleVerify has been called : ", result);

            
                // console.log('-----------------------------------------------');
                const successMsg = result.data.message;
                if(successMsg === '2fa is done') {

                  toast.success('Operation done successfuly!');
                  window.location.reload();
                }

                else {

                  toast.error('Invalide Code !');
                    throw new Error (result)
                  

                }


                
            
        }
        catch (error) {
          console.log("handleVerify http request failed; ", error);
        }

          
          setError('');
        
      };




    