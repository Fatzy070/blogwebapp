import React, { useEffect, useState, useRef } from "react";
import { auth, db } from "../../config/Firebaseconfig";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { useParams, Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { FiMoreVertical, FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";

const Profile = () => {
  const { uid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [editing, setEditing] = useState(false);
  const fileInputRef = useRef(null);

  const [posts, setPosts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      const profileRef = doc(db, "users", uid || currentUser.uid);
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) {
        const profileData = profileSnap.data();
        setUser({ id: uid || currentUser.uid, ...profileData });
        setBio(profileData.bio || "");
        setProfilePic(
          profileData.profilePic || `https://i.pravatar.cc/150?u=${uid || currentUser.uid}`
        );
      }

      setLoading(false);
    };

    fetchData();
  }, [uid]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) return;
      const postsQuery = query(
        collection(db, "posts"),
        where("uid", "==", user.id)
      );
      const snapshot = await getDocs(postsQuery);
      const userPosts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(userPosts);
    };

    fetchPosts();
  }, [user]);

  // ✅ Save updated profile
  const handleSave = async () => {
    const me = auth.currentUser;
    if (!me) return;

    const myRef = doc(db, "users", me.uid);
    await updateDoc(myRef, {
      bio,
      profilePic,
    });

    setUser((prev) => ({ ...prev, bio, profilePic }));
    setEditing(false);
  };

  // Follow / Unfollow
  const handleFollow = async () => {
    const me = auth.currentUser;
    if (!me || !user) return;

    const myRef = doc(db, "users", me.uid);
    const otherRef = doc(db, "users", user.id);

    const alreadyFollowing = user.followers?.includes(me.uid);

    if (alreadyFollowing) {
      await updateDoc(myRef, { following: arrayRemove(user.id) });
      await updateDoc(otherRef, { followers: arrayRemove(me.uid) });

      setUser((prev) => ({
        ...prev,
        followers: prev.followers.filter((f) => f !== me.uid),
      }));
    } else {
      await updateDoc(myRef, { following: arrayUnion(user.id) });
      await updateDoc(otherRef, { followers: arrayUnion(me.uid) });

      setUser((prev) => ({
        ...prev,
        followers: [...(prev.followers || []), me.uid],
      }));
    }
  };

  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm("Delete this post?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts(posts.filter((p) => p.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>No profile found</p>;

  const isMe = auth.currentUser?.uid === user.id;
  const amIFollowing = user.followers?.includes(auth.currentUser?.uid);

  return (
    <div className="">
      {/* Profile header */}
      <div className="pb-2 pt-3 px-4 block md:hidden">
        <Link to="/home">
          <IoIosArrowBack size={22} />
        </Link>
      </div>

      <div className="flex gap-4 p-4 rounded-lg shadow">
        <div>
          <img
            src={profilePic}
            alt="avatar"
            className="h-[80px] w-[80px] rounded-full cursor-pointer"
            onClick={() => editing && fileInputRef.current.click()}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onloadend = () => setProfilePic(reader.result);
              reader.readAsDataURL(file);
            }}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="flex-1 pt-2">
          <h2 className="text-[1.4rem] capitalize font-semibold">{user.username}</h2>
          {editing ? (
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-2 border rounded p-2 w-full"
            />
          ) : (
            <p className="mt-[1px]">{user.bio || "No bio yet"}</p>
          )}

          <div className="mt-6 flex gap-3">
            {isMe ? (
              editing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Edit Profile
                </button>
              )
            ) : (
              <button
                onClick={handleFollow}
                className={`px-4 py-2 rounded ${
                  amIFollowing ? "bg-gray-400 text-white" : "bg-blue-500 text-white"
                }`}
              >
                {amIFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Followers & Following */}
      <div className="flex justify-center gap-6 mt-3 text-sm">
        <section>
          <p>{posts.length || 0}</p>
          <p>Posts</p>
        </section>
        <section>
          <p className="font-bold text-center">{user.followers?.length || 0}</p>
          <p>Followers</p>
        </section>
        <section>
          <p className="font-bold text-center ">{user.following?.length || 0}</p>
          <p>Following</p>
        </section>
      </div>

      {/* User Posts */}
      <div className="mt-6">
        
        {posts.length === 0 ? (
          <p>No posts yet.</p>
        ) : (
          posts.map((post) => {
            const liked = auth.currentUser && post.likes?.includes(auth.currentUser.uid);
            return (
              <div key={post.id} className="p-3 mb-3 shadow-sm bg-white rounded relative">
                {/* Post text */}
                {post.text && <p className="mt-2 text-gray-700">{post.text}</p>}

                {/* Post media */}
                {post.mediaUrl && (
                  <div className="mt-2">
                    {post.mediaType === "video" ? (
                      <video controls className="w-full rounded">
                        <source src={post.mediaUrl} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        src={post.mediaUrl}
                        alt="post"
                        className="w-full md:w-[70%] rounded-[15px] h-[300px] md:h-[400px]"
                      />
                    )}
                  </div>
                )}

                {/* Dropdown for delete */}
                <div className="absolute top-3 right-3">
                  <button onClick={() => setDropdownOpen(dropdownOpen === post.id ? null : post.id)}>
                    <FiMoreVertical size={20} />
                  </button>
                  {dropdownOpen === post.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10">
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex items-center mt-2 gap-6">
                  <button
                    className={`flex items-center gap-1 ${liked ? "text-red-500" : "text-gray-600"}`}
                  >
                    <FiHeart />
                    {post.likes?.length || 0}
                  </button>
                  <button className="flex items-center gap-1 text-gray-600">
                    <FiMessageCircle />
                    Comment
                  </button>
                  <button className="flex items-center gap-1 text-gray-600">
                    <FiShare2 />
                    Share
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Profile;
