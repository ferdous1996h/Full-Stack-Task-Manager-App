import clsx from 'clsx';
export default function PriorityBadge({task}) {
    const priorityCLS = {
      high: 'badge-secondary',
      medium: 'badge-warning',
      low: 'badge-success',
      primary: 'badge-primary',
    };
  return (
    <div
      className={clsx(
        'badge badge-sm badge-outline badge-primary ml-6',
        priorityCLS[task.priority]
      )}
    >
      {task.priority}
    </div>
  );
}
