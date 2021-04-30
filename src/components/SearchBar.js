import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { useHistory } from "react-router-dom";
import "./Dashboard.css";
import SearchHints from "./SearchHints";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import OutsideClickHandler from "react-outside-click-handler";
export default function SearchBar({ isOpen }) {
  const [users, setUsers] = useState([]);
  const history = useHistory();
  const [clickedOutside, setClickedOutside] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    db.collection("users")
      .get()
      .then(
        (snapshot) => {
          setUsers(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              user: doc.data(),
            }))
          );
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  const dynamicChange = () => {
    if (users && searchTerm.trim() != "") {
      return users.filter((user) => user.user.username.includes(searchTerm));
    } else return false;
  };

  const handleChange = (e) => {
    setClickedOutside(true);
    setSearchTerm(e.target.value);
    dynamicChange();
    console.log(isOpen);
  };

  const enterPress = (e) => {
    if (e.keyCode == 13) {
      history.replace("/home/search/" + searchTerm);
    }
  };

  return (
    <OutsideClickHandler
      onOutsideClick={() => {
        setClickedOutside(false);
      }}
    >
      <div className="searchBar">
        <TextField
          type="text"
          id="outlined-adornment-amount"
          className="searchBar__input"
          variant="outlined"
          label="Wyszukaj"
          value={searchTerm}
          InputProps={{
            style: { fontSize: 20 },
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          onChange={handleChange}
          onKeyDown={enterPress}
        ></TextField>

        {dynamicChange() && clickedOutside && (
          <SearchHints
            names={dynamicChange()}
            searchTerm={searchTerm}
          ></SearchHints>
        )}
      </div>
    </OutsideClickHandler>
  );
}
