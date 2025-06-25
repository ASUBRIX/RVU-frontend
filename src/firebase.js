import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"



const firebaseConfig = {
  apiKey: "AIzaSyDusKxKQ3b9GgrbUW8tbE8qxwoBY5vjpAk",
  authDomain: "royal-victorian-universi-fd4b0.firebaseapp.com",
  projectId: "royal-victorian-universi-fd4b0",
  storageBucket: "royal-victorian-universi-fd4b0.firebasestorage.app",
  messagingSenderId: "744287874838",
  appId: "1:744287874838:web:82385c65cef9def8262a37"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)


