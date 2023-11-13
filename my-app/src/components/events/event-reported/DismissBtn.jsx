import DismissEventModal from "./DismissEventModal";

const DismissBtn = ({ event }) => {
  return (
    <>
      <button onClick={() => document.getElementById("dismiss_event_modal").showModal()} className="btn btn-outline">
        Dismiss Event
      </button>
      <DismissEventModal id="dismiss_event_modal" eventId={event._id} />
    </>
  );
};

export default DismissBtn;
