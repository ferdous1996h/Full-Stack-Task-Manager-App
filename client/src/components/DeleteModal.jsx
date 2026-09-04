import { MdOutlineDeleteForever } from 'react-icons/md';
export default function DeleteModal({ task, deleteTask }) {
  const modalID = `delete_modal_${task.id}`;
  return (
    <div>
      <button
        className="btn rounded-full p-0 hover:text-red-600"
        onClick={() => document.getElementById(modalID).showModal()}
      >
        <MdOutlineDeleteForever className="hover:bg-gray-900 active:bg-gray-600 w-10 h-6 rounded-full " />
      </button>
      <dialog id={modalID} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-2xl">Delete this task?</h3>
          <p className="py-4">
            Press ESC or click the Close button to cancel, or click Confirm to
            delete.
          </p>
          <div className="modal-action">
            <form method="dialog" className="flex gap-1.5">
              <button className="btn btn-dash">Close</button>
              <button
                className="btn bg-red-400"
                onClick={() => deleteTask(task.id)}
              >
                Confirm
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
}
