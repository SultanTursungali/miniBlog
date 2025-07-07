import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import React from "react";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { currentUser, logout } = useAuth();

  return (
    <nav className={`${theme.bgSecondary} p-4 shadow-md`}>
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className={`text-xl font-bold ${theme.textPrimary}`}>
          miniBlog
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/posts" className={`${theme.textPrimary} hover:underline`}>
            Posts
          </Link>
          <Link to="/users" className={`${theme.textPrimary} hover:underline`}>
            Users
          </Link>

          {currentUser ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="flex items-center space-x-2">
                <img
                  src={currentUser.avatar || "/default-avatar.png"}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className={`${theme.textPrimary} hover:underline`}>
                  Profile
                </span>
              </Link>
              <button
                onClick={logout}
                className={`${theme.buttonPrimary} text-white py-1 px-3 rounded`}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth?mode=login"
              className={`${theme.textPrimary} hover:underline`}
            >
              Login
            </Link>
          )}

          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full ${theme.buttonPrimary} text-white`}
          >
            {theme.isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
}
