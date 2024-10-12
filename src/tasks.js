import { db } from './firebase';

const tasks = [
  {
    id: 'task-1',
    name: 'Scroll to the bottom of the page',
    description: 'Scroll to the bottom of the page to complete this task',
    completed: false,
  },
  {
    id: 'task-2',
    name: 'Click the button',
    description: 'Click the button to complete this task',
    completed: false,
  },
  {
    id: 'task-3',
    name: 'Click the image',
    description: 'Click the image to complete this task',
    completed: false,
  },
];

export const getTasks = async () => {
  const tasksRef = db.collection('tasks');
  const snapshot = await tasksRef.get();
  const tasksData = snapshot.docs.map((doc) => doc.data());
  return tasksData;
};

export const completeTask = async (taskId) => {
  const taskRef = db.collection('tasks').doc(taskId);
  await taskRef.update({ completed: true });
};