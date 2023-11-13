import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ISLANDS } from "@/constants/constants";

const AddOrgModal = ({ id }) => {
  const { register, handleSubmit, reset } = useForm();
  const [status, setStatus] = useState(null);
  
  useEffect(() => {
    if (status && (status.msg === "success" || status.msg === "error")) {
      setTimeout(() => {
        setStatus(null);
        console.log("status reset");
      }, 3000);
    }
  }, [status])

  async function addOrganization(org) {
    try {
      setStatus({ msg: "loading", body: "Adding organization..." });
      const res = await fetch("/api/mongo/organization/add-organization", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: org.name,
          location: org.location,
        }),
      });
      setStatus(null);
      document.getElementById(id).close();
      if (res.ok) {
        toast.success('Added organization');
        reset();
      } else if (res.status === 409) {
        toast.error('Organization already exists');
      } else {
        toast.error('Failed to add organization');
      }
    } catch (err) {
      toast.error('Failed to add organization');
    }
  }

  function onSubmit(data) {
    addOrganization(data);
  }

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle z-50">
      <div className="modal-box">
        <h3 className="pb-5 font-bold">ADD ORGANIZATION</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Organization Name</span>
            </label>
            <input
              {...register("name", { required: true })}
              type="text"
              placeholder="Enter organization name"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Location</span>
            </label>
            <select
              {...register("location", { required: true })}
              className="select select-bordered"
            >
              <option disabled>Choose location</option>
              {ISLANDS.map((island, index) => {
                if (island !== 'At-sea Offshore') return <option key={index}>{island}</option>;
              })}
            </select>
          </div>
          <div className="modal-action">
            {status && status.msg === "loading" && (
              <div className="my-auto me-auto">
                <div className="flex items-center gap-2">
                  <span className="loading loading-spinner" />
                  {status.body}
                </div>
              </div>
            )}
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
      </div>
      <form method="dialog" className="modal-backdrop">
        <button className="cursor-default">close</button>
      </form>
    </dialog>
  );
};

export default AddOrgModal;

AddOrgModal.propTypes = {
  id: PropTypes.string.isRequired,
};
