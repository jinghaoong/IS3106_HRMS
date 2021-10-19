import { initializeApp } from 'firebase/app';
<<<<<<< HEAD
import { getFirestore } from 'firebase/firestore';
=======
import { getAuth } from 'firebase/auth';
>>>>>>> 09696dd731b594f522cba6f334b328f91173ac73

const firebaseConfig = {
  apiKey: 'AIzaSyBDDcRjD-n8GARKy7Kz04UMPyJ_2DMW3lY',
  authDomain: 'customhrms.firebaseapp.com',
  projectId: 'customhrms',
  storageBucket: 'customhrms.appspot.com',
  messagingSenderId: '454637246867',
  appId: '1:454637246867:web:7d3d4402869f5a20ac3066',
  measurementId: 'G-KV472W0W56'
};

const app = initializeApp(firebaseConfig);
<<<<<<< HEAD
const db = getFirestore(app);

export { db as default };
=======

export const auth = getAuth(app);

export default app;
>>>>>>> 09696dd731b594f522cba6f334b328f91173ac73
