

    // # endpoints:
    // # update profile : localhost:8000/api/update_user/{ username , current_password, new_password } post 

    // # if he he clickes on send - back end send a code to his emal , 
    // # enable 2fa : localhost:8000/api/sendcode/ 

    // # the suer should enter the code to verify his email and he shoul  click on virify
    // # 2fa code vefirication : localhost:8000/api/CodeVerification/ {code } post 

    // # logout : localhost:8000/api/logout post 
//-------------------------------------------
'use client'; 
import axios from 'axios';


const getToken = () => {
   
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    } else {

      return null;
    }
  };

  



const Services = {
    

    updateProfileService: async (data) => {
        console.log('=== send ; ', data.username, ' ', data.current_password, ' ', data.new_password);// remove later
        console.log('=== token : ', token);// remove later
        return axios.post('http://localhost:8000/api/update_user/', 
        {
            username: data.username, 
            current_password: data.current_password, 
            new_password: data.new_password
        },
        { headers: {'Authorization': `Bearer ${token}`} });
        
    },

    sendCodeService: async () => {
        // console.log("=== sendCodeService function has been caled ");// remove later
        // http://localhost:8000/api/
        
        const token = getToken();
        // console.log('=== token : ', token);// remove later
        return axios.post('http://localhost:8000/api/sendcode/',
        // { withCredentials: true },
        { headers: {'Authorization' : `Bearer ${token}`}}
      );
      

        
    },
    handleVerifyService: async (code) => {
        // console.log('=== Verifying code :', code);

        // return axios.post('http://localhost:8000/api/CodeVerification/', 
        //     {code : code},
        //     { headers: {'Authorization': `Bearer ${token}`} });
        
        
    }
};

export default Services;
