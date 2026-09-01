import { useRef } from 'react';
import titleCase from '../utils/titleCase.js';

export default function EditingTask({
  updateTasks,
  task,
  setIsEditing,
  setTasks,
  showAlert,
}) {
  let titleTemp = useRef(task.title);
  let descriptionTemp = useRef(task.description);
  let priorityTemp = useRef(task.priority);
  let dueDateTemp = useRef(task.dueDate);
  async function updateTaskDetails(id, title, description, priority, dueDate) {
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        description,
        priority,
        dueDate,
      }),
    });
    const editedTask = await response.json();
    console.log(editedTask);
    if (editedTask.id) {
      setTasks(prev => prev.map(task => (task.id === id ? editedTask : task)));
      setIsEditing(false);
      showAlert('Task record updated!', 'info');
    }
  }
  return (
    <section>
      <label className="flex mr-3 ">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => updateTasks(task.id, task.completed)}
          className="-mt-20 mx-3"
          disabled
        />
        <section className="flex flex-col w-full gap-2">
          <input
            type="text"
            defaultValue={task.title}
            className="border-2 border-gray-400 w-full rounded-xl p-2"
            onChange={e => {
              titleTemp.current = e.target.value;
            }}
          />
          <textarea
            name=""
            id=""
            defaultValue={task.description}
            className="border-2 border-gray-400 w-full rounded-2xl p-2"
            onChange={e => {
              descriptionTemp.current = e.target.value;
            }}
          />
        </section>
        <div className="ml-3">
          <label htmlFor="priority" className="text-sm italic text-gray-400">
            Priority:
          </label>
          <select
            defaultValue={titleCase(task.priority)}
            name="priority"
            id="priority"
            className="select select-xs appearance-none mt-2 w-[9em] "
            onChange={e => (priorityTemp.current = e.target.value)}
          >
            <option disabled={true}>Select priority</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <div>
            <label className="text-sm italic text-gray-400" htmlFor="dueDate">
              Due date
            </label>
            <input
              type="date"
              defaultValue={task.dueDate ? task.dueDate.split('T')[0] : ''}
              name="dueDate"
              className="input"
              id="dueDate"
              onChange={e => (dueDateTemp.current = e.target.value)}
            />
          </div>
        </div>
      </label>
      <div className="flex justify-between items-center w-9/10 m-auto">
        <div className="badge badge-outline badge-info ml-5">Editing</div>
        <div className="flex justify-center gap-2 mt-2">
          <button
            onClick={() =>
              updateTaskDetails(
                task.id,
                titleTemp.current,
                descriptionTemp.current,
                priorityTemp.current,
                dueDateTemp.current
              )
            }
            className="border-2 border-gray-300 bg-white text-black rounded-lg px-3 py-1 cursor-pointer active:scale-90"
          >
            Save
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="border-2 border-gray-300 rounded-lg px-3 py-1 cursor-pointer active:scale-90"
          >
            Cancel
          </button>
        </div>
      </div>
    </section>
  );
}
