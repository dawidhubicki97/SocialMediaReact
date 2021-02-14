import firebase from "firebase/app"
import "firebase"

const app = firebase.initializeApp({
    apiKey: "AIzaSyAcI8b1w-os4WkEqfKrEp7EUmfyGV3ICXA",
    authDomain: "socialmediaapp-c8bf5.firebaseapp.com",
    projectId: "socialmediaapp-c8bf5",
    storageBucket: "socialmediaapp-c8bf5.appspot.com",
    messagingSenderId: "902329988031",
    appId: "1:902329988031:web:dd6ecdca4fa61541dca70a"
})

export const auth = app.auth();
export const db = app.firestore();
export const storage = app.storage();
export default app