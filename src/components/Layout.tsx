"use client"; // Required for hooks like usePathname

import React, { useState, useEffect } from "react"; // Import useState, useEffect
import Image from "next/image";
import Link from "next/link"; // Import Link
import { usePathname } from "next/navigation"; // Import usePathname
import {
  CpuChipIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  UserCircleIcon, // For avatar placeholder
  CreditCardIcon, // For points
  StarIcon, // Added for Subscription
  SunIcon, // For theme toggle
  MoonIcon, // For theme toggle
  BellIcon, // For Notifications
  WalletIcon, // For Wallet
  SquaresPlusIcon, // For MCP Hub
} from "@heroicons/react/24/outline"; // Import necessary icons

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [currentTheme, setCurrentTheme] = useState("black-purple");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(currentTheme === "black-purple" ? "blue-white" : "black-purple");
  };

  // Define menu items with icons - Filtered for implemented pages
  const mainNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: ChartBarIcon },
    { path: "/agents", label: "My Agents", icon: CpuChipIcon },
    { path: "/wallet", label: "Wallet", icon: WalletIcon },
    { path: "/store", label: "Agent Store", icon: BuildingStorefrontIcon },
    { path: "/store", label: "MCP Hub", icon: SquaresPlusIcon }, // Added MCP Hub
  ];

  const userProfileMenuItem = { path: "/setting", label: "User Profile", icon: UserCircleIcon };
  // Removed settingsMenuItem as /settings page is not implemented

  const userPoints = 1234; // Mock data

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <div className="navbar bg-base-200 sticky top-0 z-30 shadow-md px-4">
        {/* Navbar Start: Logo and Mobile Menu Toggle */}
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {mainNavItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`${pathname.startsWith(item.path) ? "active" : ""} flex gap-2`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={userProfileMenuItem.path}
                  className={`${pathname.startsWith(userProfileMenuItem.path) ? "active" : ""} flex gap-2`}
                >
                  <userProfileMenuItem.icon className="h-5 w-5" />
                  {userProfileMenuItem.label}
                </Link>
              </li>
            </ul>
          </div>
          <Link className="font-pixel flex items-center gap-2 text-xl lg:text-2xl" href="/agents">
            <Image
              src="/logo.png"
              alt="0xAuto Logo"
              width={32}
              height={32}
              className="transition-transform duration-700 ease-in-out hover:rotate-[360deg]"
            />
            0xAuto
          </Link>
        </div>

        {/* Navbar Center: Desktop Menu Items */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            {mainNavItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`${
                    pathname.startsWith(item.path) ? "active" : ""
                  } flex gap-2 items-center`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Navbar End: Points, Theme Toggle, User Avatar */}
        <div className="navbar-end space-x-2">
          {/* Points Display */}
          <div className="hidden sm:flex items-center gap-1 p-2 rounded bg-base-300 text-sm">
            <CreditCardIcon className="h-4 w-4 opacity-70" />
            <span>{userPoints}</span>
          </div>

          {/* Theme Toggle */}
          <label className="swap swap-rotate btn btn-ghost btn-circle">
            <input
              type="checkbox"
              onChange={toggleTheme}
              checked={currentTheme === "blue-white"}
              aria-label="Toggle theme"
            />
            <SunIcon className="swap-on h-5 w-5" />
            <MoonIcon className="swap-off h-5 w-5" />
          </label>

          {/* User Avatar Dropdown */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1">
                <UserCircleIcon className="w-full h-full text-base-content opacity-60" />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link href={userProfileMenuItem.path} className="flex gap-2">
                  <userProfileMenuItem.icon className="h-5 w-5" />
                  {userProfileMenuItem.label}
                </Link>
              </li>
              {/* Add other user-specific links here if needed, e.g., Settings (if re-implemented) */}
              <li>
                <a className="flex gap-2">
                  {/* Placeholder for Logout Icon if available */}
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Page content */}
      <main className="p-4 w-full flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
