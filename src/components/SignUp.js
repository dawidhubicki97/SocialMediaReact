import React, { useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import background from "../images/8741.jpg";
import { Button } from "@material-ui/core";
export default function SignUp() {
  const emailRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError("Hasla sie rożnią");
    }
    if (usernameRef.current.length > 19) {
      return setError("Nazwa użytkownka jest zbyt długa");
    }
    try {
      setError("");
      setLoading(true);
      await signup(
        emailRef.current.value,
        passwordRef.current.value,
        usernameRef.current.value
      );
      history.push("/");
    } catch {
      setError("Nie udało się stworzyć konta");
    }
    setLoading(false);
  }

  return (
    <div className="login">
      <div className="login__card">
        <div className="login__cardBody">
          <h2 className="text-center mb-4">Zarejestruj się</h2>
          {error && <div className="login__alert">{error}</div>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="login__formGroup" id="username">
            <label>Nazwa użytkownika</label>
            <input
              className="login__inputText"
              type="username"
              ref={usernameRef}
              required
            />
          </div>
          <div className="login__formGroup" id="email">
            <label>Email</label>
            <input
              className="login__inputText"
              type="email"
              ref={emailRef}
              required
            />
          </div>
          <div className="login__formGroup" id="password">
            <label>Hasło</label>
            <input
              className="login__inputText"
              type="password"
              ref={passwordRef}
              required
            />
          </div>
          <div className="login__formGroup" id="password-confirm">
            <label>Powtórz hasło</label>
            <input
              className="login__inputText"
              type="password"
              ref={passwordConfirmRef}
              required
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            className="w-100"
          >
            Zarejestruj się
          </Button>
        </form>
        <div className="login__textUnder">
          Masz już konto?<br></br>
          <Link to="/login">Zaloguj się</Link>
        </div>
      </div>
      <div className="login__rightContainer">
        <img alt="" src={background}></img>
      </div>
    </div>
  );
}
