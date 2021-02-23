import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useAuth } from "../contexts/AuthContext";
import Avatar from "@material-ui/core/Avatar";
import { Button } from "@material-ui/core";
import { db } from "../firebase";
import firebase from "firebase/app";
import { useParams } from "react-router-dom";
import Gallery from "./Gallery";
export default function BrowseProfile() {
  const [profile, setProfile] = useState(null);
  const [isFollowed, setIsFollowed] = useState(false);
  const { currentUser, logout } = useAuth();
  const { uid } = useParams();

  useEffect(() => {
    db.collection("users")
      .doc(uid)
      .get()
      .then((snapshot) => setProfile(snapshot.data()));
  }, []);

  useEffect(() => {
    db.collection("following")
      .doc(currentUser.uid)
      .collection("userFollowing")
      .doc(uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setIsFollowed(true);
        } else {
          setIsFollowed(false);
        }
      });
  }, []);

  function handleFollowButton(e) {
    if (isFollowed) {
      const decrement = firebase.firestore.FieldValue.increment(-1);
      db.collection("following")
        .doc(currentUser.uid)
        .collection("userFollowing")
        .doc(uid)
        .delete();
      db.collection("users")
        .doc(currentUser.uid)
        .update({ following: decrement });
      db.collection("users").doc(uid).update({ followed: decrement });
    } else {
      const increment = firebase.firestore.FieldValue.increment(1);
      db.collection("following")
        .doc(currentUser.uid)
        .collection("userFollowing")
        .doc(uid)
        .set({});
      db.collection("users")
        .doc(currentUser.uid)
        .update({ following: increment });
      db.collection("users").doc(uid).update({ followed: increment });
    }
  }

  return (
    <div className="profile">
      {profile && (
        <div className="profile__container">
          <div className="profile__header">
            <div className="imageContainer">
              <label>
                {profile.avatarUrl ? (
                  <Avatar src={profile.avatarUrl} className="profile__image" />
                ) : (
                  <Avatar
                    src="https://i.stack.imgur.com/l60Hf.png"
                    className="profile__image"
                  />
                )}
              </label>
            </div>
            <div className="profile__userInfo">
              <div className="profile__headerUserName">{profile.username}</div>
              <div className="profile__followers">
                Obserwuje: <b>{profile.followed}</b>
              </div>
              <div className="profile__following">
                Obserwowani: <b>{profile.following}</b>
              </div>
              {isFollowed ? (
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="profile__followButton"
                  onClick={handleFollowButton}
                >
                  Przestań Obserwować
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="profile__followButton"
                  onClick={handleFollowButton}
                >
                  Obserwuj
                </Button>
              )}
            </div>
            <div className="profile__bio">{profile.bio}</div>
          </div>
          <div className="profile__posts">
            <Gallery uid={uid}></Gallery>
          </div>
        </div>
      )}
    </div>
  );
}
