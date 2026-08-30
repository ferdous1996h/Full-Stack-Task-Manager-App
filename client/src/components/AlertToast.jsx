import clsx from 'clsx';
export default function AlertToast({ alert }) {
  if (!alert) return null;
  console.log(alert);
  const alertClasses = {
    success: 'alert-success',
    info: 'alert-info',
    error: 'alert-error',
  };
  return (
    <div
      role="alert"
      className={clsx(
        'alert',
        alertClasses[alert.type],
        'alert-soft mb-2 w-11/12 m-auto'
      )}
    >
      <span>{alert.message}</span>
    </div>
  );
}
