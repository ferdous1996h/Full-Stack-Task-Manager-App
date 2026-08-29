import TaskItem from './TaskItem.jsx';
export default function TaskList({ tasks, setTasks }) {

  return (
    <section className="flex flex-col">
      {tasks.map((ele, ind) => (
        <TaskItem
          task={ele}
          setTasks={setTasks}
          key={ind}
        />
      ))}
    </section>
  );
}
