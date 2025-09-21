// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage'; //



const firebaseConfig = {
  apiKey: "AIzaSyCALHGV0B654PWERNdK-t_qEatt9mG5uyU",
  authDomain: "nails-54237.firebaseapp.com",
  projectId: "nails-54237",
   storageBucket: "nails-54237.firebasestorage.app",
//  storageBucket: "nails-54237.appspot.com",
  messagingSenderId: "760255383616",
  appId: "1:760255383616:web:22e8abfcbcaac7995377a5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Si vas a usar otros servicios de Firebase, los inicializas aquí también
const db = getFirestore(app);  // Para acceder a Firestore
const auth = getAuth(app);  // Para acceder a la autenticación
const storage = getStorage(app); // para la imagen


export  {app,db,auth, storage}