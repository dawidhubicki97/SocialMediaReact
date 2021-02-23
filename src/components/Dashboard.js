import React, { useState, useEffect } from "react";
import { Card, Button, Alert, Container } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import Post from "./Post";
import { AuthProvider } from "../contexts/AuthContext";
import Profile from "./Profile";
import BrowseProfile from "./BrowseProfile";
import Navbar from "./Navbar";
import { db } from "../firebase";
import SignUp from "./SignUp";
import ImageUpload from "./ImageUpload";
import "./Dashboard.css";
import PrivateRoute from "./PrivateRoute";
import { Link, useHistory } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Gallery from "./Gallery";
import { withRouter } from "react-router";
import SpecificPost from "./SpecificPost";
export default function Dashboard() {
  const { currentUser, logout } = useAuth();
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
      {/*<PrivateRoute path="/home/post/:photoId" component={SpecificPost}></PrivateRoute>*/}

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
