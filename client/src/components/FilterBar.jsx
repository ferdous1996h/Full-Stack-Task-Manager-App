import SearchTask from './SearchTask.jsx';
export default function FilterBar({ filter, setFilter, setSearch }) {
  return (
    <main>
      <SearchTask setSearch={setSearch} />
      <section className="ml-2 flex gap-2 h-8">
        <div className="divider "></div>
        <button
          className={`btn btn-xs hover:bg-[#42AAFA] hover:text-black ${filter === 'all' ? 'btn-dash btn-info' : 'btn-soft'}`}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={`btn btn-xs hover:bg-[#42AAFA] hover:text-black ${filter === 'active' ? 'btn-dash btn-info' : 'btn-soft'}`}
          onClick={() => setFilter('active')}
        >
          Active
        </button>
        <button
          className={`btn btn-xs hover:bg-[#42AAFA] hover:text-black ${filter === 'completed' ? 'btn-dash btn-info' : 'btn-soft'}`}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
      </section>
    </main>
  );
}
