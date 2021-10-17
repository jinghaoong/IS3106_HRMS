import {initializeApp} from "firebase/app";
import {getFirestore} from "@firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBDDcRjD-n8GARKy7Kz04UMPyJ_2DMW3lY",
    authDomain: "customhrms.firebaseapp.com",
    projectId: "customhrms",
    storageBucket: "customhrms.appspot.com",
    messagingSenderId: "454637246867",
    appId: "1:454637246867:web:7d3d4402869f5a20ac3066",
    measurementId: "G-KV472W0W56"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app); 