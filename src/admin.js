import { db } from './firebase';

export const getAdminData = async () => {
  const adminRef = db.collection('admin');
  const snapshot = await adminRef.get();
  const adminData = snapshot.docs.map((doc) => doc.data());
  return adminData;
};

export const getTaskCompletionStatistics = async () => {
  const tasksRef = db.collection('tasks');
  const snapshot = await tasksRef.get();
  const tasksData = snapshot.docs.map((doc) => doc.data());
  const completionStatistics = tasksData.reduce((acc, task) => {
    if (task.completed) {
      acc.completed++;
    } else {
      acc.pending++;
    }
    return acc;
  }, { completed: 0, pending: 0 });
  return completionStatistics;
};