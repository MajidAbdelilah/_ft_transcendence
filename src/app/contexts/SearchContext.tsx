import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { showAlert } from '../components/utils'; // adjust the path if necessary

const useSearch = () => {
  const inputRef = useRef(null);
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    const searchTerm = inputRef.current.value;
    console.log("searched tearm : ", searchTerm);
    // if (searchTerm.trim() === "") return;

    // setIsSearching(true);
    // try {
    //   const response = await axios.get(`/users.json`);
    //   const users = response.data;

    //   const userExists = users.some(user => user.username === searchTerm);

    //   if (userExists) {
    //     router.push(`/Profile/${searchTerm}`);
    //   } else {
    //     showAlert("User does not exist");
    //   }
    // } catch (error) {
    //   console.error("Error during search:", error);
    //   showAlert("Error during search");
    // } finally {
    //   setIsSearching(false);
    // }
  };

  return {
    inputRef,
    handleSearch
  };
};

export default useSearch;
