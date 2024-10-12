// import firebase from 'firebase/app';
// import 'firebase/firestore';
// import 'firebase/auth';

// const firebaseConfig = {
//     apiKey: "AIzaSyAY64p6seFMWR40U9-v8itY7YCEFSy4Nuk",
//     authDomain: "task-tracking-system-1f58f.firebaseapp.com",
//     projectId: "task-tracking-system-1f58f",
//     storageBucket: "task-tracking-system-1f58f.appspot.com",
//     messagingSenderId: "955163092071",
//     appId: "1:955163092071:web:db4d0b9284750bb0a260c2",
//     measurementId: "G-PFJTQF528L"
//   };

// firebase.initializeApp(firebaseConfig);

// export const db = firebase.firestore();
// export const auth = firebase.auth();

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAY64p6seFMWR40U9-v8itY7YCEFSy4Nuk",
    authDomain: "task-tracking-system-1f58f.firebaseapp.com",
    projectId: "task-tracking-system-1f58f",
    storageBucket: "task-tracking-system-1f58f.appspot.com",
    messagingSenderId: "955163092071",
    appId: "1:955163092071:web:db4d0b9284750bb0a260c2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };