/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../utils/apiRoutes"; // Ensure this import is correct
import { useEffect } from "react";
import { UserData } from "@/utils/types";

//

const useUserData = (
  setUserData: React.Dispatch<React.SetStateAction<UserData>>, // Function to set user data
  setErrors: (errors: any) => void // Function to set errors
) => {
  // const navigate = useNavigate();

  useEffect(() => {
    const autoLogin = async () => {
      try {
        const response = await axios.get(`${auth}/auto-login`, {
          withCredentials: true, // Important to include this
        });

        if (response.status === 200) {
          // Successful auto-login
          // console.log(response.data);
          setUserData(response.data.data); // Assuming this is the user data
        }
      } catch (error: any) {
        // Use any for error to capture all types
        if (error.response) {
          // Handle error response
          setErrors({ general: error.response.data.message });
        } else {
          // Handle network or other error
          setErrors({ general: "An error occurred during auto-login." });
        }
      }
    };

    autoLogin();
  }, [setUserData, setErrors]);
};

export default useUserData;
