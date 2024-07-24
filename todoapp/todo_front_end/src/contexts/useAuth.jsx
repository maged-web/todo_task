import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('authToken');
    return token ? true : false;
  });

  const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuth(true);
  };
  const signup = (token) => {
    localStorage.setItem('authToken', token);
    setAuth(true);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setAuth(false);
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout,signup }}>
      {children}
    </AuthContext.Provider>
  );
};
