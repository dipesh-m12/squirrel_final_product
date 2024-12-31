import { userToken } from "@/utils";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// TypeScript types
const useAuth = (redirect: boolean = true): boolean => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false); // specify type as boolean
  const navigate = useNavigate();

  useEffect(() => {
    // Get the token from localStorage
    const token = localStorage.getItem(userToken);

    // Check if the token exists
    if (token) {
      setIsAuthenticated(true);
      // console.log("auth"); // Set to true if token exists
    } else {
      setIsAuthenticated(false); // Set to false if token does not exist
      if (redirect) navigate("/home"); // Redirect if token is not found
    }
  }, [navigate, redirect]); // Add `navigate` and `redirect` as dependencies

  return isAuthenticated;
};

export default useAuth;
