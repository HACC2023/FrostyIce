import PropTypes from "prop-types";
import EditDisposalModal from "./EditDisposalModal";
import DeleteSortedMaterialModal from "../common/DeleteSortedMaterialModal";

const DisposalRow = ({ sortedMaterial, userOrgId, removalOrgId }) => {
  const editModalId = `edit_disposal_modal_${sortedMaterial._id}`;
  const deleteModalId = `delete_disposal_modal_${sortedMaterial._id}`;

  return (
    <tr>
      <td>{sortedMaterial.material ?? "-"}</td>
      <td>{sortedMaterial.mass ?? "-"}</td>
      <td>{sortedMaterial.polymer ?? "-"}</td>
      <td>{sortedMaterial.disposalMechanism ?? "-"}</td>
      <td>
        {sortedMaterial.disposalDate
          ? new Date(sortedMaterial.disposalDate).toLocaleDateString("en-US")
          : "-"}
      </td>
      <td className="flex gap-2">
        {userOrgId === removalOrgId && (
          <>
            <button
              className="btn btn-sm btn-outline"
              onClick={() => document.getElementById(editModalId).showModal()}
            >
              Edit
            </button>
            <EditDisposalModal
              id={editModalId}
              sortedMaterial={sortedMaterial}
            />
            <button
              className="btn btn-sm btn-outline"
              onClick={() => document.getElementById(deleteModalId).showModal()}
            >
              Delete
            </button>
            <DeleteSortedMaterialModal
              id={deleteModalId}
              sortedMaterial={sortedMaterial}
            />
          </>
        )}
      </td>
    </tr>
  );
};

DisposalRow.propTypes = {
  sortedMaterial: PropTypes.shape({
    material: PropTypes.string.isRequired,
    mass: PropTypes.number.isRequired,
    polymer: PropTypes.string.isRequired,
    disposalDate: PropTypes.instanceOf(Date) || null,
    disposalMechanism: PropTypes.string,
  }).isRequired,
};

export default DisposalRow;
