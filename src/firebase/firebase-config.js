import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore';
import {collection, getDocs, addDoc, doc,setDoc} from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
};

export const defaultExpName = "debug"

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//setting path
export const settingPath = "settings"
export const fb = getFirestore(app)

// const usersCollectionRef = collection(db,"users")
export const addUser = async (user) => {
    return await setDoc(doc(fb, "users",  user.ID),user,{merge:true})
}

export const addDebrief = async (ID,values) => {
    return await setDoc(doc(fb, "users",  ID),values,{merge:true})
}

export const addRecord = async (id, seq, record,expName=defaultExpName) => {
    const path = `${expName}/${id}`
    return await setDoc(doc(fb, path),record,{merge:true})
}
