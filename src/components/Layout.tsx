"use client"; // Required for hooks like usePathname

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggleButton from "./ThemeToggleButton"; // Import the new ThemeToggleButton
import DynamicBackground from "./DynamicBackground"; // Import the DynamicBackground component
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
  ArrowLeftOnRectangleIcon, // For Logout
} from "@heroicons/react/24/outline"; // Import necessary icons
import { getDiceBearAvatar, DICEBEAR_STYLES } from '@/utils/dicebear'; // Import DiceBear utility
import { fetchMockCurrentUser } from '@/data/mocks/userMocks'; // To get user info for avatar seed
import { User } from '@/types/user';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await fetchMockCurrentUser();
      setCurrentUser(user);
    };
    loadUser();
  }, []);

  // Define menu items with icons - Filtered for implemented pages
  const mainNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: ChartBarIcon },
    { path: "/agents", label: "My Agents", icon: CpuChipIcon },
    { path: "/wallet", label: "Wallet", icon: WalletIcon },
    { path: "/store", label: "Agents Store", icon: BuildingStorefrontIcon },
    { path: "/mcp-hub", label: "MCP Hub", icon: SquaresPlusIcon }, // Updated MCP Hub path
  ];

  const userProfileMenuItem = { path: "/setting", label: "User Profile", icon: UserCircleIcon };
  // Removed settingsMenuItem as /settings page is not implemented

  const userPoints = 8916; // Updated mock data

  // Helper function to check if a path is active
  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === path;
    }
    return pathname?.startsWith(path);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* <DynamicBackground /> */}
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
                <li key={item.path} className={isActive(item.path) ? "bg-primary bg-opacity-20 rounded-lg" : ""}>
                  <Link
                    href={item.path}
                    className="flex gap-2"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className={isActive(userProfileMenuItem.path) ? "bg-primary bg-opacity-20 rounded-lg" : ""}>
                <Link
                  href={userProfileMenuItem.path}
                  className="flex gap-2"
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
              <li key={item.path} className={isActive(item.path) ? "bg-primary bg-opacity-20 rounded-lg" : ""}>
                <Link
                  href={item.path}
                  className="flex gap-2 items-center"
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

          {/* Theme Toggle will be moved to user menu */}
          {/* User Avatar Dropdown */}
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-1 overflow-hidden bg-base-300">
                <img
                  src={currentUser?.avatarUrl || getDiceBearAvatar(DICEBEAR_STYLES.USER, currentUser?.username || 'default-user', {backgroundColor:['transparent']})}
                  alt="User Avatar"
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-56" // Increased width for better spacing
            >
              {/* User Profile */}
              <li className={`my-1 ${isActive(userProfileMenuItem.path) ? "bg-primary bg-opacity-20 rounded-lg" : ""}`}>
                <Link href={userProfileMenuItem.path} className="flex items-center gap-3 p-2 whitespace-nowrap hover:bg-base-200 rounded-md">
                  <userProfileMenuItem.icon className="h-5 w-5" />
                  Profile
                </Link>
              </li>
              {/* Subscription Service */}
              <li className={`my-1 ${isActive("/subscription") ? "bg-primary bg-opacity-20 rounded-lg" : ""}`}>
                <Link href="/subscription" className="flex items-center gap-3 p-2 whitespace-nowrap hover:bg-base-200 rounded-md">
                  <StarIcon className="h-5 w-5" />
                  Subscription
                </Link>
              </li>
              {/* Divider */}
              <div className="divider my-0"></div>
              {/* Switch Theme */}
              <li className="my-1">
                <div className="flex items-center justify-between w-full p-2 whitespace-nowrap hover:bg-base-200 rounded-md group">
                  <span className="flex items-center gap-3">
                    {/* ThemeToggleButton will show the correct icon (Sun or Moon) */}
                    <ThemeToggleButton iconOnly={true} />
                    Theme
                  </span>
                  <ThemeToggleButton showIcon={false} /> {/* Toggle switch without its own icon */}
                </div>
              </li>
              {/* Divider */}
              <div className="divider my-0"></div>
              {/* Logout */}
              <li className="my-1">
                <a className="flex items-center gap-3 p-2 whitespace-nowrap text-error hover:bg-error hover:text-error-content rounded-md">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Page content */}
      <main className="p-4 w-full flex-grow bg-base-100 flex flex-col">{children}</main>
    </div>
  );
};

export default Layout;
