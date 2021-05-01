import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import "./Dashboard.css";
import { Button } from "@material-ui/core";
import { useParams } from "react-router-dom";
import Result from "./Result";

export default function SearchResults() {
  const { word } = useParams();
  const [users, setUsers] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  useEffect(() => {
    db.collection("users")
      .where("username", ">=", word)
      .where("username", "<=", word + "~")
      .limit(8)
      .get()
      .then((snapshot) => {
        setUsers(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            user: doc.data(),
          }))
        );
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      });
  }, []);

  function addPostsScroll(e) {
    if (lastVisible) {
      db.collection("users")
        .where("username", ">=", word)
        .where("username", "<=", word + "~")
        .startAfter(lastVisible)
        .limit(8)
        .get()
        .then((snapshot) => {
          setUsers(
            users.concat(
              snapshot.docs.map((doc) => ({
                id: doc.id,
                user: doc.data(),
              }))
            )
          );
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        });
    }
  }

  return (
    <div className="searchResults">
      {users &&
        users.map(({ id, user }) => <Result key={id} user={user}></Result>)}
      <div className="searchResults__loadButton">
        {lastVisible && (
          <Button
            variant="contained"
            color="primary"
            className="searchResults__button"
            onClick={addPostsScroll}
          >
            Załaduj więcej
          </Button>
        )}
      </div>
    </div>
  );
}
