import { POLYMERS } from "@/constants/constants";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

const EditComponentModal = ({ id, event, sortedMaterial }) => {
  const { register, handleSubmit, reset } = useForm({ 
    defaultValues: {
      material: sortedMaterial.material,
      mass: sortedMaterial.mass,
      polymer: sortedMaterial.polymer,
    }
  });
  const [status, setStatus] = useState(null);
  useEffect(() => {
    if (status && (status.msg === "success" || status.msg === "error")) {
      setTimeout(() => {
        setStatus(null);
        console.log("status reset");
      }, 3000);
    }
  }, [status]);

  async function editComponent(data) {
    try {
      setStatus({ msg: "loading", body: "Adding component..." });
      console.log("sortedMaterial._id", sortedMaterial._id);
      const res = await fetch(`/api/mongo/sorted-material/id/${sortedMaterial._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data
        }),
      });

      if (res.status === 200) {
        setStatus({
          msg: "success",
          body: "Successfully edited component ✅",
        });
        console.log("Successfully edited component");
      } else {
        throw new Error("Failed to add component.");
      }
    } catch (err) {
      setStatus({
        msg: "error",
        body: " Failed to edit component ❌",
      });
    } finally {
      setTimeout(() => {
        setStatus(null);
        console.log("status reset");
      }, 3000);
    }
  }

  function onSubmit(data) {
    console.log(data);
    editComponent(data);
  }

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="pb-5 font-bold">EDIT COMPONENT</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Material</span>
            </label>
            <input
              {...register("material", { required: true })}
              type="text"
              placeholder="Enter material name (eg. Nets, Boats, Cylinders)"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Mass (kg)</span>
            </label>
            <input
              {...register("mass", { required: true})}
              type="number"
              placeholder="Enter mass"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Polymer</span>
            </label>
            <select
              {...register("polymer", { required: true })}
              className="select select-bordered"
            >
              <option disabled>Choose polymer</option>
              <option>CA</option>
              {POLYMERS.map((polymer) => (
                <option key={polymer}>{polymer}</option>
              ))}
            </select>
          </div>
          <div className="modal-action">
            <button
              className="btn btn-outline"
              type="button"
              onClick={() => document.getElementById(id).close()}
            >
              Close
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
        {status && status.msg === "success" && <div>{status.body}</div>}
        {status && status.msg === "error" && <div>{status.body}</div>}
        {status && status.msg === "loading" && (
          <div className="flex items-center gap-2">
            <span className="loading loading-spinner" />
            {status.body}
          </div>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};

export default EditComponentModal;

EditComponentModal.propTypes = {
  id: PropTypes.string.isRequired,
};
