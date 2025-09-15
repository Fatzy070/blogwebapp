import React, { useEffect, useState } from "react";
import { db, auth } from "../../config/Firebaseconfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { FiMoreVertical, FiHeart, FiMessageCircle, FiShare2 } from "react-icons/fi";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [commentText, setCommentText] = useState({}); // { postId: "comment value" }
  const [showCommentBox, setShowCommentBox] = useState({}); // toggle input
  const [showComments, setShowComments] = useState({}); // toggle comment list

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    };
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleLike = async (post) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const postRef = doc(db, "posts", post.id);

    try {
      if (post.likes?.includes(userId)) {
        await updateDoc(postRef, { likes: arrayRemove(userId) });
        setPosts(
          posts.map((p) =>
            p.id === post.id ? { ...p, likes: p.likes.filter((id) => id !== userId) } : p
          )
        );
      } else {
        await updateDoc(postRef, { likes: arrayUnion(userId) });
        setPosts(
          posts.map((p) =>
            p.id === post.id ? { ...p, likes: [...(p.likes || []), userId] } : p
          )
        );
      }
    } catch (err) {
      console.error("Error liking post:", err);
    }
  };

  const handleShare = (post) => {
    const postUrl = `${window.location.origin}/feed#${post.id}`;
    navigator.clipboard.writeText(postUrl);
    alert("Post link copied to clipboard!");
  };

  const handleComment = async (postId) => {
    const user = auth.currentUser;
    if (!user || !commentText[postId]) return;

    const postRef = doc(db, "posts", postId);

    const newComment = {
      uid: user.uid,
      username: user.displayName || "Anonymous",
      profilePic: user.photoURL || null,
      text: commentText[postId],
      createdAt: new Date().toISOString(),
    };

    try {
      await updateDoc(postRef, { comments: arrayUnion(newComment) });
      setPosts(
        posts.map((p) =>
          p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p
        )
      );
      setCommentText({ ...commentText, [postId]: "" });
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  return (
    <div>
      {posts.length === 0 && <p>No posts yet.</p>}

      {posts.map((post) => {
        const isOwner = auth.currentUser && auth.currentUser.uid === post.uid;
        const liked = auth.currentUser && post.likes?.includes(auth.currentUser.uid);

        return (
          <div key={post.id} className="p-3 mb-3 shadow-sm bg-white rounded relative">
            {/* Avatar + Username */}
            <Link to={`/profile/${post.uid}`} className="flex items-center gap-2">
              <img
                src={post.profilePic || `https://i.pravatar.cc/50?u=${post.uid}`}
                alt="avatar"
                className="h-10 w-10 rounded-full"
              />
              <span className="font-semibold capitalize">{post.username || "Unknown"}</span>
            </Link>

            {/* Dropdown for delete */}
            {isOwner && (
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setDropdownOpen(dropdownOpen === post.id ? null : post.id)}
                >
                  <FiMoreVertical size={20} />
                </button>
                {dropdownOpen === post.id && (
                  <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow-md z-10">
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}

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

            {/* Buttons */}
            <div className="flex items-center mt-2 gap-6">
              <button
                onClick={() => handleLike(post)}
                className={`flex items-center gap-1 ${liked ? "text-red-500" : "text-gray-600"}`}
              >
                <FiHeart />
                {post.likes?.length || 0}
              </button>

              <button
                className="flex items-center gap-1 text-gray-600"
                onClick={() =>
                  setShowCommentBox((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                }
              >
                <FiMessageCircle />
                Comment
              </button>

              <button
                onClick={() => handleShare(post)}
                className="flex items-center gap-1 text-gray-600"
              >
                <FiShare2 />
                Share
              </button>
            </div>

            {/* Comment section */}
            {showComments[post.id] && post.comments?.length > 0 && (
              <div className="mt-2 border-t pt-2">
                {post.comments.map((c, i) => (
                  <div key={i} className="flex items-start gap-2 mt-1">
                    <img
                      src={c.profilePic || `https://i.pravatar.cc/30?u=${c.uid}`}
                      alt="avatar"
                      className="h-7 w-7 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-semibold">{c.username}</p>
                      <p className="text-sm text-gray-700">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {post.comments?.length > 0 && (
              <button
                className="text-blue-500 text-sm mt-1"
                onClick={() =>
                  setShowComments((prev) => ({ ...prev, [post.id]: !prev[post.id] }))
                }
              >
                {showComments[post.id] ? "Hide Comments" : `View Comments (${post.comments.length})`}
              </button>
            )}

            {/* Input to add comment */}
            {showCommentBox[post.id] && (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 border rounded p-2 text-sm"
                  value={commentText[post.id] || ""}
                  onChange={(e) =>
                    setCommentText({ ...commentText, [post.id]: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleComment(post.id);
                  }}
                />
                <button
                  onClick={() => handleComment(post.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Feed;
