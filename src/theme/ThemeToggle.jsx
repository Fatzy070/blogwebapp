import React, { useEffect, useState } from "react";
import "../theme.css";
import { PiSunDimLight } from "react-icons/pi";
import { IoMdMoon } from "react-icons/io";


const ThemeToggle = () => {
  const [dark, setDark] = useState(false);

  // Load saved theme when component mounts
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDark(true);
      document.body.classList.add("dark");
    }
  }, []);

  // Apply theme when dark state changes
  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="px-4 py-2 rounded "
    >
      {dark ? <IoMdMoon size={24}  />: <PiSunDimLight size={24} />}
    </button>
  );
};

export default ThemeToggle;
