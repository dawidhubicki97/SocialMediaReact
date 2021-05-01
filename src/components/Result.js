import React, { useState, useEffect } from "react";
import { storage } from "../firebase";
import "./Dashboard.css";
import Avatar from "@material-ui/core/Avatar";
import defaulAvatar from "../images/defaultuser.png";
export default function Result({ user }) {
  const [profilePic, setprofilePic] = useState(null);

  {
    return (
      <div className="searchResults__card">
        <div className="searchResults__cardBod">
          <Avatar
            src={user.avatarUrl}
            className="searchResults__avatar"
          ></Avatar>
          <div className="searchResults__username">{user.username}</div>
          <div className="searchResults__bio">{user.bio}</div>
        </div>
      </div>
    );
  }
}
