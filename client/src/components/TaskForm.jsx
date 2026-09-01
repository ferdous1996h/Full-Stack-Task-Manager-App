export default function TaskForm({ setTasks, showAlert }) {
  async function addTask(formData) {
    const title = formData.get('title');
    const description = formData.get('description');
    const priority = formData.get('priority');
    let dueDate = null;
    if (formData.get('dueDate')) {
      dueDate = new Date(formData.get('dueDate') || null);
      console.log(dueDate);
    }
    const response = await fetch('/api/tasks', {
      method: 'POST',
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
    const createdtask = await response.json();
    console.log(createdtask);
    if (createdtask.id) {
      setTasks(prev => [createdtask, ...prev]);
      showAlert('Task created successfully', 'success');
    } else {
      if (createdtask) showAlert(createdtask.message, 'error');
    }
  }
  return (
    <section className="p-4">
      <h1 className="text-2xl mb-6 text-center">Task Manager</h1>
      <form action={addTask}>
        <section className="flex flex-col">
          <label htmlFor="title" className="text-blue-100">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="What need to be done?"
            className="input input-sm w-full"
          />
          <label htmlFor="description " className="text-blue-100">
            Description
          </label>
          <textarea
            className="textarea h-16 w-full"
            placeholder="Add details (optional)"
            id="description"
            name="description"
          ></textarea>
          <label htmlFor="priority"></label>
          <select
            defaultValue="Select priority"
            name="priority"
            id="priority"
            className="select select-sm appearance-none mt-2"
          >
            <option disabled={true}>Select priority</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <label htmlFor="dueDate"></label>
          <input type="date" name="dueDate" id="dueDate" className="input" />
          <button
            type="submit"
            className="btn btn-block border-1 border-gray-500 mt-2"
          >
            + Add task
          </button>
        </section>
      </form>
    </section>
  );
}
