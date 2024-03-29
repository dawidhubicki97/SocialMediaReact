import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";
import logo from "../images/navlogo.png";
import Slide from "@material-ui/core/Slide";
import { useAuth } from "../contexts/AuthContext";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import MenuIcon from "@material-ui/icons/Menu";
import SearchBar from "./SearchBar";
import "./Dashboard.css";
export default function Navbar({ isOpen }) {
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  async function handleLogout() {
    setError("");
    try {
      await logout();
      history.pushState("/login");
    } catch {
      setError("Nie udało się wylogować");
    }
  }

  function handleProfileClick(e) {
    history.replace("/home/profile");
  }
  function handleAddPhotoClick(e) {
    history.replace("/home/addpost");
  }
  function handleLogoClick(e) {
    history.replace("/home");
  }
  function Transition(props) {
    return <Slide direction="left" {...props} />;
  }

  let menu;
  let menuMask;
  if (showMenu) {
    menu = (
      <Slide direction="right" in={showMenu} mountOnEnter unmountOnExit>
        <div className="dashboard__menuSlide">
          <div
            className="dashboard__headerLogo"
            style={{ borderBottom: "solid 1px lightgray" }}
          >
            <img className="dashboard__headerImage" src={logo} alt="" />
          </div>
          <div
            className="dashboard__menuSlideItem"
            onClick={handleProfileClick}
          >
            <PersonIcon></PersonIcon>Profil
          </div>
          <div
            className="dashboard__menuSlideItem"
            onClick={handleAddPhotoClick}
          >
            <AddCircleIcon></AddCircleIcon>Dodaj zdjęcie
          </div>
          <div className="dashboard__menuSlideItem" onClick={handleLogout}>
            <ExitToAppIcon></ExitToAppIcon>Wyloguj
          </div>
        </div>
      </Slide>
    );

    menuMask = (
      <div
        className="dashboard__menuSlideMask"
        onClick={() => setShowMenu(!showMenu)}
      ></div>
    );
  }

  return (
    <nav className="dashboard__header">
      <div className="dashboard__row">
        <div className="dashboard__headerLogo">
          <img
            onClick={handleLogoClick}
            className="dashboard__headerImage"
            src={logo}
            alt=""
          />
        </div>
        <div className="dashboard__searchbar">
          <SearchBar isOpen={isOpen}></SearchBar>
        </div>

        <div className="dashboard__userMenu">
          <Link to="/home/addpost">
            {" "}
            <AddCircleIcon
              style={{ fontSize: "42px", color: "black" }}
              className="dashboard__userMenuIcon"
            ></AddCircleIcon>
          </Link>
          <Link to="/home/profile">
            <PersonIcon
              className="dashboard__userMenuIcon"
              style={{ fontSize: "42px", color: "black" }}
            ></PersonIcon>
          </Link>
          <ExitToAppIcon
            onClick={handleLogout}
            className="dashboard__userMenuIcon"
            style={{ fontSize: "42px", color: "black" }}
          ></ExitToAppIcon>
        </div>
        <div className="dashboard__collapsedMenu">
          <MenuIcon
            onClick={() => setShowMenu(!showMenu)}
            className="dashboard__userMenuIcon"
            style={{ fontSize: "42px", color: "black" }}
          ></MenuIcon>
        </div>
      </div>
      {menuMask}

      {menu}
    </nav>
  );
}
