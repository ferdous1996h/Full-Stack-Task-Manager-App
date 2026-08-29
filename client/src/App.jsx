import { useEffect, useState } from 'react';
import ErrorMSG from './components/ErrorMSG.jsx';
import LoadingApp from './components/LoadingApp.jsx';
import TaskForm from './components/TaskForm.jsx';
import TaskList from './components/TaskList.jsx';
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    async function fetchTask() {
      try {
        setIsLoading(true);
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error(
            `Fail to fetch tasks. Error code: ${response.status}`
          );
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTask();
  }, []);
  console.log(tasks);
  if (isLoading) return <LoadingApp />;
  if (error) return <ErrorMSG error={error} />;
  return (
    <section className="flex flex-col justify-center">
      <TaskForm setTasks={setTasks} />
      <TaskList tasks={tasks} setTasks={setTasks} />
    </section>
  );
}
