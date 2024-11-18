

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



// const axiosInstance = axios.create({
//   baseURL: 'http://127.0.0.1:8000',
//   withCredentials: true,
//   headers: {}
// });

  
//----------------------------

// axios.get('http://127.0.0.1:8000/api/getuserinfo/', {
//     headers: {
//         Authorization: `Bearer ${token}` // Authentication token (if needed)
//     },
//     withCredentials: true // Send cookies if necessary
// })
// .then(response => {
//     console.log(response.data);
// })
// .catch(error => {
//     console.error(error);
// });






const Services = {
    






    updateProfileService: async (data) => {

        return axios.post('http://127.0.0.1:8000/api/update_user/', 
        {
            username: data.username, 
            current_password: data.current_password, 
            new_password: data.new_password
        },
        { headers: {'Authorization': `Bearer ${token}`} });
        
    },

    sendCodeService: async () => {
      return axios.post('http://127.0.0.1:8000/api/sendcode/', 
      {},
      { withCredentials: true, headers: {} });
        // return axiosInstance.post('/api/sendcode/');


    },


    handleVerifyService: async (code) => {
        // console.log('=== Verifying code :', code);

        return axios.post('http://127.0.0.1:8000/api/CodeVerification/', 
            {code : code},
            { withCredentials: true, headers: {} });
        
        
    }
};

export default Services;
