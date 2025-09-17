import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { db, auth } from "../../config/Firebaseconfig";
import { addDoc, collection, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { AiFillPicture } from "react-icons/ai";
import { Link } from "react-router-dom";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState("");
  const [username, setUsername] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setProfilePic(data.profilePic || `https://i.pravatar.cc/40?u=${user.uid}`);
        setUsername(data.username || "Anonymous");
      } else {
        setProfilePic(`https://i.pravatar.cc/40?u=${user.uid}`);
        setUsername("Anonymous");
      }
    };

    fetchProfile();
  }, []);

  const handlePost = async () => {
    if (!text && !file) return alert("Write something or add a file");

    setLoading(true);
    try {
      let mediaUrl = null;
      let mediaType = null;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "social_upload");

        const endpoint = file.type.startsWith("video")
          ? "https://api.cloudinary.com/v1_1/doyiqdtoc/video/upload"
          : "https://api.cloudinary.com/v1_1/doyiqdtoc/image/upload";

        const res = await axios.post(endpoint, formData);
        mediaUrl = res.data.secure_url;
        mediaType = file.type.startsWith("video") ? "video" : "image";
      }

      const user = auth.currentUser;

      await addDoc(collection(db, "posts"), {
        uid: user?.uid || "guest",
        username,
        profilePic,
        text,
        mediaUrl,
        mediaType,
        createdAt: serverTimestamp(),
      });

      setText("");
      setFile(null);
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" shadow-md rounded-2xl p-4 mb-6  border-gray-100">
      {/* Header: profile pic + input */}
      <div className="flex items-start gap-3">
        <Link to={`/profile/${auth.currentUser?.uid}`}>
          <img
            src={profilePic}
            alt="profile"
            className="h-12 w-12 rounded-full object-cover "
          />
        </Link>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`What's on your mind, ${username}?`}
          rows={2}
          className="w-full resize-none border-none focus:ring-0 outline-none  rounded-xl px-3 py-2 text-sm"
        />
      </div>

      {/* Divider */}
      <div className="border-t my-3"></div>

      {/* Footer: file + button */}
      <div className="flex items-center justify-between">
        {/* Upload file */}
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-500 text-sm font-medium"
        >
          <AiFillPicture size={20} />
          <span>Add Photo/Video</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />

        {/* Post button */}
        <button
          onClick={handlePost}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-70 text-white px-5 py-1.5 rounded-full text-sm font-semibold transition"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>

      {/* Show selected file name */}
      {file && (
        <p className="text-xs mt-2 text-gray-500 truncate">
          📎 {file.name}
        </p>
      )}
    </div>
  );
};

export default CreatePost;
