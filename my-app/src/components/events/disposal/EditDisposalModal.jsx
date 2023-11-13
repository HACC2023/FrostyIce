import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { DISPOSAL_MECHANISMS } from "@/constants/constants";
import PropTypes from "prop-types";
import { convertDateToLocalFormat, convertLocalDateToUTC } from "@/utils/dateConverter";

const EditDisposalModal = ({ id, sortedMaterial }) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      disposalMechanism: sortedMaterial.disposalMechanism,
      disposalDate: convertDateToLocalFormat(sortedMaterial.disposalDate ?? new Date(Date.now())),
    },
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

  async function editDisposal(data) {
    try {
      setStatus({ msg: "loading", body: "Adding component..." });
      const res = await fetch(`/api/mongo/sorted-material/edit-disposal-by-id/${sortedMaterial._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          disposalDate: convertLocalDateToUTC(data.disposalDate),
        }),
      });

      if (res.status === 200) {
        setStatus({
          msg: "success",
          body: "Successfully edited component ✅",
        });
        console.log("Successfully edited component");
      } else {
        throw new Error("Failed to edit component.");
      }
    } catch (err) {
      setStatus({
        msg: "error",
        body: " Failed to add Component ❌",
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
    // converts date back to actual time
    console.log(convertLocalDateToUTC(data.disposalDate));
    editDisposal(data);
  }

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="pb-5 font-bold">EDIT DISPOSAL</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Disposal Mechanism</span>
            </label>
            <select
              {...register("disposalMechanism")}
              className="select select-bordered"
            >
              <option disabled>Choose disposal mechanism</option>
              {DISPOSAL_MECHANISMS.map((mechanism, index) => (
                <option key={index}>{mechanism}</option>
              ))}
            </select>
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Disposal Date</span>
            </label>
            <input
              {...register("disposalDate", { valueAsDate: true })}
              type="date"
              placeholder="Enter disposal date"
              className="input input-bordered w-full"
            />
          </div>
          {/* Submit or Close Modal */}
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

export default EditDisposalModal;

EditDisposalModal.propTypes = {
  id: PropTypes.string.isRequired,
};
