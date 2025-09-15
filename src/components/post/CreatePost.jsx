import React, { useState, useRef } from "react";
import axios from "axios";
import { db, auth } from "../../config/Firebaseconfig";
import { addDoc, collection, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { AiOutlineFileImage } from "react-icons/ai"; // icon for file
import { AiFillPicture } from "react-icons/ai";
import { Link } from "react-router-dom";
const CreatePost = () => {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handlePost = async () => {
    if (!text && !file) return alert("Write something or add a file");

    setLoading(true);
    try {
      let mediaUrl = null;
      let mediaType = null;

      // Upload to Cloudinary if file selected
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

      // Get logged in user
      const user = auth.currentUser;

      // Fetch user profile from Firestore
      let username = "Anonymous";
      let profilePic = null;

      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          username = userDoc.data().username;
          profilePic = userDoc.data().profilePic || null;
        }
      }

      // Save post
      await addDoc(collection(db, "posts"), {
        uid: user?.uid || "guest",
        username,
        profilePic,
        text,
        mediaUrl,
        mediaType,
        createdAt: serverTimestamp(),
      });

      // Reset
      setText("");
      setFile(null);
    } catch (err) {
      console.error("Error creating post:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" rounded pt-5 px-3 mb-4 bg-white shadow-sm flex gap-3">
      {/* Profile picture */}
      <Link to='/profile'>
       <img
        src={auth.currentUser?.photoURL || "https://i.pravatar.cc/40"}
        alt="profile"
        className="h-10 w-10 rounded-full "
      />
      </Link>

      <div className="flex-1">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind?"
          className="w-full border border-gray-500 h-[40px] px-3 mb-3 rounded flex justify-center"
        />

        <div className="flex items-center justify-between">
          {/* File upload icon */}
          <AiFillPicture
            size={25}
            className="cursor-pointer text-gray-600"
            onClick={() => fileInputRef.current.click()}
          />
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
            className="bg-blue-500 text-white px-4 py-1 rounded"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>

        {/* Show selected file name */}
        {file && <p className="text-sm mt-1 text-gray-500">{file.name}</p>}
      </div>
    </div>
  );
};

export default CreatePost;
