import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import React from "react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);

import axios from "axios";

axios.interceptors.request.use((config) => {
  if (config.url === "/upload-avatar") {
    return new Promise((resolve) => {
      setTimeout(() => {
        const fileName = `avatar-${Date.now()}.jpg`;
        const avatarUrl = `/avatars/${fileName}`;

        console.log("File would be saved as:", fileName);

        resolve({
          data: {
            ...currentUser,
            avatar: avatarUrl,
          },
        });
      }, 1000);
    });
  }
  return config;
});

axios.put(`/users/:id`, async (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  console.log("Update user in db.json:", userId, updatedUser);

  return res.json(updatedUser);
});
