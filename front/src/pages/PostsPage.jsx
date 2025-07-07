import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import React from "react";

export default function PostsPage() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:3001/posts"),
          axios.get("http://localhost:3001/users"),
        ]);
        setPosts(postsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
    fetchData();
  }, []);

  const getAuthorName = (authorId) => {
    const author = users.find((user) => user.id == authorId);
    return author ? `${author.firstName} ${author.lastName}` : "Unknown";
  };

  const getAverageRating = (comments) => {
    if (!comments || !comments.length) return null;
    const ratings = comments
      .map((c) => c.rating)
      .filter((r) => typeof r === "number");
    if (!ratings.length) return null;
    const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
    return avg.toFixed(1);
  };

  return (
    <div className={`p-6 rounded-lg ${theme.bgTertiary}`}>
      <h1 className={`text-2xl font-bold mb-6 ${theme.textPrimary}`}>Posts</h1>
      {currentUser && (
        <div className="mb-4">
          <Link
            to="/posts/new"
            className={`px-6 py-2 rounded ${theme.buttonPrimary} text-white font-medium`}
          >
            Create New Post
          </Link>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className={`relative border rounded-lg overflow-hidden ${theme.borderColor} ${theme.bgSecondary}`}
            style={{ minHeight: 320 }}
          >
            <Link to={`/posts/${post.id}`}>
              {post.avatar && (
                <img
                  src={post.avatar || "https://via.placeholder.com/300x200"}
                  alt={post.title}
                  className="w-full h-50 object-cover"
                />
              )}
              <div className="p-4">
                <h3 className={`text-xl font-bold mb-2 ${theme.textPrimary}`}>
                  {post.title}
                </h3>
                <p className={`${theme.textSecondary} line-clamp-3`}>
                  {post.content}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className={`text-sm ${theme.textAccent}`}>
                    {getAuthorName(post.authorId)}
                  </span>
                  <span className={`text-xs ${theme.textSecondary}`}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-yellow-500">★</span>
                  <span className={`${theme.textSecondary} ml-1`}>
                    {getAverageRating(post.comments) || "No ratings"}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
