import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import 'firebase/storage';
import { getStorage } from "firebase/storage";


const firebaseApp={
    apiKey: "AIzaSyBai6aZTmzYKIyIEZOmbmWGDj3EJmV5mHo",
    authDomain: "contributionmechanism.firebaseapp.com",
    projectId: "contributionmechanism",
    storageBucket: "contributionmechanism.appspot.com",
    messagingSenderId: "257066979171",
    appId: "1:257066979171:web:807dfc57c0069ce3eccd56"
  
};

const app =initializeApp(firebaseApp);
const db = getFirestore();
const auth = getAuth(app);
const storage=getStorage();

export { db, auth }


