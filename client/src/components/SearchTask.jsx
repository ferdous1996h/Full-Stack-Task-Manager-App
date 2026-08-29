
export default function SearchTask({ setSearch }) {
  return (
    <section className="ml-4 mb-3">
      <form>
        <input
          type="search"
          placeholder="Search"
          name="search"
          id="search"
          className="input input-sm w-40"
          onChange={e => setSearch(e.target.value)}
        />
      </form>
    </section>
  );
}
