import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"



const firebaseConfig = {
  apiKey: "AIzaSyB55cNCVlXLi42CMegRLloTM9Yy5CRZTYY",
  authDomain: "pudhuyugam-7fb6c.firebaseapp.com",
  projectId: "pudhuyugam-7fb6c",
  storageBucket: "pudhuyugam-7fb6c.appspot.com",
  messagingSenderId: "424669739291",
  appId: "1:424669739291:web:87c81cc19c9cd4cfa53bbe"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)


