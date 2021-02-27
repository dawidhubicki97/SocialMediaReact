import React, { useState, useEffect } from "react";
import "./Post.css";
import { storage, db } from "../firebase";
import Avatar from "@material-ui/core/Avatar";
import SpecificPost from "./SpecificPost";
import DeleteIcon from "@material-ui/icons/Delete";
export default function Post({
  postKey,
  ownerUid,
  caption,
  imageUrl,
  username,
  profilePic,
  comments,
  timestamp,
  likesNumber,
  owner,
}) {
  const [profilePicUrl, setprofilePicUrl] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [post, setPost] = useState(null);

  const openModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    if (showModal) {
      document.getElementById("root").style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.getElementById("root").style.overflow = "visible";
      document.body.style.overflow = "visible";
    }
  }, [showModal]);

  useEffect(() => {
    console.log(likesNumber);
    storage
      .ref(profilePic)
      .getDownloadURL()
      .then((url) => {
        setprofilePicUrl(url);
        setPost({
          postKey: postKey,
          ownerUid: ownerUid,
          caption: caption,
          profilePic: url,
          username: username,
          imageUrl: imageUrl,
          comments: comments,
          timestamp: timestamp,
          likesNumber: likesNumber,
        });
      });
  }, []);

  const handleProfileClick = (e) => {
    console.log(ownerUid);
  };
  const handleDeleteClick = (e) => {
    db.collection("allposts").doc(postKey).delete();
  };

  return (
    <div className="post">
      <div className="post__card">
        {owner && (
          <div className="post__deleteButton" onClick={handleDeleteClick}>
            <DeleteIcon></DeleteIcon>
          </div>
        )}
        <div className="post__cardBody">
          <img className="post__img" src={imageUrl} onClick={openModal}></img>
          <SpecificPost
            showModal={showModal}
            openModal={openModal}
            postKey={postKey}
            post={post}
          ></SpecificPost>
          <div className="post__header">
            <Avatar className="post__avatar" src={profilePicUrl}></Avatar>
            <div className="post__username" onClick={handleProfileClick}>
              {username}
            </div>
          </div>
          <div className="post__description">{caption}</div>
        </div>
      </div>
    </div>
  );
}
