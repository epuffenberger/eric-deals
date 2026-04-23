import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCaD-oRZVmNm2SUjIlftCA0j9hyIJf35uA",
  authDomain: "ericdeals-eda47.firebaseapp.com",
  projectId: "ericdeals-eda47",
  storageBucket: "ericdeals-eda47.firebasestorage.app",
  messagingSenderId: "1028009026497",
  appId: "1:1028009026497:web:d74458c28daecb9c9e4540"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
