import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCS18tlL9kD6E5spAhjjkLbrNIEYPObVok",
  authDomain: "black-jack-trainer-327600.firebaseapp.com",
  projectId: "black-jack-trainer-327600",
  storageBucket: "black-jack-trainer-327600.appspot.com",
  messagingSenderId: "102960755452",
  appId: "1:102960755452:web:bea1f23f621a222011dd79",
  measurementId: "G-9GV5ZYP0CQ"
};

// Initialize Firebase
const fire = initializeApp(firebaseConfig);

export default fire; 