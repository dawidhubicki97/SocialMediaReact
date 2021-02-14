import React,{useState,useEffect} from 'react'
import {db} from '../firebase'
import classNames from 'classnames'
import './Dashboard.css'
import SearchHints from './SearchHints'
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField"
import OutsideClickHandler from 'react-outside-click-handler';
export default function SearchBar({isOpen}) {
    const [users, setUsers] = useState([])
    const [clickedOutside, setClickedOutside] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    useEffect(() => {
        db.collection('users').get().then(
            snapshot =>
            setUsers(snapshot.docs.map(doc=>({
                id:doc.id,
                user:doc.data()
             }
              )))
        )
    }, [])

    const dynamicChange = () =>{
        if(users && searchTerm.trim() != ""){
        return users.filter(user=>user.user.username.includes(searchTerm))
        }
        else
        return false
    }

    const handleChange = (e) =>{
        setClickedOutside(true)
        setSearchTerm(e.target.value)
        dynamicChange()
        console.log(isOpen)
    }
    
    return (
        <OutsideClickHandler onOutsideClick={() => {
            setClickedOutside(false)
           }}>
        <div className="searchBar">
      
           <TextField type="text"  id="outlined-adornment-amount" className="searchBar__input"
          variant="outlined"
          label="Wyszukaj"
          value={searchTerm}
          InputProps={{style: { fontSize: 20 } ,
            startAdornment: <InputAdornment position="start"><SearchIcon/></InputAdornment>,
          }} onChange={handleChange}></TextField>
        
           {dynamicChange()&&clickedOutside&&<SearchHints names={dynamicChange()} searchTerm={searchTerm}></SearchHints>}
         
        </div>
        </OutsideClickHandler>
    )
}
