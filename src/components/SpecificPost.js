import React,{useRef,useState,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import ReactDom from 'react-dom'
import './Post.css'
import CloseIcon from '@material-ui/icons/Close';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import { useSpring, animated } from 'react-spring'
import Avatar from "@material-ui/core/Avatar"
import {db} from '../firebase'
import {useAuth} from '../contexts/AuthContext'
import { Hidden } from '@material-ui/core';
export default function SpecificPost({showModal,openModal,postKey,post}) {
  const [comments, setComments] = useState(null)
  const commentRef=useRef()
 
  const {currentUser,logout} = useAuth();
    const MODAL_STYLES = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        maxHeight: '700px',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#FFF',
        padding: '20px',
        zIndex: 1000,
      }
      
      const OVERLAY_STYLES = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,   
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, .7)',
        zIndex: 1000
      }
      const animation = useSpring({
        config: {
          duration: 250
        },
        opacity: showModal ? 1 : 0,
        transform: showModal ? `translateY(0%)` : `translateY(-100%)`
      });
    function handleSubmit(e){
        e.preventDefault()
        db.collection("allposts").doc(postKey).collection("comments").add({commentText:commentRef.current.value,commentUsername:currentUser.displayName,commentUserUid:currentUser.uid})     
        commentRef.current.value=""
      }

    useEffect(() => {
      db.collection("allposts").doc(postKey).collection("comments").onSnapshot(snapshot =>
      {
        setComments(snapshot.docs.map(doc => doc.data()))
      }
        )
        
    }, [])



  if (!showModal) return null

  return ReactDom.createPortal(
    <>
      <div style={OVERLAY_STYLES} />
      
      <div className="postDetails__container" style={MODAL_STYLES}>
      <CloseIcon className="postDetails__closeButton" onClick={openModal}></CloseIcon>
        <div className="postDetails" >
            
            {post && 
            
           <div>
            <img className="postDetails__img" src={post.imageUrl}></img>
            <div className="postDetails__imageContent">
            <div className="postDetails__userInfo">
                
                <Avatar className="postDetails__avatar" src={post.profilePic}></Avatar>
        <h3 >{post.username}</h3>
            </div>
            <div className="postDetails__content">
            <div className="postDetails__date" >
              <AccessTimeIcon style={{ fontSize: 18 }}></AccessTimeIcon>
            {new Date(post.timestamp.seconds * 1000).toLocaleString("pl-PL", { timeZone: 'UTC' })}
            </div> 
            <div className="postDetails__caption">
            <p>{post.caption}</p>
            </div> 

            <div className="postDetails__commentForm">
            <form onSubmit={handleSubmit}>
                    <div id="comment">
                        <input className="postDetails__formInput" type="text" ref={commentRef} required />
                    </div>
            </form>
              </div>
            </div>
            <div className="postDetails__comments">
                {comments && comments.map((comment) =>(
              <div> <b>{comment.commentUsername}: </b>{comment.commentText}</div>                
            )
              )}
            </div>
            </div>
            </div>
            
                  
        }
        </div>
      </div>
    </>,
    document.getElementById('portal')
        
    )
}
