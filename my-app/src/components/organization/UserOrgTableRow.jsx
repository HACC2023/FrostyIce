import DeleteMembersModal from "@/components/organization/DeleteMembersModal";
import { ROLES } from "@/roles/roles";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { toast } from "react-toastify";

const UserOrgTableRow = ({ user, index, sessionRole }) => {
  const [editRole, setEditRole] = useState(false);
  const [role, setRole] = useState(user.role);

  const onSave = async () => {
    try {
      const response = await fetch(`/api/mongo/user/id/${user._id}`, {
        method: "PUT",
        body: JSON.stringify({
          role: role,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setEditRole(false);
        toast.success("Successfully updated member.");
        console.log("Successfully updated member.");
      } else {
        throw new Error("Failed to update member.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <tr>
      <th>{index + 1}</th>
      <td>
        {user.lastName}, {user.firstName}
      </td>
      <td>{user.email}</td>
      <td>
        {editRole ? (
          <select
            className="select select-sm select-bordered"
            onChange={(e) => setRole(e.target.value)}
            defaultValue={user.role}
          >
            <option>{ROLES.ORG_ADMIN}</option>
            <option>{ROLES.ORG_MEMBER}</option>
          </select>
        ) : (
          `${user.role}`
        )}
      </td>
      {sessionRole !== ROLES.ORG_MEMBER && (
        <td className="flex gap-5">
          {editRole ? (
            <>
              <button
                className="btn btn-sm btn-primary text-xs"
                onClick={onSave}
              >
                Save
              </button>
              <button
                className="btn btn-sm btn-outline text-xs"
                onClick={() => setEditRole(false)}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setEditRole(true)}>
                <PencilSquareIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById(`delete_member_modal_${index}`)
                    .showModal()
                }
              >
                <TrashIcon className="w-4 h-4" />
              </button>
              <DeleteMembersModal
                id={`delete_member_modal_${index}`}
                member={user}
              />
            </>
          )}
        </td>
      )}
    </tr>
  );
};

export default UserOrgTableRow;
