import { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const register = async (userData) => {
    try {
      const checkRes = await fetch(
        `http://localhost:3001/users?email=${encodeURIComponent(
          userData.email
        )}`
      );
      const existing = await checkRes.json();
      if (existing.length > 0) {
        throw new Error("User already exists");
      }
      const response = await fetch("http://localhost:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch(
        `http://localhost:3001/users?email=${encodeURIComponent(
          email
        )}&password=${encodeURIComponent(password)}`
      );
      const users = await response.json();
      if (!users.length) {
        throw new Error("Invalid email or password");
      }
      setUser(users[0]);
      localStorage.setItem("user", JSON.stringify(users[0]));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/auth");
  };

  const value = {
    user,
    currentUser: user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
