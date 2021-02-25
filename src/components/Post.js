import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import "./Post.css";
import { storage } from "../firebase";
import Avatar from "@material-ui/core/Avatar";
import SpecificPost from "./SpecificPost";
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
}) {
  const [profilePicUrl, setprofilePicUrl] = useState("");
  const history = useHistory();
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

  return (
    <div className="post">
      <div className="post__card">
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
