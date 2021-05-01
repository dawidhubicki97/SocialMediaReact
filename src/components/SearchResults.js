import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import "./Dashboard.css";
import { useParams } from "react-router-dom";
import Result from "./Result";

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
    <div className="searchResults">
      {users &&
        users.map(({ id, user }) => <Result key={id} user={user}></Result>)}
    </div>
  );
}
