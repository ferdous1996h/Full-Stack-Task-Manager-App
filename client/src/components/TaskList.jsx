import {  useState } from 'react';
import EmptyList from './EmptyList.jsx';
import FilterBar from './FilterBar.jsx';
import TaskItem from './TaskItem.jsx';
export default function TaskList({ tasks, setTasks, showAlert }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  let filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });
  filteredTasks = filteredTasks.filter(task =>
    task.title.toLowerCase().includes(search)
  );
  return (
    <section className="flex flex-col">
      <FilterBar setFilter={setFilter} filter={filter} setSearch={setSearch} />
      {filteredTasks.map((ele, ind) => (
        <TaskItem
          task={ele}
          setTasks={setTasks}
          key={ind}
          showAlert={showAlert}
        />
      ))}
      {filteredTasks.length === 0 ? <EmptyList listName={filter} /> : null}
    </section>
  );
}
