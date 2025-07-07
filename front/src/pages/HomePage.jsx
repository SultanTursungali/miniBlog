import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import React from "react";

export default function HomePage() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  return (
    <div className={`text-center py-12 ${theme.bgTertiary} rounded-lg`}>
      <h1 className={`text-4xl font-bold mb-6 ${theme.textPrimary}`}>
        Welcome to miniBlog
      </h1>
      <div className="flex justify-center space-x-4">
        {currentUser ? (
          <>
            <Link
              to="/posts"
              className={`px-6 py-3 rounded-lg ${theme.buttonPrimary} text-white font-medium`}
            >
              View Posts
            </Link>
            <Link
              to="/profile"
              className={`px-6 py-3 rounded-lg ${theme.buttonSecondary} text-white font-medium`}
            >
              My Profile
            </Link>
          </>
        ) : (
          <>
            <Link
              to="/auth?mode=register"
              className={`px-6 py-3 rounded-lg ${theme.buttonPrimary} text-white font-medium`}
            >
              Register
            </Link>
            <Link
              to="/posts"
              className={`px-6 py-3 rounded-lg ${theme.buttonSecondary} text-white font-medium`}
            >
              Explore Posts
            </Link>
            <Link
              to="/users"
              className={`px-6 py-3 rounded-lg ${theme.buttonTertiary} text-white font-medium`}
            >
              Explore Users
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
