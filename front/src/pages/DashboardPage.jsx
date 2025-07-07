import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import React from "react";

export default function DashboardPage() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className={`p-6 rounded-lg ${theme.bgTertiary}`}>
      <h1 className={`text-2xl font-bold mb-6 ${theme.textPrimary}`}>
        Welcome, {currentUser.firstName}!
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-lg ${theme.bgSecondary}`}>
          <h2 className={`text-xl font-bold mb-4 ${theme.textPrimary}`}>
            Your Stats
          </h2>
          <div className="space-y-4">
            <div className={`p-3 rounded ${theme.bgPrimary}`}>
              <p className={theme.textSecondary}>Posts Created</p>
              <p className={`text-2xl font-bold ${theme.textAccent}`}>
                {currentUser.postsCount || 0}
              </p>
            </div>
            <div className={`p-3 rounded ${theme.bgPrimary}`}>
              <p className={theme.textSecondary}>Comments Made</p>
              <p className={`text-2xl font-bold ${theme.textAccent}`}>
                {currentUser.commentsCount || 0}
              </p>
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-lg ${theme.bgSecondary}`}>
          <h2 className={`text-xl font-bold mb-4 ${theme.textPrimary}`}>
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link
              to="/posts/new"
              className={`block p-3 rounded ${theme.buttonPrimary} text-white text-center`}
            >
              Create New Post
            </Link>
            <Link
              to="/profile"
              className={`block p-3 rounded ${theme.buttonSecondary} text-white text-center`}
            >
              Edit Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
