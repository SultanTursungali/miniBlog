import { useTheme } from "../context/ThemeContext";
import React from "react";

export default function Footer() {
  const { theme } = useTheme();

  return (
    <footer className={`p-4 ${theme.bgSecondary} mt-auto`}>
      <div className="container mx-auto text-center">
        <p className={theme.textPrimary}>2025 miniBlog.</p>
      </div>
    </footer>
  );
}
