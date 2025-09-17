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
import {
  FiMoreVertical,
  FiHeart,
  FiMessageCircle,
  FiShare2,
} from "react-icons/fi";
import { createNotification } from "../../utils/CreateNotification";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [commentText, setCommentText] = useState({});
  const [showCommentBox, setShowCommentBox] = useState({});
  const [showComments, setShowComments] = useState({});

  // Fetch posts
  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    };
    fetchPosts();
  }, []);

  // Delete post
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    await deleteDoc(doc(db, "posts", postId));
    setPosts(posts.filter((p) => p.id !== postId));
  };

  // Like post
  const handleLike = async (post) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;
    const postRef = doc(db, "posts", post.id);

    if (post.likes?.includes(userId)) {
      await updateDoc(postRef, { likes: arrayRemove(userId) });
      setPosts(
        posts.map((p) =>
          p.id === post.id
            ? { ...p, likes: p.likes.filter((id) => id !== userId) }
            : p
        )
      );
    } else {
      await updateDoc(postRef, { likes: arrayUnion(userId) });
      setPosts(
        posts.map((p) =>
          p.id === post.id
            ? { ...p, likes: [...(p.likes || []), userId] }
            : p
        )
      );

      if (auth.currentUser.uid !== post.uid) {
        await createNotification({
          type: "like",
          fromUid: userId,
          toUid: post.uid,
          postId: post.id,
        });
      }
    }
  };

  // Share post
  const handleShare = (post) => {
    const postUrl = `${window.location.origin}/feed#${post.id}`;
    navigator.clipboard.writeText(postUrl);
    alert("Post link copied to clipboard!");
  };

  // Comment
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

    await updateDoc(postRef, { comments: arrayUnion(newComment) });

    const postOwnerUid = posts.find((p) => p.id === postId)?.uid;
    if (postOwnerUid && postOwnerUid !== user.uid) {
      await createNotification({
        type: "comment",
        fromUid: user.uid,
        toUid: postOwnerUid,
        postId,
        commentText: commentText[postId],
      });
    }

    setPosts(
      posts.map((p) =>
        p.id === postId
          ? { ...p, comments: [...(p.comments || []), newComment] }
          : p
      )
    );
    setCommentText({ ...commentText, [postId]: "" });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {posts.length === 0 && (
        <p className="text-center  mt-10">No posts yet.</p>
      )}

      {posts.map((post) => {
        const isOwner = auth.currentUser?.uid === post.uid;
        const liked = auth.currentUser && post.likes?.includes(auth.currentUser.uid);

        return (
          <div
            key={post.id}
            className=" shadow rounded-2xl p-4 relative hover:shadow-md transition"
          >
            {/* User info */}
            <div className="flex items-center justify-between">
              <Link
                to={`/profile/${post.uid}`}
                className="flex items-center gap-3"
              >
                <img
                  src={post.profilePic || `https://i.pravatar.cc/50?u=${post.uid}`}
                  alt="avatar"
                  className="h-11 w-11 rounded-full  object-cover"
                />
                <span className="font-semibold">
                  {post.username || "Unknown"}
                </span>
              </Link>

              {isOwner && (
                <div className="relative">
                  <button
                    onClick={() =>
                      setDropdownOpen(dropdownOpen === post.id ? null : post.id)
                    }
                  >
                    <FiMoreVertical size={22} className="" />
                  </button>
                  {dropdownOpen === post.id && (
                    <div className="absolute right-0 mt-2 w-36  border rounded-lg shadow-md z-10">
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="block w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Post text */}
            {post.text && (
              <p className="mt-3   text-[15px]">{post.text}</p>
            )}

            {/* Media */}
            {post.mediaUrl && (
              <div className="mt-3">
                {post.mediaType === "video" ? (
                  <video controls className="w-full rounded-xl">
                    <source src={post.mediaUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={post.mediaUrl}
                    alt="post"
                    className="w-full rounded-xl object-cover max-h-[450px]"
                  />
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center mt-4 gap-6 text-gray-600 text-sm">
              <button
                onClick={() => handleLike(post)}
                className={`flex items-center gap-1 hover:text-red-500 transition ${
                  liked ? "text-red-500" : ""
                }`}
              >
                <FiHeart />
                {post.likes?.length || 0}
              </button>

              <button
                onClick={() =>
                  setShowCommentBox((prev) => ({
                    ...prev,
                    [post.id]: !prev[post.id],
                  }))
                }
                className="flex items-center gap-1 hover:text-blue-500 transition"
              >
                <FiMessageCircle /> Comment
              </button>

              <button
                onClick={() => handleShare(post)}
                className="flex items-center gap-1 hover:text-green-500 transition"
              >
                <FiShare2 /> Share
              </button>
            </div>

            {/* Comments */}
            {showComments[post.id] && post.comments?.length > 0 && (
              <div className="mt-3 border-t pt-3 space-y-2">
                {post.comments.map((c, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <img
                      src={c.profilePic || `https://i.pravatar.cc/30?u=${c.uid}`}
                      alt="avatar"
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="bg-gray-100 p-2 rounded-lg max-w-[80%]">
                      <p className="text-sm font-semibold">{c.username}</p>
                      <p className="text-sm text-gray-700">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {post.comments?.length > 0 && (
              <button
                className="text-blue-500 text-sm mt-2"
                onClick={() =>
                  setShowComments((prev) => ({
                    ...prev,
                    [post.id]: !prev[post.id],
                  }))
                }
              >
                {showComments[post.id]
                  ? "Hide Comments"
                  : `View Comments (${post.comments.length})`}
              </button>
            )}

            {/* Add comment */}
            {showCommentBox[post.id] && (
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
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
                  className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition"
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
