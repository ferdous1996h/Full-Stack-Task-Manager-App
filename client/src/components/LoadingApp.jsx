export default function LoadingApp() {
  return (
    <div className="aura text-orange-600 bg-yellow-200 w-full mt-8">
      <div className="card bg-base-100 text-base-content">
        <div className="card-body">
          <p>
            The task-manager app is loading...
            <span> </span>
            <span> </span>
            <span className="loading loading-spinner loading-xl w-x"></span>
          </p>
        </div>
      </div>
    </div>
  );
}
