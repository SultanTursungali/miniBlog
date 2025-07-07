import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import React from "react";

export default function NotFoundPage() {
  const { theme } = useTheme();

  return (
    <div className={`text-center py-20 ${theme.bgTertiary} rounded-lg`}>
      <h1 className={`text-6xl font-bold mb-4 ${theme.textPrimary}`}>404</h1>
      <p className={`text-xl mb-8 ${theme.textSecondary}`}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className={`px-6 py-3 rounded-lg ${theme.buttonPrimary} text-white font-medium`}
      >
        Go Home
      </Link>
    </div>
  );
}
