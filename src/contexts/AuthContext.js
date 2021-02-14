import React, { useContext,useState,useEffect } from 'react'
import {auth, db} from '../firebase'
const AuthContext = React.createContext()

export function useAuth(){
    return useContext(AuthContext)
}


export function AuthProvider({children}) {
    const [currentUser,setCurrentUser]= useState()
    const [loading, setLoading] = useState(true)

    function login(email,password){
        return auth.signInWithEmailAndPassword(email,password)
    }

    function signup(email,password,username){
        return auth.createUserWithEmailAndPassword(email,password).then(
            cred =>{
                db.collection("users").doc(cred.user.uid).set({
                    username:username,
                    following:0,
                    followed:0
                }
                )
                cred.user.displayName=username
            }
        )
    }
    
    function logout(){
        return auth.signOut()
    }

    useEffect(()=>{
        const unsubscribe = auth.onAuthStateChanged(user =>{
            setCurrentUser(user)
            setLoading(false)
        })
            return unsubscribe
    },[])

    const value ={
        currentUser,
        signup,
        login,
        logout,
    }

    auth.onAuthStateChanged(user =>{
        setCurrentUser(user)
    })

    return (
       <AuthContext.Provider value={value}>
           {!loading&&children}
        </AuthContext.Provider>
    )
}
