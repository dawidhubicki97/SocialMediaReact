import React, { useState } from "react";
import { Button, withWidth } from "@material-ui/core";
import { storage, db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";
import firebase from "firebase";
import TextField from "@material-ui/core/TextField";
import "./Dashboard.css";
import { useHistory } from "react-router-dom";
import { Image } from "react-bootstrap";
export default function ImageUpload() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [url, setUrl] = useState("");
  const { currentUser } = useAuth();
  const history = useHistory();
  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    const uploadTask = storage.ref(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        console.log(error);
      },
      () => {
        console.log(currentUser);
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("posts")
              .doc(currentUser.uid)
              .collection("userPosts")
              .add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                imageUrl: url,
                displayName: currentUser.displayName,
                userAvatarUrl: `users/${currentUser.uid}/avatar/active`,
                userUrl: db.collection("users").doc(currentUser.uid),
              })
              .then((docRef) =>
                db
                  .collection("allposts")
                  .doc(docRef.id)
                  .set({
                    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                    caption: caption,
                    imageUrl: url,
                    ownerUid: currentUser.uid,
                    displayName: currentUser.displayName,
                    userAvatarUrl: `users/${currentUser.uid}/avatar/active`,
                    userUrl: db.collection("users").doc(currentUser.uid),
                  })
                  .then(history.push("/home/profile"))
              );
          });
      }
    );
  };

  return (
    <div className="imageUpload">
      <div className="imageUpload__imageContainer">
        <label className="imageUpload__imageLabel" for="upload__file">
          {image ? (
            <Image
              className="imageUpload__temporaryImage"
              src={image ? URL.createObjectURL(image) : null}
            ></Image>
          ) : (
            <Image
              className="imageUpload__temporaryImage"
              src="https://icon-library.com/images/add-image-icon-png/add-image-icon-png-24.jpg"
            ></Image>
          )}
        </label>
      </div>

      <input
        id="upload__file"
        type="file"
        onChange={handleChange}
        style={{ display: "none" }}
      ></input>
      <div className="imageUpload__textField">
        <TextField
          type="text"
          size="medium"
          placeholder="dodaj podpis"
          InputProps={{
            style: {
              backgroundColor: "white",
              width: 400,
            },
          }}
          multiline={true}
          rows={2}
          onChange={(event) => setCaption(event.target.value)}
          variant="outlined"
        ></TextField>
      </div>
      <div className="imageUpload__uploadButton">
        <Button variant="contained" color="primary" onClick={handleUpload}>
          Upload
        </Button>
        <progress value={progress}></progress>
      </div>
    </div>
  );
}
