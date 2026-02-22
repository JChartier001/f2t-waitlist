"use client";

import React from "react";
import Link from "next/link";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { FaInstagram, FaSquareFacebook } from "react-icons/fa6";

const Header = () => {
  return (
    <header className="max-w-7xl mx-auto">
      <nav className="w-full p-4 flex items-center justify-between ">
        <Logo />
        <div className="flex items-center space-x-2 sm:space-x-4">
          <ThemeToggle />
          <Link
            target="_blank"
            href="https://www.instagram.com/farm2table.app/"
          >
            <FaInstagram className="h-6 w-6 text-primary" />
          </Link>
          <Link
            target="_blank"
            href="https://www.facebook.com/profile.php?id=61574894922667"
          >
            <FaSquareFacebook className="h-6 w-6 text-primary" />
          </Link>
        </div>
      </nav>
    </header>
  );
};
export default Header;
