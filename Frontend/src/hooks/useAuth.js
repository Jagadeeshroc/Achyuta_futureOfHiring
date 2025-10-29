// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import axios from "axios";

// Make sure this is defined, or import it from a config file
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user"); // Get the user string

    const fetchUser = async (currentUserId, currentToken) => {
      try {
        // Set token for this request
        axios.defaults.headers.common["Authorization"] = `Bearer ${currentToken}`;
        
        // --- THIS API CALL IS NOW CORRECT ---
        // It calls /api/users/YOUR_ACTUAL_ID
        const { data } = await axios.get(`${API_URL}/api/users/${currentUserId}`); 
        
        setUser(data); // <-- Set the full user object
        setAuthenticated(true);
      } catch (error) {
        console.error("Auth error: Invalid token or user", error);
        // If fetch fails, log them out
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setAuthenticated(false);
      } finally {
        setChecked(true);
      }
    };

    if (token && userString) {
      try {
        // --- THIS IS THE FIX ---
        // 1. Parse the JSON string from local storage
        const userObject = JSON.parse(userString);
        
        // 2. Get the actual ID from the object
        const currentUserId = userObject._id || userObject.id; 

        if (!currentUserId) {
          throw new Error("User ID not found in local storage object");
        }
        // --- END OF FIX ---

        // 3. Pass the correct ID to fetchUser
        fetchUser(currentUserId, token);

      } catch (error) {
        // This handles bad JSON or a missing ID
        console.error("Failed to parse user from local storage", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common["Authorization"];
        setUser(null);
        setAuthenticated(false);
        setChecked(true);
      }
    } else {
      // No token, ensure logged out state
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      setAuthenticated(false);
 setChecked(true);
    }
  }, []);

  // Return the user object along with the booleans
  return { authenticated, checked, user };
};