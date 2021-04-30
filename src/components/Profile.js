import React, { useState, useEffect, useRef } from "react";
import "./Profile.css";
import { useAuth } from "../contexts/AuthContext";
import EditIcon from "@material-ui/icons/Edit";
import Avatar from "@material-ui/core/Avatar";
import { storage, db } from "../firebase";
import Gallery from "./Gallery";
import ReadMore from "./ReadMore";
export default function Profile() {
  const { currentUser, logout } = useAuth();
  const hiddenFileInput = React.useRef(null);
  const [progress, setProgress] = useState(0);
  const [profile, setProfile] = useState(null);
  const [image, setImage] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [bioClicked, setBioClicked] = useState(false);
  const bioRef = useRef(null);

  const passFromPicToUpload = (e) => {
    hiddenFileInput.current.click();
  };
  const handleProfilePicUpload = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    const handleClickOutsideDialog = (event: any) => {
      if (!bioRef.current.contains(event.target)) {
        setBioClicked(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideDialog);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDialog);
    };
  }, []);

  const clickBio = (e) => {
    setBioClicked(!bioClicked);
  };

  const onChangeHandler = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    if (image) {
      const uploadTask = storage
        .ref(`users/${currentUser.uid}/avatar/active`)
        .put(image);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          console.log("profil");
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref(`users/${currentUser.uid}/avatar/active`)
            .getDownloadURL()
            .then((url) => {
              db.collection("users")
                .doc(currentUser.uid)
                .update({ avatarUrl: url })
                .then(setProfile(null));

              loadProfile();
            });
        }
      );
    }
  }, [image, currentUser]);
  const onEnterPress = (e) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      setBioClicked(false);
      db.collection("users")
        .doc(currentUser.uid)
        .update({
          bio: inputValue,
        })
        .then(loadProfile());
    }
  };
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = () => {
    db.collection("users")
      .doc(currentUser.uid)
      .get()
      .then((snapshot) => {
        setProfile(snapshot.data());
        setInputValue(snapshot.data().bio);
      });
  };

  return (
    <div className="profile">
      {profile && (
        <div className="profile__container">
          <div className="profile__header">
            <div className="profile__imageContainer">
              <label htmlFor="actual-btn">
                {profile.avatarUrl ? (
                  <Avatar
                    src={profile.avatarUrl}
                    className="profile__image "
                  ></Avatar>
                ) : (
                  <Avatar
                    src="https://i.stack.imgur.com/l60Hf.png"
                    className="profile__image"
                  />
                )}
              </label>
            </div>
            <input
              id="actual-btn"
              type="file"
              ref={hiddenFileInput}
              onChange={handleProfilePicUpload}
              style={{ display: "none" }}
            />
            <div className="profile__userInfo">
              <div className="profile__headerUserName">{profile.username}</div>
              <div className="profile__followers">
                Obserwuje: <b>{profile.followed}</b>
              </div>
              <div className="profile__following">
                Obserwowani: <b>{profile.following}</b>
              </div>
            </div>
            {bioClicked ? (
              <div className="profile__bio">
                <textarea
                  ref={bioRef}
                  onChange={onChangeHandler}
                  value={inputValue}
                  onKeyDown={onEnterPress}
                ></textarea>
              </div>
            ) : (
              <>
                <div className="profile__bio" ref={bioRef}>
                  <EditIcon className="editable" onClick={clickBio}></EditIcon>
                  <ReadMore>{profile.bio}</ReadMore>
                </div>
              </>
            )}
          </div>
          <div className="profile__posts">
            <Gallery uid={currentUser.uid} owner={true}></Gallery>
          </div>
        </div>
      )}
    </div>
  );
}
