import PropTypes from "prop-types";
import {toast} from "react-toastify";

const DeleteMembersModal = ({ id, member }) => {
  async function deleteMember(memberData) {
    try {
      const response = await fetch(`/api/mongo/user/id/${memberData._id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Successfully deleted member");
      } else {
        toast.error("Failed to delete member");
      }
    } catch (err) {
      console.log(err);
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    deleteMember(member);
    document.getElementById(id).close();
  }

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="pb-5 font-bold">DELETE MEMBER</h3>
        <form onSubmit={onSubmit}>
          <div className="w-full">
            Are you sure you want to delete &quot;{member?.firstName}&quot;?
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

export default DeleteMembersModal;

DeleteMembersModal.propTypes = {
  id: PropTypes.string.isRequired,
  member: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    orgId: PropTypes.string.isRequired,
  }).isRequired,
};
