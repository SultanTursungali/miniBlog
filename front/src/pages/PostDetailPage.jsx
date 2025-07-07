import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import React from "react";

export default function PostDetailPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [post, setPost] = useState(null);
  const [users, setUsers] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postRes, usersRes] = await Promise.all([
          axios.get(`http://localhost:3001/posts/${postId}`),
          axios.get("http://localhost:3001/users"),
        ]);
        setPost(postRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
    fetchData();
  }, [postId]);

  const getAuthorName = (authorId) => {
    const author = users.find((user) => user.id == authorId);
    return author ? `${author.firstName} ${author.lastName}` : "Unknown";
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newComment = {
      id: Date.now(),
      authorId: "currentUserId",
      content: comment,
      createdAt: new Date().toISOString(),
      rating: Number(rating),
    };

    const updatedPost = {
      ...post,
      comments: [...(post.comments || []), newComment],
    };

    try {
      await axios.put(`http://localhost:3001/posts/${postId}`, updatedPost);
      setPost(updatedPost);
      setComment("");
      setRating(5);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!post)
    return <div className={`p-4 ${theme.textPrimary}`}>Loading...</div>;

  return (
    <div className={`p-6 rounded-lg ${theme.bgTertiary}`}>
      <button
        onClick={() => navigate(-1)}
        className={`mb-4 ${theme.buttonPrimary} text-white py-2 px-4 rounded`}
      >
        ← Back
      </button>

      <div className={`mb-8 p-6 rounded-lg ${theme.bgSecondary}`}>
        {post.avatar && (
          <img
            src={post.avatar}
            alt="Post Avatar"
            style={{ width: 120, height: 120, borderRadius: "50%" }}
          />
        )}
        <h2 className={`text-3xl font-bold mb-4 ${theme.textPrimary}`}>
          {post.title}
        </h2>
        <img
          src={post.image || "https://via.placeholder.com/800x400"}
          alt={post.title}
          className="w-full h-96 object-cover rounded mb-4"
        />
        <p className={`whitespace-pre-line mb-6 ${theme.textPrimary}`}>
          {post.content}
        </p>
        <div className="flex justify-between items-center">
          <p className={`${theme.textAccent}`}>
            Author: {getAuthorName(post.authorId)}
          </p>
          <p className={`text-sm ${theme.textSecondary}`}>
            {new Date(post.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className={`p-6 rounded-lg ${theme.bgSecondary}`}>
        <h2 className={`text-2xl font-bold mb-4 ${theme.textPrimary}`}>
          Comments ({post.comments?.length || 0})
        </h2>

        <form onSubmit={handleAddComment} className="mb-6">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
            className={`w-full p-3 rounded mb-3 ${theme.inputBg} ${theme.textPrimary}`}
            rows="3"
          />
          <div className="mb-3 flex items-center">
            <label className={`${theme.textPrimary} mr-2`}>Your Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className="p-1 rounded border"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n} ★
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className={`${theme.buttonSecondary} text-white py-2 px-4 rounded`}
          >
            Post Comment
          </button>
        </form>

        <div className="space-y-4">
          {post.comments?.length ? (
            post.comments.map((comment) => (
              <div
                key={comment.id}
                className={`border-b ${theme.borderColor} pb-4`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className={`font-bold ${theme.textPrimary}`}>
                    {getAuthorName(comment.authorId)}
                  </p>
                  <p className={`text-xs ${theme.textSecondary}`}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center mb-1">
                  <span className="text-yellow-500 mr-1">★</span>
                  <span className={`${theme.textSecondary}`}>
                    {comment.rating || "No rating"}
                  </span>
                </div>
                <p className={theme.textPrimary}>{comment.content}</p>
              </div>
            ))
          ) : (
            <p className={`text-center ${theme.textSecondary}`}>
              No comments yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
