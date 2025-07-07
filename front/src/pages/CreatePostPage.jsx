import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AvatarUpload from "../components/AvatarUpload/AvatarUpload";
import axios from "axios";
import React from "react";

export default function CreatePostPage() {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [error, setError] = useState("");

  if (!currentUser) {
    navigate("/auth?mode=login");
    return null;
  }

  const handleAvatarUploaded = (avatarPath) => {
    setAvatar(avatarPath);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }
    try {
      await axios.post("http://localhost:3001/posts", {
        title,
        content,
        authorId: currentUser.id,
        avatar,
        createdAt: new Date().toISOString(),
        comments: [],
      });
      navigate("/posts");
    } catch {
      setError("Failed to create post.");
    }
  };

  return (
    <div
      className={`max-w-xl mx-auto mt-10 p-6 rounded-lg shadow ${theme.bgSecondary}`}
    >
      <h2 className={`text-2xl font-bold mb-6 ${theme.textPrimary}`}>
        Create New Post
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          className="w-full p-2 rounded border"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Content"
          className="w-full p-2 rounded border min-h-[120px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <AvatarUpload onUpload={handleAvatarUploaded} />
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className={`w-full py-2 rounded ${theme.buttonPrimary} text-white font-bold`}
        >
          Publish
        </button>
      </form>
    </div>
  );
}
