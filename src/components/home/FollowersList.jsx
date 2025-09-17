  // FollowersList.jsx
  import React, { useEffect, useState } from "react";
  import { db } from "../../config/Firebaseconfig";
  import { doc, getDoc } from "firebase/firestore";
  import { Link, useParams } from "react-router-dom";

  const FollowersList = () => {
    const { uid, type } = useParams(); // type = "followers" | "following"
    const [users, setUsers] = useState([]);

    useEffect(() => {
      const fetchList = async () => {
        const userRef = doc(db, "users", uid);
        const snap = await getDoc(userRef);
        if (!snap.exists()) return;

        const data = snap.data();
        const list = data[type] || [];
        setUsers(list);
      };

      fetchList();
    }, [uid, type]);

    return (
      <div className="p-4 max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-4 capitalize">{type}</h1>
        {users.length === 0 && <p>No {type} yet.</p>}

        {users.map((id) => (
          <Link
            to={`/profile/${id}`}
            key={id}
            className="flex items-center gap-2 border-b py-2"
          >
            <img
              src={`https://i.pravatar.cc/50?u=${id}`}
              alt="avatar"
              className="h-8 w-8 rounded-full border"
            />
            <span className="font-semibold">{id}</span>
          </Link>
        ))}
      </div>
    );
  };

  export default FollowersList;
