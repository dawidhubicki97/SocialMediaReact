import React, { useState, useEffect } from "react";
import Post from "./Post";
import "./Post.css";
import { Button } from "@material-ui/core";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
export default function Gallery({ uid }) {
  const [posts, setPosts] = useState([]);
  const { currentUser, logout } = useAuth();
  const [followedUsers, setFollowedUsers] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  useEffect(() => {
    if (followedUsers.length > 0) {
      db.collection("allposts")
        .where("ownerUid", "in", followedUsers)
        .orderBy("timestamp")
        .limit(6)
        .get()
        .then((snapshot) => {
          setPosts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              post: doc.data(),
            }))
          );
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        });
    }
  }, [followedUsers]);

  function addPostsScroll(e) {
    if (uid == null) {
      if (lastVisible) {
        db.collection("allposts")
          .where("ownerUid", "in", followedUsers)
          .orderBy("timestamp")
          .startAfter(lastVisible)
          .limit(6)
          .get()
          .then((snapshot) => {
            setPosts(
              posts.concat(
                snapshot.docs.map((doc) => ({
                  id: doc.id,
                  post: doc.data(),
                }))
              )
            );
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
          });
      } else {
        console.log("niemanic");
      }
    } else {
      if (lastVisible) {
        db.collection("allposts")
          .where("ownerUid", "==", uid)
          .orderBy("timestamp")
          .startAfter(lastVisible)
          .limit(6)
          .get()
          .then((snapshot) => {
            setPosts(
              posts.concat(
                snapshot.docs.map((doc) => ({
                  id: doc.id,
                  post: doc.data(),
                }))
              )
            );
            setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
          });
      } else {
        console.log("niemanic");
      }
    }
  }

  useEffect(() => {
    if (uid == null) {
      db.collection("following")
        .doc(currentUser.uid)
        .collection("userFollowing")
        .onSnapshot((snapshot) => {
          setFollowedUsers(snapshot.docs.map((doc) => doc.id));
        });
    } else {
      db.collection("allposts")
        .where("ownerUid", "==", uid)
        .orderBy("timestamp")
        .limit(6)
        .get()
        .then((snapshot) => {
          setPosts(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              post: doc.data(),
            }))
          );
          setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
        });
    }
  }, []);

  return (
    <div className="dashboard__postsContainer">
      {posts &&
        posts.map(({ id, post }) => (
          <Post
            key={id}
            ownerUid={post.ownerUid}
            timestamp={post.timestamp}
            postKey={id}
            profilePic={post.userAvatarUrl}
            username={post.displayName}
            caption={post.caption}
            imageUrl={post.imageUrl}
            comments={post.comments}
          ></Post>
        ))}
      <div className="dashboard__loadButton">
        {lastVisible && (
          <Button variant="contained" color="primary" onClick={addPostsScroll}>
            Załaduj więcej
          </Button>
        )}
      </div>
    </div>
  );
}
