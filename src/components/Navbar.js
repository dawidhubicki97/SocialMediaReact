import React,{useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import PersonIcon from '@material-ui/icons/Person';
import logo from "../images/navlogo.png"
import {useAuth} from '../contexts/AuthContext'
import { Menu,MenuItem } from '@material-ui/core';
import SearchBar from './SearchBar'
import './Dashboard.css';
export default function Navbar({isOpen}) {
    const history=useHistory()
    const [error, setError] = useState("")
    const {currentUser,logout} = useAuth()
    async function handleLogout(){
        setError("")
        try{
            await logout()
            history.pushState('/login');
        }catch{
            setError("Nie udało się wylogować")
        }
    }
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        <a
          href=""
          ref={ref}
          onClick={e => {
            e.preventDefault();
            onClick(e);
          }}
        >
         <PersonIcon style={{ fontSize: 80 }}/>

          {children}
        </a>
      ));






    return (

        <nav className="dashboard__header">
            <div className="dashboard__row">
           
          
        <div className="dashboard__headerLogo">
        <img className="dashboard__headerImage" src={logo}/>        
        </div>
        <div className="dashboard__searchbar">
            <SearchBar isOpen={isOpen}></SearchBar>
        </div>
        <div className="dashboard__userMenu ">
       
        <div className="dropdown">
        <PersonIcon class="dropbtn">Dropdown</PersonIcon>

        <div class="dropdown-content">
 <Link to='/home/profile'>Profil</Link>
 <Link to='/home/addpost'>Dodaj Post</Link>
 <Link onClick={handleLogout}>Wyloguj</Link>

</div>
</div>
       </div>
        </div>
        
        </nav>
    )
}
