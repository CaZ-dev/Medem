import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyBIll4p_kOojb7SF6CQZ9A62feMBUQWgHc",
    authDomain: "medemapp4.firebaseapp.com",
    databaseURL: "https://medemapp4-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "medemapp4",
    storageBucket: "medemapp4.appspot.com",
    messagingSenderId: "704365856898",
    appId: "1:704365856898:web:2a8c866974c3b78ac70c9b",
    measurementId: "G-EF4GLQW06W",
    storageBucket: 'gs://medemapp4.appspot.com'
  };

const firebaseApp = initializeApp(firebaseConfig);
const firebaseAuth = getAuth(firebaseApp);
const firebaseDB = getFirestore(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);

export { firebaseAuth, firebaseDB , firebaseStorage};

