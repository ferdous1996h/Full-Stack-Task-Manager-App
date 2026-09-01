export default function getDateStatus(dateString) {
  if(!dateString) return 'nodue'
  const date = new Date(dateString);
  const today = new Date();

  // Remove time from both dates
  date.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round((date - today) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'tomorrow';
  if (diffDays < 0) return 'overdue';

  return 'upcoming';
}
