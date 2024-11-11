import axios from 'axios';

// # update profile : http://localhost:8000/api/update_user/{ username , current_password, new_password } post

const token = localStorage.getItem('token');


const Services = {
    updateProfileService: (data) => {
        return axios.post('http://localhost:8000/api/update_user/', 
        {
            username: data.username, 
            current_password: data.current_password, 
            new_password: data.new_password
        }, {
            headers: {'Authorization': `Bearer ${token}`,}
        });
    }
};

export default Services;
