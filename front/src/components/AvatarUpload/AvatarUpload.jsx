import React, { useRef, useState } from "react";

const AvatarUpload = ({ onUpload }) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      setError("Please select a file");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setPreview(dataUrl);
      setSuccess(true);
      setLoading(false);
      if (onUpload) onUpload(dataUrl);
    };
    reader.onerror = () => {
      setError("Failed to read file");
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <input type="file" ref={fileInputRef} accept="image/*" className="mb-2" />
      <button
        type="button"
        onClick={handleUpload}
        disabled={loading}
        className="px-3 py-1 rounded bg-blue-500 text-white"
      >
        {loading ? "Uploading..." : "Upload Avatar"}
      </button>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ width: 60, height: 60, borderRadius: "50%", marginTop: 8 }}
        />
      )}
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">Uploaded!</div>}
    </div>
  );
};

export default AvatarUpload;
