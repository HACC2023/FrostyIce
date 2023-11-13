import { STATUS } from "@/constants/constants";

const DispatchTeamBtn = ({ userOrgId, eventId }) => {
  async function dispatchTeam() {
    console.log("userOrgId", userOrgId);
    console.log("eventId", eventId);
    try {
      const res = await fetch(`/api/mongo/event/id/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          removalOrgId: userOrgId,
          status: STATUS[1],
        }),
      });
      if (res.ok) {
        console.log("Successfully dispatched team");
      }
    } catch (err) {
      console.log(err);
      console.log("Failed to dispatch team");
    }
  }
  return (
    <button onClick={dispatchTeam} className="btn btn-primary">
      Dispatch Team
    </button>
  );
};

export default DispatchTeamBtn;
