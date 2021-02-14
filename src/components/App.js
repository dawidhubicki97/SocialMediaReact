
import '../App.css';
import SignUp from './SignUp';
import {Container} from "react-bootstrap"
import {AuthProvider} from "../contexts/AuthContext"
import Dashboard from "./Dashboard"
import Profile from "./Profile"
import Login from "./Login"
import { withRouter } from "react-router";
import PrivateRoute from "./PrivateRoute"
import {BrowserRouter as Router, Switch,Route,Redirect} from 'react-router-dom'
function App() {
  return (   
    <div className='app__container'>
     <Router>
        <AuthProvider>
         <Switch> 
          <Route exact path="/" render={() => (<Redirect to="/home" />)} ></Route>   
            <PrivateRoute path="/home" component={withRouter(Dashboard)}></PrivateRoute>
            
            <Container className='d-flex alig-items-center justify-content-center'>
                <div className="w-100" style={{ maxWidth: '400px'}}>
                  <Route exact path="/signup" component={SignUp}></Route>
                 <Route exact path="/login" component={Login}></Route>
                </div>
            </Container>
          </Switch>
        </AuthProvider>
       </Router>            
    </div>
    
  );
}

export default App;
