import React, { useState, useEffect } from "react";
import { auth, db } from "../config/Firebaseconfig";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FiLogOut, FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const LogoutMenu = () => {
  const [open, setOpen] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfilePic(
          data.profilePic || `https://i.pravatar.cc/100?u=${user.uid}`
        );
        setUsername(data.username || "Anonymous");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleAddAccount = () => {
    navigate("/login");
  };

  return (
    <div className="relative">
      {/* Profile Avatar */}
      <img
        src={profilePic}
        alt="profile"
        className="h-12 w-12 rounded-full cursor-pointer border-2 border-gray-300 hover:border-blue-500 transition"
        onClick={() => setOpen(!open)}
      />

      {/* Dropdown */}
      {open && (
        <div className="absolute top-[-100px] left-[-25px] shadow-xl rounded-2xl w-[220px] py-3 clip ">

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex gap-2.5 pl-2 items-center w-full  py-2 text-white hover:bg-gray-100 transition"
          >
             Log out
             <p className="font-semibold">@{username}</p>
          </button>

          {/* Add Existing Account */}
          <button
            onClick={handleAddAccount}
            className="flex pl-2 py-2 items-center w-full text-white hover:bg-gray-100 transition"
          >
           <p> Add existing account</p>
            
          </button>
        </div>
      )}
    </div>
  );
};

export default LogoutMenu;
