// src/hooks/useAuth.js
import { useEffect, useState } from "react";
import axios from "axios";

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (token && userId) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setAuthenticated(true);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setAuthenticated(false);
    }

    setChecked(true);
  }, []);

  return { authenticated, checked };
};
