import React, { useState, useEffect } from "react";
import { IoMdNotifications } from "react-icons/io";
import { auth, db } from "../config/Firebaseconfig";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";

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
    <div>
      {/* Header */}
      <div className="flex items-center justify-between p-3">
        <Link to="/notification">
          <IoMdNotifications size={27} />
        </Link>
        <Link to="/profile">
          <img
            src={profilePic}
            alt="profile"
            className="h-[30px] w-[30px] rounded-full"
          />
        </Link>
      </div>

      {/* Search Input */}
      <div className="flex justify-center w-full mb-2">
        <input
          type="text"
          className="border bg-gray-200 rounded-[8px] py-1 px-2 w-full max-w-md"
          placeholder="🔍 Search users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Search Results */}
      <div className="max-w-md mx-auto">
        {results.map(user => (
          <div key={user.id} className="flex items-center gap-3 p-2">
            <img
              src={user.profilePic || `https://i.pravatar.cc/40?u=${user.id}`}
              alt={user.username}
              className="h-8 w-8 rounded-full"
            />
            <span>{user.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchUsers;
