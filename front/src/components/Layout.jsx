import { Link, Outlet } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import Navbar from "./NavBar";
import Footer from "./Footer";
import React from "react";

export default function Layout() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col ${theme.bgPrimary}`}>
      <Navbar />
      <main className="flex-grow p-4">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
