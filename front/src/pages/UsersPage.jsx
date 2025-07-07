import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import React from "react";

export default function UsersPage() {
  const { theme } = useTheme();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get("http://localhost:3001/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className={`p-6 rounded-lg ${theme.bgTertiary}`}>
      <h1 className={`text-2xl font-bold mb-6 ${theme.textPrimary}`}>Users</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className={`border rounded-lg p-4 ${theme.borderColor} ${theme.bgSecondary} hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar || "https://via.placeholder.com/80"}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className={`font-bold ${theme.textPrimary}`}>
                  {user.firstName} {user.lastName}
                </h3>
                <p className={`text-sm ${theme.textSecondary}`}>{user.email}</p>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Link
                to={`/profile/${user.id}`}
                className={`flex-1 text-center py-1 px-3 rounded ${theme.buttonPrimary} text-white text-sm`}
              >
                View Profile
              </Link>
              <Link
                to={`/posts?author=${user.id}`}
                className={`flex-1 text-center py-1 px-3 rounded ${theme.buttonSecondary} text-white text-sm`}
              >
                View Posts
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
