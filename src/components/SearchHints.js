import React from 'react'
import './Dashboard.css';
import {useHistory} from 'react-router-dom'
export default function SearchHints(names) {
    const history=useHistory()
    const clickHandler = e => uid => {
        
        history.replace('/home/u/'+uid)
    }



    return (
        <div className="searchBar__hintBox">
            {
                            
                names && names.names.slice(0,3).map(name=> <div className="searchBar__hint" onClick={(e) => clickHandler(e)(name.id)}>{name.user.username}</div>)
            }
        </div>
    )
}
