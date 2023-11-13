import PropTypes from "prop-types";
import { toast } from "react-toastify";

const DeleteOrgModal = ({ id, org }) => {
  async function deleteOrganization(orgData) {
    console.log("orgdata", orgData);
    try {
      const res = await fetch(`/api/mongo/organization/id/${orgData._id}`, {
        method: "DELETE",
      });
      console.log(res);

      const res2 = await fetch(
        `/api/mongo/user/remove-users-by-org/${orgData._id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok && res2.ok) {
        toast.success("Deleted organization");
      } else {
        toast.error("Failed to delete organization")
      }
    } catch (err) {
      toast.error("Failed to delete organization")
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    deleteOrganization(org);
    document.getElementById(id).close();
  }

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="pb-5 font-bold">DELETE ORGANIZATION</h3>
        <form onSubmit={onSubmit}>
          <div className="w-full">
            Are you sure you want to delete &quot;{org.name}&quot; and its members?
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

export default DeleteOrgModal;

DeleteOrgModal.propTypes = {
  id: PropTypes.string.isRequired,
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
    location: PropTypes.string.isRequired,
  }).isRequired,
};
