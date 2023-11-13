import { TrashIcon } from "@heroicons/react/24/outline";
import PropTypes from "prop-types";
import DeleteOrgModal from "../modals/DeleteOrgModal";

const TableRow = ({ org, index }) => {
  return (
    <tr>
      <th>{index + 1}</th>
      <td>{org.name}</td>
      <td>
        <button
          onClick={() =>
            document.getElementById(`delete_org_modal_${index}`).showModal()
          }
        >
          <TrashIcon className="w-4 h-4" />
        </button>
        <DeleteOrgModal id={`delete_org_modal_${index}`} org={org} />
      </td>
    </tr>
  );
};

export default TableRow;

TableRow.propTypes = {
  org: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};
