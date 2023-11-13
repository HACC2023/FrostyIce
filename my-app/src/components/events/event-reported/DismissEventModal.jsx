import { useRouter } from "next/router";
import PropTypes from "prop-types";

const DeleteEventModal = ({ id, eventId }) => {
  const router = useRouter();
  async function dismissEvent() {
    try {
      const res = await fetch(`/api/mongo/event/id/${eventId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "dismissed",
        }),
      });
      if (res.status === 200) {
        console.log("Successfully dismissed event");
        router.push("/manage-events");
      } else {
        throw new Error("Failed to dismiss event");
      }
    } catch (err) {
      console.log("Failed to dismiss event");
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    dismissEvent();
    document.getElementById(id).close();
  }

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="pb-5 font-bold">DISMISS</h3>
        <form onSubmit={onSubmit}>
          <div className="w-full">
            Are you sure you want to delete this event?
          </div>
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => document.getElementById(id).close()}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Delete
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default DeleteEventModal;

DeleteEventModal.propTypes = {
  id: PropTypes.string.isRequired,
  eventId: PropTypes.string.isRequired,
};
