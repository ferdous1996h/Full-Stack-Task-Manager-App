
export default function MultiselectBadge({ categories }) {
  console.log(categories)
  return (
    <div className='flex gap-1 justify-center items-center'>
      Categories➡️
      {categories.map(item => (
        <div key={item.id} className="badge badge-primary badge-sm">
          {item.name}
        </div>
      ))}
    </div>
  );
}
