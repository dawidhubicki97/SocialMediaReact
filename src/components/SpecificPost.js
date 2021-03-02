import React, { useRef, useState, useEffect } from "react";
import ReactDom from "react-dom";
import "./Post.css";
import { useHistory } from "react-router-dom";
import CloseIcon from "@material-ui/icons/Close";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase/app";
import { db } from "../firebase";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import { Button } from "@material-ui/core";
import { useAuth } from "../contexts/AuthContext";

export default function SpecificPost({ showModal, openModal, postKey, post }) {
  const [comments, setComments] = useState(null);
  const commentRef = useRef();
  const history = useHistory();
  const [isLiked, setIsLiked] = useState(false);
  const { currentUser } = useAuth();

  const OVERLAY_STYLES = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, .7)",
    zIndex: 1000,
  };
  function handleSubmit(e) {
    e.preventDefault();
    db.collection("allposts").doc(postKey).collection("comments").add({
      commentText: commentRef.current.value,
      commentUsername: currentUser.displayName,
      commentUserUid: currentUser.uid,
    });
    commentRef.current.value = "";
  }

  useEffect(() => {
    db.collection("allposts")
      .doc(postKey)
      .collection("comments")
      .onSnapshot((snapshot) => {
        setComments(snapshot.docs.map((doc) => doc.data()));
      });
  }, []);
  useEffect(() => {
    db.collection("allposts")
      .doc(postKey)
      .collection("likes")
      .doc(currentUser.uid)
      .onSnapshot((snapshot) => {
        console.log(snapshot.exists);
        if (snapshot.exists) setIsLiked(true);
        else setIsLiked(false);
      });
  }, []);

  const clickHandler = (e) => (uid) => {
    history.replace("/home/u/" + uid);
  };

  function likeButtonHandler(e) {
    if (isLiked) {
      const decrement = firebase.firestore.FieldValue.increment(-1);
      db.collection("allposts")
        .doc(postKey)
        .collection("likes")
        .doc(currentUser.uid)
        .delete();
      db.collection("allposts").doc(postKey).update({ likesNumber: decrement });
    } else {
      const increment = firebase.firestore.FieldValue.increment(1);
      db.collection("allposts")
        .doc(postKey)
        .collection("likes")
        .doc(currentUser.uid)
        .set({ uid: currentUser.uid });
      db.collection("allposts").doc(postKey).update({ likesNumber: increment });
    }
  }

  if (!showModal) return null;

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />

      <div className="postDetails__container">
        <CloseIcon
          className="postDetails__closeButton"
          onClick={openModal}
        ></CloseIcon>
        <div className="postDetails">
          {post && (
            <>
              <img className="postDetails__img" src={post.imageUrl}></img>
              <div className="postDetails__imageContent">
                <div className="postDetails__userInfo">
                  <Avatar
                    className="postDetails__avatar"
                    src={post.profilePic}
                  ></Avatar>
                  <h3>{post.username}</h3>
                </div>
                <div className="postDetails__content">
                  <div className="postDetails__date">
                    <AccessTimeIcon style={{ fontSize: 18 }}></AccessTimeIcon>
                    {new Date(
                      post.timestamp.seconds * 1000
                    ).toLocaleString("pl-PL", { timeZone: "UTC" })}
                  </div>
                  <div className="postDetails__thumbUp">
                    {isLiked ? (
                      <div>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={likeButtonHandler}
                        >
                          <ThumbUpIcon></ThumbUpIcon>Lubię to
                        </Button>
                        <div className="postDetails__likesCounter">
                          {post.likesNumber}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={likeButtonHandler}
                        >
                          <ThumbUpIcon></ThumbUpIcon>Lubię to
                        </Button>
                        <div className="postDetails__likesCounter">
                          {post.likesNumber}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="postDetails__caption">{post.caption}</div>

                  <div className="postDetails__commentForm">
                    <form onSubmit={handleSubmit}>
                      <div id="comment">
                        <input
                          className="postDetails__formInput"
                          type="text"
                          ref={commentRef}
                          required
                        />
                      </div>
                    </form>
                  </div>
                </div>
                <div className="postDetails__comments">
                  {comments &&
                    comments.map((comment) => (
                      <div className="postDetails__comment">
                        {" "}
                        <b
                          onClick={(e) =>
                            clickHandler(e)(comment.commentUserUid)
                          }
                          style={{
                            cursor: "pointer",
                          }}
                        >
                          {comment.commentUsername}:{" "}
                        </b>
                        {comment.commentText}
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>,
    document.getElementById("portal")
  );
}
