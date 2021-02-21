import React,{useState,useEffect} from 'react'
import './Profile.css';
import {useAuth} from '../contexts/AuthContext'
import Avatar from "@material-ui/core/Avatar"
import {Card,Button,Alert, Container,Image} from 'react-bootstrap'
import ImageUpload from './ImageUpload';
import {storage,db} from '../firebase'
import {Link,useHistory} from 'react-router-dom'
import Gallery from './Gallery'
import Post from './Post';
export default function Profile() {
    const {currentUser,logout} = useAuth()
    const hiddenFileInput = React.useRef(null)
    const [profilePicUrl, setProfilePicUrl] = useState(null)
    const [progress, setProgress] = useState(0)
    const [profile, setProfile] = useState(null)
    const [image, setImage] = useState(null)
    const passFromPicToUpload = (e) =>{
        hiddenFileInput.current.click();
        console.log("one")
    }
    const handleProfilePicUpload = (e) =>{
        console.log("two")

        if(e.target.files[0]){
            setImage(e.target.files[0]);
            
        }
    }

    useEffect(() => {
        if(image){
        const uploadTask = storage.ref(`users/${currentUser.uid}/avatar/active`).put(image);
             uploadTask.on(
            "state_changed",
            (snapshot)=>{
                const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
                setProgress(progress);
            },
            (error)=>{
                console.log(error)
            },
            ()=>{
                storage.ref(`users/${currentUser.uid}/avatar/active`).getDownloadURL().then(url =>{
                    db.collection('users').doc(currentUser.uid).update({avatarUrl:url})
                })

            }
        )
        }
    }, [image,currentUser])


    useEffect(() => {
        db.collection('users').doc(currentUser.uid).get().then(
            snapshot=>setProfile(snapshot.data())
        )
    }, [])

  



    return (
    <div className="profile">
        {profile &&
       <div className="profile__container">
      
                    <div className="profile__header">
                    <div className="imageContainer" >
               
                    <label for="actual-btn">
                    {
                        
                        profile.avatarUrl?<Avatar src={profile.avatarUrl} className="profile__image "></Avatar>:<Avatar src="https://i.stack.imgur.com/l60Hf.png" className="profile__image" /> 
                     }
                     </label>

                      </div>   
                     <input id="actual-btn" type="file" ref={hiddenFileInput} onChange={handleProfilePicUpload} style={{display:'none'}} /> 
                    <div className="profile__headerUserName">{profile.username}</div>
                    <div className="profile__followers">Obserwuje: <b>{profile.followed}</b></div>
                    <div className="profile__following">Obserwowani: <b>{profile.following}</b></div>
                    <div className="profile__bio">{profile.bio}</div>
                 
                     </div>
                     <div className="profile__posts">
                        <Gallery uid={currentUser.uid}></Gallery>
                     </div>                 
       </div>
       }
    </div>
    )
}