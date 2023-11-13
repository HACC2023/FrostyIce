import PropTypes from "prop-types";
import EditComponentModal from "./EditComponentModal";
import DeleteSortedMaterialModal from "../common/DeleteSortedMaterialModal";

const SortingRow = ({ sortedMaterial, event, userOrgId }) => {
  const editModalId = `edit_component_modal_${sortedMaterial._id}`;
  const deleteModalId = `delete_component_modal_${sortedMaterial._id}`;
  return (
    <tr>
      <td>{sortedMaterial.material}</td>
      <td>{sortedMaterial.mass}</td>
      <td>{sortedMaterial.polymer}</td>
      <td className="flex gap-2">
        {userOrgId === event.removalOrgId && (
          <>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => document.getElementById(editModalId).showModal()}
            >
              Edit
            </button>
            <EditComponentModal
              id={editModalId}
              event={event}
              sortedMaterial={sortedMaterial}
            />
            <button
              className="btn btn-outline btn-sm"
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

SortingRow.propTypes = {
  sortedMaterial: PropTypes.object.isRequired,
};

export default SortingRow;
