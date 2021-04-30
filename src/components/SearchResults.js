import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
export default function SearchResults() {
  const { word } = useParams();
  const [users, setUsers] = useState(null);

  useEffect(() => {
    db.collection("users")
      .where("username", ">=", word)
      .where("username", "<=", word + "~")
      .get()
      .then((snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            user: doc.data(),
          }))
        );
      });
  }, []);
  return (
    <div>
      {users && users.map(({ id, user }) => <div>{user.username}</div>)}
    </div>
  );
}
