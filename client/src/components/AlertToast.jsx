import React from 'react';

export default function AlertToast({ alert }) {
  if (!alert) return null;
  console.log(alert)
  return (
    <div role="alert" className={`alert alert-${alert && alert.type} alert-soft mb-2 w-11/12 m-auto`}>
      <span>{alert.message}</span>
    </div>
  );
}
