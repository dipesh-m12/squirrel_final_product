// src/hooks/useAutoLogin.ts
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../utils/apiRoutes"; // Ensure this import is correct
import { userToken } from "@/utils";
import { UserData } from "@/utils/types";

interface Errors {
  general?: string;
}

interface AutoLoginResponse {
  data: React.Dispatch<React.SetStateAction<UserData | null>>;
}

const useAutoLogin = (
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>,
  setErrors: React.Dispatch<React.SetStateAction<Errors>>
) => {
  const navigate = useNavigate();

  useEffect(() => {
    const autoLogin = async () => {
      try {
        if (!localStorage.getItem(userToken)) return;
        const response = await axios.get<AutoLoginResponse>(
          `${auth}/auto-login`,
          {
            withCredentials: true, // Important to include this
          }
        );

        if (response.status === 200) {
          // Successful auto-login
          setUserData(response.data.data); // Assuming this is the user data
          navigate("/"); // Redirect to home on successful auto-login
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Handle error response from Axios
          if (error.response) {
            // Error returned from the backend
            setErrors({ general: error.response.data.message });
            console.log(error.response.data.message);
          } else {
            // Handle network or unexpected errors
            setErrors({ general: "An error occurred during auto-login." });
            console.log(error);
            console.log("An error occurred during auto-login.");
          }
        }
      }
    };

    autoLogin();
  }, [navigate, setUserData, setErrors]);
};

export default useAutoLogin;
