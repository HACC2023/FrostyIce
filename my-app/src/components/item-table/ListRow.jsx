import PropTypes from "prop-types";
import { useState } from "react";
import EditableText from "./EditableText";
import { useEffect } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const ListRow = ({ item, index }) => {
  const [data, setData] = useState(item);

  // prevents mismatching values when deleting an item by keeping the data in sync with item
  useEffect(() => {
    setData(item);
  }, [item]);


  async function handleDelete() {
    try {
      const res = await fetch(`/api/mongo/items/delete-item-by-id/${item._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.status === 200) {
        console.log("Successfully deleted item");
      }
    } catch (err) {
      console.log("Failed to delete item");
      console.log("ERROR:", err);
    }
  }

  return (
    <tr className="border-y" key={index}>
      {console.log("renrendering")}
      <td className="px-3">
        <EditableText data={data} item={item} state={setData} field="name"/>
      </td>
      <td className="px-3">
        <EditableText data={data} item={item} state={setData} field="description"/>
      </td>
      <td className="px-3">
        <EditableText data={data} item={item} state={setData} field="price"/>
      </td>
      <td className="px-3 text-right">
        <button onClick={() => handleDelete()}>Delete</button>
      </td>
      <td className="px-3 text-right">
        <Link href={`/items/item/${item._id}`}>
          {console.log(typeof ArrowTopRightOnSquareIcon)}
          <ArrowTopRightOnSquareIcon className="h-5 w-5 text-indigo-600 hover:text-indigo-900" />
        </Link>
      </td>
    </tr>
  );
}

export default ListRow;

ListRow.propTypes = {
  item: PropTypes.object,
  index: PropTypes.number,
};
