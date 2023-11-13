import { useRef } from "react";

const EditableText = ({ data, item, state, field }) => {
  const isEnterPressed = useRef(false);
  // console.log("data field:", data[field]);
  async function handleNameEdit() {
    try {
      const res = await fetch(`/api/mongo/items/edit-item-by-id/${item._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          [field]: data[field],
        }),
      });

      if (res.status === 200) {
        console.log("Successfully updated item");
      }
    } catch (err) {
      console.log("Failed to update item");
      console.log("ERROR:", err);
    }
  }

  return (
    <input
      type={field === "price" ? "number" : "text"}
      value={data[field]}
      onChange={(e) => state({ ...data, [field]: e.target.value })}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          console.log("Enter");
          handleNameEdit();
          isEnterPressed.current = true;
          e.target.blur();
        }
        if (e.key === "Escape") {
          console.log("Escape");
          isEnterPressed.current = false;
          e.target.blur();
          return state({ ...data, [field]: item[field] });
        }
      }}
      onBlur={(e) => {
        if (!isEnterPressed.current) {
          return state({ ...data, [field]: item[field] });
        }
      }}
      onFocus={(e) => {
        isEnterPressed.current = false;
      }}
    />
  );
}

export default EditableText;