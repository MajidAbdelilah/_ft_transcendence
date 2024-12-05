import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { showAlert } from '../components/utils'; // adjust the path if necessary

const useSearch = () => {
  const inputRef = useRef(null);
  const router = useRouter();
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => 
    {
      const fetchUsers = async () =>
        {
          try 
          {
            const response = await axios.get('http://127.0.0.1:8000/api/users/', {   withCredentials: true, headers: {} });
            
            const usersArray = Object.values(response.data); // Convert object to array
            // console.log('Users array:', usersArray); // Log the array to verify
            setFetchedUsers(usersArray);



          }
          catch (error)
          {
            console.error('Error fetching users:', error);
          }
        }
        fetchUsers();
        
        
    }, []
  )
  const handleSearch = async () => {
    const searchTerm = inputRef.current.value;
    // console.log("searched tearm : -----", searchTerm);



    if( searchTerm === '')
      return;
    else
    {
      const matchingUsers = fetchedUsers.filter((user) =>
      user.username.startsWith(searchTerm));
      setFilteredUsers(matchingUsers);
    }





    // console.log("fetchedUsers : --------------", fetchedUsers);
    // console.log("filteredUsers : --------------", filteredUsers);


  };

  return {
    inputRef,
    handleSearch,
    filteredUsers
  };
};
export default useSearch;
















