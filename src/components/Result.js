import React from "react";
import { storage } from "../firebase";
import "./Dashboard.css";
import { useHistory } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import defaulAvatar from "../images/defaultuser.png";
export default function Result({ resultKey, user }) {
  const history = useHistory();
  const profileRedirect = (e) => {
    history.replace("/home/u/" + resultKey);
  };
  {
    return (
      <div className="searchResults__card" onClick={profileRedirect}>
        <div className="searchResults__cardBod">
          {user.avatarUrl ? (
            <Avatar
              style={{ height: "80px", width: "80px" }}
              src={user.avatarUrl}
              className="searchResults__avatar"
            ></Avatar>
          ) : (
            <Avatar
              src={defaulAvatar}
              className="searchResults__avatar"
            ></Avatar>
          )}
          <div className="searchResults__username">{user.username}</div>

          <div className="searchResults__bio">{user.bio}</div>
        </div>
      </div>
    );
  }
}
