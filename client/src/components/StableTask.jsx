import { FaRegEdit } from 'react-icons/fa';
import DeleteModal from './DeleteModal.jsx';
import DuedateBadge from './Tags/DuedateBadge.jsx';
import PriorityBadge from './Tags/PriorityBadge.jsx';
export default function StableTask({
  task,
  deleteTask,
  setIsEditing,
  updateTasks,
}) {
  return (
    <label className="flex">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => updateTasks(task.id, task.completed)}
        className="-mt-5 mx-3"
      />
      <section className="flex justify-between w-full">
        <div>
          <div
            className={`${task.completed ? 'line-through' : ''} text-xl font-bold flex`}
          >
            {task.title}
            <div className={`flex gap-2 ${task.completed ? 'hidden':''}`}>
              <PriorityBadge task={task} />
              <DuedateBadge task={task} />
            </div>
          </div>
          <p
            className={`${task.completed ? 'line-through' : ''} text-gray-400 ${task.description ? '' : 'italic text-red-200'}`}
          >
            {task.description ? `${task.description}` : 'No description'}
          </p>
        </div>
        <nav className="flex gap-2">
          <DeleteModal task={task} deleteTask={deleteTask} />
          <button
            onClick={() => setIsEditing(true)}
            className="btn rounded-full p-3 hover:text-green-400"
          >
            <FaRegEdit className="hover:bg-gray-900 active:bg-gray-600 w-4 h-6 rounded-full " />
          </button>
        </nav>
      </section>
    </label>
  );
}
