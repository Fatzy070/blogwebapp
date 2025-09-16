import React, { useEffect, useState } from "react";
import { db, auth } from "../config/Firebaseconfig";
import { collection, query, where, orderBy, onSnapshot, doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "notifications"),
      where("toUid", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, async snapshot => {
      const notifs = await Promise.all(snapshot.docs.map(async docSnap => {
        const data = docSnap.data();
        let fromUserData = { username: "Anonymous", profilePic: null };

        if (data.fromUid) {
          const userDoc = await getDoc(doc(db, "users", data.fromUid));
          if (userDoc.exists()) {
            fromUserData = {
              username: userDoc.data().username,
              profilePic: userDoc.data().profilePic || null,
            };
          }
        }

        return { id: docSnap.id, ...data, fromUserData };
      }));

      setNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.length === 0 && <p>No notifications yet.</p>}
      {notifications.map(n => (
        <div key={n.id} className={`flex items-start gap-3 p-3 border-b ${!n.read ? "bg-gray-100" : ""}`}>
          <img
            src={n.fromUserData.profilePic || `https://i.pravatar.cc/40?u=${n.fromUid}`}
            alt="avatar"
            className="h-10 w-10 rounded-full"
          />
          <div className="flex-1">
            {n.type === "like" && <p><b>{n.fromUserData.username}</b> liked your post.</p>}
            {n.type === "comment" && <p><b>{n.fromUserData.username}</b> commented: "{n.commentText}"</p>}
            {n.postId && <Link to={`/feed#${n.postId}`} className="text-blue-500 text-sm">View Post</Link>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationsPage;
