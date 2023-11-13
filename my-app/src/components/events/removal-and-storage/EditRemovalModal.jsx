import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { convertDateToLocalFormat, convertLocalDateToUTC } from "@/utils/dateConverter";

const EditRemovalModal = ({ id, event }) => {
  console.log(event.removalStartDate);
  const { register, handleSubmit, reset } = useForm();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (status && (status.msg === "success" || status.msg === "error")) {
      setTimeout(() => {
        setStatus(null);
        console.log("status reset");
      }, 3000);
    }
  }, [status]);

  console.log("type of removal start date", typeof event.removalStartDate);
  // TODO: need to update this function once the APIs are ready
  async function editEvent(data) {
    try {
      setStatus({ msg: "loading", body: "Adding organization..." });
      // Convert local time to UTC time
      const removalStartDate = new Date(convertLocalDateToUTC(data.removalStartDate));
      console.log("removalStartDate", removalStartDate);
      const removalEndDate = new Date(convertLocalDateToUTC(data.removalEndDate));
      const res = await fetch(`/api/mongo/event/id/${event._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          removalStartDate: removalStartDate,
          removalEndDate: removalEndDate,
        }),
      });

      if (res.status === 200) {
        setStatus({
          msg: "success",
          body: "Successfully edited event ✅",
        });
        console.log("Successfully edited event");
      } else {
        throw new Error("Failed to edit event.");
      }
    } catch (err) {
      setStatus({
        msg: "error",
        body: " Failed to edit event ❌",
      });
    } finally {
      setTimeout(() => {
        setStatus(null);
        console.log("status reset");
      }, 3000);
    }
  }

  function onSubmit(data) {
    console.log("data", data);
    console.log("event removal start date", event.removalStartDate);
    console.log("event removal start date converted", convertLocalDateToUTC(data.removalStartDate));
    editEvent(data);
  }

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="pb-5 font-bold">EDIT EVENT</h3>
        {event ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Debris Size <var>(kg/cm<sup>2</sup>)</var></span>
              </label>
              <input
                {...register("debrisSize")}
                defaultValue={event.debrisSize}
                type="number"
                placeholder="Enter debris size"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Debris Mass <var>kg</var></span>
              </label>
              <input
                {...register("debrisMass")}
                defaultValue={event.debrisMass}
                type="number"
                placeholder="Enter debris mass"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Environmental Damage</span>
              </label>
              <textarea
                {...register("assessedEnvDamage")}
                defaultValue={event.assessedEnvDamage}
                placeholder="Enter environmental damage"
                className="textarea textarea-bordered w-full"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Removal Start Date</span>
              </label>
              <input
                {...register("removalStartDate", { valueAsDate: true })}
                defaultValue={event.removalStartDate ? convertDateToLocalFormat(event.removalStartDate) : ""}
                type="date"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Removal End Date</span>
              </label>
              <input
                {...register("removalEndDate", { valueAsDate: true })}
                min={event.removalStartDate ? convertDateToLocalFormat(event.removalStartDate) : ""}
                defaultValue={event.removalEndDate ? convertDateToLocalFormat(event.removalEndDate) : ""}
                type="date"
                className="input input-bordered w-full"
              />
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Temporary Storage Location</span>
              </label>
              <select
                {...register("tempStorage")}
                defaultValue={event.tempStorage}
                className="select select-bordered"
              >
                <option disabled>Choose your location</option>
                <option>CMDR Hub</option>
                <option>Maui Node</option>
                <option>Big Island Node</option>
                <option>Kauai Node</option>
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
        ) : (
          <div>Loading...</div>
        )}
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

export default EditRemovalModal;

EditRemovalModal.propTypes = {
  id: PropTypes.string.isRequired,
};
