import axios from 'axios';

    // # endpoints:
    // # update profile : localhost:8000/api/update_user/{ username , current_password, new_password } post 

    // # if he he clickes on send - back end send a code to his emal , 
    // # enable 2fa : localhost:8000/api/sendcode/ 

    // # the suer should enter the code to verify his email and he shoul  click on virify
    // # 2fa code vefirication : localhost:8000/api/CodeVerification/ {code } post 

    // # logout : localhost:8000/api/logout post 
//-------------------------------------------


const token = localStorage.getItem('token');


const Services = {
    updateProfileService: async (data) => {
        // return axios.post('http://localhost:8000/api/update_user/', 
        // {
        //     username: data.username, 
        //     current_password: data.current_password, 
        //     new_password: data.new_password
        // }, 
        // {
        //     headers: {'Authorization': `Bearer ${token}`,}
        // });
        // console.log(data);
    },

    sendCodeService: async () => {
        // return axios.post('localhost:8000/api/sendcode/',
        // {
        //     headers: {'Authorisation' : `Bearer ${token}`,}
        // }
        // );
        console.log("sendCodeService has been caled ");
    }
};

export default Services;
