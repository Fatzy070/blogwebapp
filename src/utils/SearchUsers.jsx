import React, { useState, useEffect } from "react";
import { IoMdNotifications } from "react-icons/io";
import { auth, db } from "../config/Firebaseconfig";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import ThemeToggle from "../theme/ThemeToggle";

const SearchUsers = () => {
  const [profilePic, setProfilePic] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);

  // Fetch current user's profile pic
  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        setProfilePic(userDoc.data().profilePic || `https://i.pravatar.cc/40?u=${user.uid}`);
      } else {
        setProfilePic(`https://i.pravatar.cc/40?u=${user.uid}`);
      }
    };

    fetchProfile();
  }, []);

  // Search users by username
  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    const fetchUsers = async () => {
      const q = query(
        collection(db, "users"),
        where("username", ">=", searchTerm),
        where("username", "<=", searchTerm + "\uf8ff")
      );
      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setResults(users);
    };

    fetchUsers();
  }, [searchTerm]);

  return (
    <div className="">
      {/* Header */}
      <div className="sticky top-0  flex items-center justify-between p-3 shadow-sm z-10">
        <Link to="/notification" className="text-gray-600 hover:text-blue-500">
          <IoMdNotifications size={27} />
        </Link>
        <div>
          <ThemeToggle />
        </div>
        <Link to={`/profile/${auth.currentUser?.uid}`}>
          <img
            src={profilePic}
            alt="profile"
            className="h-9 w-9 rounded-full border cursor-pointer"
          />
        </Link>
        
      </div>

      {/* Search Input */}
      <div className="px-4 mt-3">
        <input
          type="text"
          className="w-full  shadow-sm rounded-full py-2 px-4 text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="🔍 Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Search Results */}
      <div className="max-w-md mx-auto mt-4 px-3">
        {results.length === 0 && searchTerm && (
          <p className="text-center text-gray-500 text-sm">No users found.</p>
        )}

        {results.map(user => (
          <Link
            to={`/profile/${user.id}`}
            key={user.id}
            className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm mb-2 hover:bg-gray-100 transition"
          >
            <img
              src={user.profilePic || `https://i.pravatar.cc/40?u=${user.id}`}
              alt={user.username}
              className="h-10 w-10 rounded-full object-cover border"
            />
            <span className="font-medium text-gray-700">{user.username}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchUsers;
