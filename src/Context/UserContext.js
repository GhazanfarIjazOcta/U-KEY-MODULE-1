import React, { createContext, useContext, useState, useEffect } from "react";

// Create a Context for the user data
const UserContext = createContext();

// Create a Provider Component to wrap the app and provide user data to all components
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Try to get user data from localStorage (or you can fetch from DB if not found)
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Update the user context whenever the user logs in or changes
  const updateUserData = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("user", JSON.stringify(newUserData));
  };

  return (
    <UserContext.Provider value={{ user, updateUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use user data in any component
export const useUser = () => {
  return useContext(UserContext);
};
