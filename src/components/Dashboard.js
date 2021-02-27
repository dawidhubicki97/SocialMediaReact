import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Profile from "./Profile";
import BrowseProfile from "./BrowseProfile";
import Navbar from "./Navbar";
import ImageUpload from "./ImageUpload";
import "./Dashboard.css";
import PrivateRoute from "./PrivateRoute";
import { useHistory } from "react-router-dom";
import Gallery from "./Gallery";
import { withRouter } from "react-router";
export default function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    document.addEventListener("click", () => {
      setIsOpen(false);
    });
  }, []);
  const history = useHistory();
  return (
    <div className="dashboard">
      <Navbar isOpen={isOpen}></Navbar>
      <PrivateRoute
        path="/home/profile"
        component={withRouter(Profile)}
      ></PrivateRoute>
      <PrivateRoute
        path="/home/u/:uid"
        component={withRouter(BrowseProfile)}
      ></PrivateRoute>
      <PrivateRoute
        exact
        path="/home"
        component={withRouter(Gallery)}
      ></PrivateRoute>
      <PrivateRoute
        path="/home/addpost"
        component={withRouter(ImageUpload)}
      ></PrivateRoute>
    </div>
  );
}
