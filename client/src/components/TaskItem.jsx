import { useState } from 'react';

import EditingTask from './EditingTask.jsx';
import StableTask from './StableTask.jsx';
export default function TaskItem({ task, setTasks, showAlert }) {
  const [isEditing, setIsEditing] = useState(false);
  async function updateTasks(id, status) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completed: !status,
      }),
    });
    const updateTask = await response.json();
    if (updateTask.id) {
      setTasks(prev => prev.map(task => (task.id === id ? updateTask : task)));
    }
  }
  async function deleteTask(id) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    if (!response.ok) {
      console.error(data.error);
      return;
    }
    if(data.message){
      showAlert(data.message)
    }
    setTasks(prev => prev.filter(ele => ele.id !== id));
  }
  return (
    <>
      {isEditing ? (
        <EditingTask
          task={task}
          updateTasks={updateTasks}
          setIsEditing={setIsEditing}
          setTasks={setTasks}
          showAlert={showAlert}
        />
      ) : (
        <StableTask
          task={task}
          deleteTask={deleteTask}
          setIsEditing={setIsEditing}
          updateTasks={updateTasks}
        />
      )}

      <div className="divider m-0"></div>
    </>
  );
}
