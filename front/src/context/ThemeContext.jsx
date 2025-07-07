import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("themePreference");
    return savedTheme ? JSON.parse(savedTheme) : true;
  });

  useEffect(() => {
    localStorage.setItem("themePreference", JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const theme = isDarkMode
    ? {
        bgPrimary: "bg-gray-900",
        bgSecondary: "bg-teal-800",
        bgTertiary: "bg-blue-900",
        textPrimary: "text-white",
        textSecondary: "text-gray-300",
        textAccent: "text-teal-400",
        borderColor: "border-gray-700",
        buttonPrimary: "bg-teal-600 hover:bg-teal-700",
        buttonSecondary: "bg-blue-600 hover:bg-blue-700",
        buttonTertiary: "bg-indigo-600 hover:bg-indigo-700",
        inputBg: "bg-gray-800",
        checkboxColor: "text-teal-500",
        isDarkMode: true,
      }
    : {
        bgPrimary: "bg-white",
        bgSecondary: "bg-teal-100",
        bgTertiary: "bg-sky-100",
        textPrimary: "text-gray-900",
        textSecondary: "text-gray-600",
        textAccent: "text-teal-600",
        borderColor: "border-gray-300",
        buttonPrimary: "bg-teal-500 hover:bg-teal-600",
        buttonSecondary: "bg-sky-500 hover:bg-sky-600",
        buttonTertiary: "bg-indigo-400 hover:bg-indigo-500",
        inputBg: "bg-white",
        checkboxColor: "text-teal-500",
        isDarkMode: false,
      };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
