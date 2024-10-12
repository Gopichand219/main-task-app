const userId = new URLSearchParams(window.location.search).get('userId');
const taskId = new URLSearchParams(window.location.search).get('taskId');

firebase.initializeApp({
    apiKey: "AIzaSyAY64p6seFMWR40U9-v8itY7YCEFSy4Nuk",
    authDomain: "task-tracking-system-1f58f.firebaseapp.com",
    projectId: "task-tracking-system-1f58f",
    storageBucket: "task-tracking-system-1f58f.appspot.com",
    messagingSenderId: "955163092071",
    appId: "1:955163092071:web:db4d0b9284750bb0a260c2",
});

const db = firebase.firestore();

document.getElementById('button').addEventListener('click', () => {
  db.collection('tasks').doc(taskId).update({ completed: true });
});

document.getElementById('image').addEventListener('click', () => {
  db.collection('tasks').doc(taskId).update({ completed: true });
});

document.getElementById('scrollable-content').addEventListener('scroll', () => {
  if (document.getElementById('scrollable-content').scrollTop + window.innerHeight >= document.getElementById('scrollable-content').scrollHeight) {
    db.collection('tasks').doc(taskId).update({ completed: true });
  }
});