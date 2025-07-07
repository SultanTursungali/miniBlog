import { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import React from "react";

export default function AuthPage() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode");
  const { theme } = useTheme();
  const { currentUser, login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(mode !== "register");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    city: "",
    acceptsTerms: false,
    acceptsNewsletter: false,
    avatar: null,
    previewAvatar: null,
  });

  useEffect(() => {
    setIsLogin(mode !== "register");
  }, [mode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData);
      }
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (ev) => {
        setFormData((prev) => ({
          ...prev,
          avatar: file,
          previewAvatar: ev.target.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  if (currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className={`p-6 rounded-lg max-w-2xl mx-auto ${theme.bgTertiary}`}>
      <h1
        className={`text-2xl font-bold mb-6 text-center ${theme.textPrimary}`}
      >
        {isLogin ? "Login" : "Register"}
      </h1>

      {error && (
        <div className={`mb-4 p-2 rounded ${theme.bgSecondary} text-red-500`}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block mb-1 ${theme.textPrimary}`}>
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full p-2 rounded ${theme.inputBg} ${theme.textPrimary}`}
                  required
                />
              </div>
              <div>
                <label className={`block mb-1 ${theme.textPrimary}`}>
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full p-2 rounded ${theme.inputBg} ${theme.textPrimary}`}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`block mb-1 ${theme.textPrimary}`}>
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full p-2 rounded ${theme.inputBg} ${theme.textPrimary}`}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className={`block mb-1 ${theme.textPrimary}`}>
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full p-2 rounded ${theme.inputBg} ${theme.textPrimary}`}
                  required
                />
              </div>
            </div>

            <div>
              <label className={`block mb-1 ${theme.textPrimary}`}>
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
                  {formData.previewAvatar ? (
                    <img
                      src={formData.previewAvatar}
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
                  Upload
                  <input
                    type="file"
                    name="avatar"
                    onChange={handleChange}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
          </>
        )}

        <div>
          <label className={`block mb-1 ${theme.textPrimary}`}>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full p-2 rounded ${theme.inputBg} ${theme.textPrimary}`}
            required
          />
        </div>

        <div>
          <label className={`block mb-1 ${theme.textPrimary}`}>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full p-2 rounded ${theme.inputBg} ${theme.textPrimary}`}
            required
            minLength="6"
          />
        </div>

        {!isLogin && (
          <>
            <div>
              <label className={`block mb-1 ${theme.textPrimary}`}>
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full p-2 rounded ${theme.inputBg} ${theme.textPrimary}`}
                required
                minLength="6"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="acceptsTerms"
                checked={formData.acceptsTerms}
                onChange={handleChange}
                className={`h-4 w-4 rounded ${theme.checkboxColor}`}
                required
              />
              <label className={`ml-2 text-sm ${theme.textPrimary}`}>
                I agree to the terms and conditions
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="acceptsNewsletter"
                checked={formData.acceptsNewsletter}
                onChange={handleChange}
                className={`h-4 w-4 rounded ${theme.checkboxColor}`}
              />
              <label className={`ml-2 text-sm ${theme.textPrimary}`}>
                Subscribe to newsletter
              </label>
            </div>
          </>
        )}

        <button
          type="submit"
          className={`w-full py-2 rounded ${
            isLogin ? theme.buttonPrimary : theme.buttonSecondary
          } text-white`}
          disabled={loading}
        >
          {loading ? "Processing..." : isLogin ? "Login" : "Register"}
        </button>
      </form>

      <p className={`mt-4 text-center ${theme.textSecondary}`}>
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
          }}
          className={`${theme.textAccent} hover:underline`}
          disabled={loading}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}
