// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLiXyNqa3vY_iGKQjsGvDEOXch6XBUrlM",
  authDomain: "snapbid-75d17.firebaseapp.com",
  projectId: "snapbid-75d17",
  storageBucket: "snapbid-75d17.appspot.com",
  messagingSenderId: "305602042466",
  appId: "1:305602042466:web:84644e4983ec6f95330f3b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export default storage;
