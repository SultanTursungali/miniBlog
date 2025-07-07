import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import React from "react";

export default function ProfilePage() {
  const { userId } = useParams();
  const { theme } = useTheme();
  const { currentUser, updateProfile } = useAuth();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    city: "",
    avatar: null,
    previewAvatar: null,
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = userId
          ? await axios.get(`http://localhost:3001/users/${userId}`)
          : { data: currentUser };

        const postsResponse = await axios.get("http://localhost:3001/posts");

        setUser(userResponse.data);
        setPosts(
          postsResponse.data.filter(
            (post) => post.authorId === (userId || currentUser?.id)
          )
        );

        if (!userId && currentUser) {
          setEditData({
            firstName: currentUser.firstName,
            lastName: currentUser.lastName,
            email: currentUser.email,
            city: currentUser.city,
            previewAvatar: currentUser.avatar,
          });
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    }
    fetchData();
  }, [userId, currentUser]);

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    if (name === "avatar" && files && files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData((prev) => ({ ...prev, previewAvatar: e.target.result }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSave = async () => {
    const updatedData = {
      firstName: editData.firstName,
      lastName: editData.lastName,
      email: editData.email,
      city: editData.city,
      avatar: editData.previewAvatar || "https://via.placeholder.com/150",
    };

    const result = await updateProfile(updatedData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    )
      return;
    try {
      await axios.delete(`http://localhost:3001/users/${currentUser.id}`);
      localStorage.removeItem("user");
      window.location.href = "/auth";
    } catch {
      alert("Failed to delete account.");
    }
  };

  if (!user)
    return <div className={`p-4 ${theme.textPrimary}`}>Loading...</div>;

  return (
    <div className={`p-6 rounded-lg ${theme.bgTertiary}`}>
      {!userId && (
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => navigate("/posts/new")}
            className={`${theme.buttonPrimary} text-white py-2 px-4 rounded`}
          >
            Create Post
          </button>
          <button
            onClick={handleDeleteAccount}
            className={`${theme.buttonSecondary} text-white py-2 px-4 rounded`}
          >
            Delete Account
          </button>
        </div>
      )}
      <div className={`mb-8 p-6 rounded-lg ${theme.bgSecondary}`}>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <img
              src={user.avatar || "https://via.placeholder.com/150"}
              alt={`${user.firstName} ${user.lastName}`}
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
            />
            {!userId && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`absolute bottom-0 right-0 ${theme.buttonPrimary} text-white py-1 px-3 rounded-full text-sm`}
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            )}
          </div>

          {isEditing ? (
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-1 ${theme.textPrimary}`}>
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={editData.firstName}
                    onChange={handleEditChange}
                    className={`w-full p-2 rounded ${theme.inputBg} ${theme.textPrimary}`}
                  />
                </div>
                <div>
                  <label className={`block mb-1 ${theme.textPrimary}`}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={editData.lastName}
                    onChange={handleEditChange}
                    className={`w-full p-2 rounded ${theme.inputBg} ${theme.textPrimary}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block mb-1 ${theme.textPrimary}`}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  className={`w-full p-2 rounded ${theme.inputBg} ${theme.textPrimary}`}
                />
              </div>

              <div>
                <label className={`block mb-1 ${theme.textPrimary}`}>
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={editData.city}
                  onChange={handleEditChange}
                  className={`w-full p-2 rounded ${theme.inputBg} ${theme.textPrimary}`}
                />
              </div>

              <div>
                <label className={`block mb-1 ${theme.textPrimary}`}>
                  Profile Picture
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                    {editData.previewAvatar ? (
                      <img
                        src={editData.previewAvatar}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">No image</span>
                    )}
                  </div>
                  <label
                    className={`cursor-pointer ${theme.buttonSecondary} text-white py-2 px-4 rounded`}
                  >
                    Change
                    <input
                      type="file"
                      name="avatar"
                      onChange={handleEditChange}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>

              <button
                onClick={handleSave}
                className={`${theme.buttonPrimary} text-white py-2 px-4 rounded`}
              >
                Save Changes
              </button>
            </div>
          ) : (
            <div className="flex-1">
              <h1 className={`text-3xl font-bold mb-2 ${theme.textPrimary}`}>
                {user.firstName} {user.lastName}
              </h1>
              <p className={`text-lg mb-4 ${theme.textSecondary}`}>
                {user.email}
              </p>
              <div className="flex space-x-4">
                <span
                  className={`px-3 py-1 rounded-full ${theme.buttonPrimary} text-white`}
                >
                  {posts.length} Posts
                </span>
                <span
                  className={`px-3 py-1 rounded-full ${theme.buttonSecondary} text-white`}
                >
                  {user.comments?.length || 0} Comments
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <h2 className={`text-2xl font-bold mb-4 ${theme.textPrimary}`}>Posts</h2>
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className={`border rounded-lg p-4 ${theme.borderColor} ${theme.bgSecondary}`}
            >
              <h3 className={`text-xl font-bold mb-2 ${theme.textPrimary}`}>
                {post.title}
              </h3>
              <p className={`${theme.textSecondary} line-clamp-3`}>
                {post.content}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className={`text-center ${theme.textSecondary}`}>No posts yet</p>
      )}
    </div>
  );
}
