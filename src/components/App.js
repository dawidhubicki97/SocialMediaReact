import "../App.css";
import SignUp from "./SignUp";
import { AuthProvider } from "../contexts/AuthContext";
import Dashboard from "./Dashboard";
import Login from "./Login";
import { withRouter } from "react-router";
import PrivateRoute from "./PrivateRoute";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
function App() {
  return (
    <div className="app__container">
      <Router>
        <AuthProvider>
          <Switch>
            <Route
              exact
              path="/"
              render={() => <Redirect to="/home" />}
            ></Route>
            <PrivateRoute
              path="/home"
              component={withRouter(Dashboard)}
            ></PrivateRoute>

            <div>
              <Route exact path="/signup" component={SignUp}></Route>
              <Route exact path="/login" component={Login}></Route>
            </div>
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
