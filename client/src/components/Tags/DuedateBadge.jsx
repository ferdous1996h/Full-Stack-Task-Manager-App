import clsx from 'clsx';
import getDateStatus from '../../utils/getDateStatus.js';
export default function DuedateBadge({ task }) {
  const dueDates = {
    today: '📅Due today',
    tomorrow: '📅Due tomorrow',
    overdue: '⚠️Overdue',
    upcoming: '📅upcoming',
    nodue: 'No due date',
  };
  const dueDatesStyle = {
    today: 'badge-success',
    tomorrow: 'badge-success',
    overdue: 'badge-error',
    upcoming: 'badge-info',
    nodue: '',
  };
  return (
    <div
      className={clsx(
        'badge badge-outline badge-sm',
        dueDatesStyle[getDateStatus(task.dueDate)]
      )}
    >
      {dueDates[getDateStatus(task.dueDate)]}
    </div>
  );
}
