// utils/CreateNotification.js
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../config/Firebaseconfig";

export const createNotification = async ({ type, fromUid, toUid, postId, commentText }) => {
  // Avoid notifying yourself
  if (fromUid === toUid) return;

  try {
    await addDoc(collection(db, "notifications"), {
      type,           // "like" | "comment" | "follow" etc.
      fromUid,        // who triggered the notification
      toUid,          // who receives the notification
      postId: postId || null,
      commentText: commentText || null, // only for comment notifications
      read: false,    // unread by default
      createdAt: serverTimestamp(),
    });
     console.log("Notification created successfully");
  } catch (err) {
    console.error("Error creating notification:", err);
  }
};
