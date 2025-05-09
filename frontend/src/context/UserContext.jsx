import React, { createContext, useEffect, useState } from "react";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPath";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const updateUser = (userData) => setUser(userData);
  const clearUser = () => setUser(null);

  // ✅ Fetch user if token exists (on reload)
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (token && !user) {
        try {
          const res = await axios.get(API_PATHS.AUTH.GET_USER_INFO);
          setUser(res.data);
        } catch (err) {
          console.error("Auto-fetch user failed:", err);
          clearUser();
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
