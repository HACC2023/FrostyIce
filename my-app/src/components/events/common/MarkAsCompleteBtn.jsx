const MarkAsCompleteBtn = ({ eventId, nextStatus }) => {
  async function editStatus() {
    try {
      const res = await fetch(`/api/mongo/event/id/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });
      if (res.ok) {
        console.log("Moved to next stage");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <button
      className="btn btn-primary"
      onClick={editStatus}
    >
      Mark as Complete
    </button>
  );
};

export default MarkAsCompleteBtn;
