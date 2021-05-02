import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import "./Dashboard.css";
import { Button } from "@material-ui/core";
import { useParams } from "react-router-dom";
import Result from "./Result";
import InfoIcon from "@material-ui/icons/Info";
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
        if (!snapshot.empty) {
          setUsers(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              user: doc.data(),
            }))
          );
        }
        setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
      });
  }, []);

  useEffect(() => {
    console.log(users);
  }, [users]);

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
      {users ? (
        users.map(({ id, user }) => (
          <Result resultKey={id} user={user}></Result>
        ))
      ) : (
        <div className="searchResults__notFound">
          <div className="searchResults__notFoundUp">
            <InfoIcon></InfoIcon>
            Nie znaleziono użytkownika
          </div>
          <div className="searchResults__notFoundDown">
            Pasującego do: "{word}"
          </div>
        </div>
      )}
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
