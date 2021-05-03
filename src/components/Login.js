import React, { useRef, useState } from "react";
import { Button } from "@material-ui/core";
import background from "../images/8741.jpg";
import backgroundsmall from "../images/8741_tiny.jpg";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import ProgressiveImage from "react-progressive-image-loading";

import "./Login.css";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      history.push("/");
    } catch {
      setError("Nie udało się zalogować");
    }
    setLoading(false);
  }

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__cardBody">
          <h2 className="text-center">Zaloguj się</h2>
          {error && <div className="login__alert">{error}</div>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login__formGroup" id="email">
            <label>Email</label>
            <input
              placeholder="Email"
              className="login__inputText"
              type="email"
              ref={emailRef}
              required
            />
          </div>
          <div className="login__formGroup" id="password">
            <label>Hasło</label>
            <input
              placeholder="Hasło"
              className="login__inputText"
              type="password"
              ref={passwordRef}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            color="primary"
            className="w-100"
          >
            Zaloguj się
          </Button>
        </form>
        <div className="login__textUnder">
          Nie masz konta?<br></br>
          <Link to="/signup">
            <b>Zarejestruj się</b>
          </Link>
        </div>
      </div>

      <div className="login__rightContainer">
        <ProgressiveImage
          src={background}
          preview={backgroundsmall}
          alt="background"
          render={(src, style) => <img src={src} style={style} />}
        />
      </div>
    </div>
  );
}
