import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCaD-oRZVmNm2SUjIlftCA0j9hyIJf35uA",
  authDomain: "ericdeals-eda47.firebaseapp.com",
  projectId: "ericdeals-eda47",
  storageBucket: "ericdeals-eda47.firebasestorage.app",
  messagingSenderId: "1028009026497",
  appId: "1:1028009026497:web:d74458c28daecb9c9e4540",
  measurementId: "G-BSEJYZLNWX"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
