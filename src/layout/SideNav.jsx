import React from "react";
import { AiFillHome } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import LogoutMenu from "../components/LogoutMenu";
import ThemeToggle from "../theme/ThemeToggle";
import "../theme.css"; // import css here too

const SideNav = () => {
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/home", icon: <AiFillHome size={24} /> },
    { name: "Notifications", path: "/notification", icon: <IoMdNotifications size={24} /> },
  ];

  return (
    <div className="sidebar fixed left-0 top-0 h-screen w-[230px] shadow-lg border-r flex flex-col justify-between py-6 px-4 hidden md:flex">
      <div className="mb-8 px-3">
        <h1 className="text-2xl font-bold text-blue-600">BlogApp</h1>
      </div>

      <nav className="flex-1 space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center  gap-3 px-3 py-2 rounded-xl text-lg font-medium transition `}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mb-6">
        <ThemeToggle />
      </div>

      <div className="px-3">
        <LogoutMenu />
      </div>
    </div>
  );
};

export default SideNav;
