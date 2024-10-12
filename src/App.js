import React, { useState, useEffect } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, getDoc, updateDoc, setDoc, doc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import "./App.css"

const firebaseConfig = {
  apiKey: "AIzaSyAY64p6seFMWR40U9-v8itY7YCEFSy4Nuk",
  authDomain: "task-tracking-system-1f58f.firebaseapp.com",
  projectId: "task-tracking-system-1f58f",
  storageBucket: "task-tracking-system-1f58f.appspot.com",
  messagingSenderId: "955163092071",
  appId: "1:955163092071:web:db4d0b9284750bb0a260c2",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState({});
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [adminView, setAdminView] = useState(false);
  const [users, setUsers] = useState({});

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  useEffect(() => {
    const getTasks = async () => {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const tasksObject = {};
      querySnapshot.forEach((doc) => {
        const taskId = doc.id;
        const taskData = doc.data();
        const userId = taskData.userId;
        if (!tasksObject[userId]) {
          tasksObject[userId] = {};
        }
        tasksObject[userId][taskId] = taskData;
      });
      setTasks(tasksObject);
    };
    getTasks();
  }, []);

  useEffect(() => {
    const getUsers = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersObject = {};
      querySnapshot.forEach((doc) => {
        const userId = doc.id;
        const userData = doc.data();
        usersObject[userId] = userData;
      });
      setUsers(usersObject);
    };
    getUsers();
  }, []);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const userRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        await setDoc(userRef, { name: result.user.displayName, email: result.user.email });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const taskRef = doc(collection(db, 'tasks'));
      await setDoc(taskRef, { name: newTaskName, description: newTaskDescription, completed: false, userId: user.uid });
      setNewTaskName('');
      setNewTaskDescription('');
      const getTasks = async () => {
        const querySnapshot = await getDocs(collection(db, 'tasks'));
        const tasksObject = {};
        querySnapshot.forEach((doc) => {
          const taskId = doc.id;
          const taskData = doc.data();
          const userId = taskData.userId;
          if (!tasksObject[userId]) {
            tasksObject[userId] = {};
          }
          tasksObject[userId][taskId] = taskData;
        });
        setTasks(tasksObject);
      };
      getTasks();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateTask = async (taskId, task) => {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, task);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAdminView = () => {
    setAdminView(true);
  };

  const handleUserView = () => {
    setAdminView(false);
  };

  return (
    <div className="app">
      <header>
        <h1>Task Tracking System</h1>
      </header>
      {user ? (
        <div className="main">
          {adminView ? (
            <AdminView users={users} tasks={tasks} />
          ) : (
            <UserView
              tasks={tasks[user.uid]}
              handleUpdateTask={handleUpdateTask}
              handleAddTask={handleAddTask}
              newTaskName={newTaskName}
              setNewTaskName={setNewTaskName}
              newTaskDescription={newTaskDescription}
              setNewTaskDescription={setNewTaskDescription}
            />
          )}
          <button onClick={handleLogout}>Logout</button>
          <button onClick={handleAdminView}>Admin View</button>
          <button onClick={handleUserView}>User View</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
}

function UserView({
  tasks,
  handleUpdateTask,
  handleAddTask,
  newTaskName,
  setNewTaskName,
  newTaskDescription,
  setNewTaskDescription,
}) {
  return (
    <div className="user-view">
      <h2>User View</h2>
      <form onSubmit={handleAddTask}>
        <label>Task Name:</label>
        <input
          type="text"
          value={newTaskName}
          onChange={(e) => setNewTaskName(e.target.value)}
          placeholder="Enter task name"
          required
        />
        <br />
        <label>Task Description:</label>
        <textarea
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
          placeholder="Enter task description"
          required
        />
        <br />
        <button type="submit">Add task</button>
      </form>
      {tasks ? (
        <div>
          <h2>Tasks:</h2>
          <ul>
            {Object.values(tasks).map((task) => (
              <li key={task.id}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    handleUpdateTask(task.id, { completed: !task.completed })
                  }
                />
                <span
                  style={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.name}
                </span>
                <p>{task.description}</p>
                <button
                  onClick={() =>
                    handleUpdateTask(task.id, { completed: true })
                  }
                >
                  Mark as completed
                </button>
                <button
                  onClick={() =>
                    handleUpdateTask(task.id, { completed: false })
                  }
                >
                  Mark as incomplete
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No tasks available.</p>
      )}
    </div>
  );
}

function AdminView({ users, tasks }) {
  return (
    <div className="admin-view">
      <h2>Admin View</h2>
      <h2>Users:</h2>
      <ul>
        {Object.keys(users).map((userId) => (
          <li key={userId}>
            <span>{users[userId].name}</span>
            <p>{users[userId].email}</p>
          </li>
        ))}
      </ul>
      <h2>Tasks:</h2>
      <ul>
        {Object.keys(tasks).map((userId) => (
          <li key={userId}>
            <h3>{userId}</h3>
            <ul>
              {Object.keys(tasks[userId]).map((taskId) => (
                <li key={taskId}>
                  <span style={{ textDecoration: tasks[userId][taskId].completed ? 'line-through' : 'none' }}>
                    {tasks[userId][taskId].name}
                  </span>
                  <p>{tasks[userId][taskId].description}</p>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;