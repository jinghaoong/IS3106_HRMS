import { getFirestore } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/*
const firebaseConfig = {
  apiKey: 'AIzaSyBDDcRjD-n8GARKy7Kz04UMPyJ_2DMW3lY',
  authDomain: 'customhrms.firebaseapp.com',
  projectId: 'customhrms',
  storageBucket: 'customhrms.appspot.com',
  messagingSenderId: '454637246867',
  appId: '1:454637246867:web:7d3d4402869f5a20ac3066',
  measurementId: 'G-KV472W0W56'
};
*/
const firebaseConfig = {
  apiKey: 'AIzaSyB6abd7DBDUu1XQq_vpY9qBhdL0IXqTO2k',
  authDomain: 'customhrms-e80cc.firebaseapp.com',
  projectId: 'customhrms-e80cc',
  storageBucket: 'customhrms-e80cc.appspot.com',
  messagingSenderId: '801539070960',
  appId: '1:801539070960:web:478a707e2dc30066ce5b35',
  measurementId: 'G-W6ZKRVHDVP'
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);
