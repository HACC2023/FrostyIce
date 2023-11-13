import { ROLES } from "@/roles/roles";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const AddMemberModal = ({ id, orgs }) => {
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


  async function registerUser(user) {
    try {
      setStatus({ msg: "loading", body: "Adding user..." });
      const res = await fetch("/api/mongo/user/add-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...user,
        }),
      });
      if (res.ok) {
        toast.success("Added user");
        reset();
      } else if (res.status === 409) {
        toast.error('User with entered email already exists');
      } else {
        toast.error('Error adding user');
      }
      setStatus(null);
      document.getElementById(id).close();
    } catch (err) {
      setStatus(null);
      toast.error('Error adding user');
    }
  }

  function onSubmit(data) {
    registerUser(data);
  }

  return (
    <dialog id={id} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="pb-5 font-bold">Add User</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="pb-3">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">First Name</span>
            </label>
            <input
              {...register("firstName", { required: true })}
              type="text"
              placeholder="Enter user's first name"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Last Name</span>
            </label>
            <input
              {...register("lastName", { required: true })}
              type="text"
              placeholder="Enter user's last name"
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Enter user's email"
              className="input input-bordered w-full"
              required
            />
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Role</span>
            </label>
            <select
              {...register("role", { required: true })}
              className="select select-bordered"
              placeholder="Select user's role"
            >
              <option disabled>Choose user&apos;s role</option>
              <option>{ROLES.ADMIN}</option>
              <option>{ROLES.ORG_ADMIN}</option>
              <option>{ROLES.ORG_MEMBER}</option>
            </select>
          </div>
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Organization</span>
            </label>
            <select
              {...register("orgId", { required: true })}
              className="select select-bordered"
              placeholder="Select user's organization"
            >
              <option disabled>Choose user&apos;s organization</option>
              {orgs &&
                orgs.map((org, index) => (
                  <option key={index} value={org._id}>
                    {org.name}
                  </option>
                ))}
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

export default AddMemberModal;

AddMemberModal.propTypes = {
  id: PropTypes.string.isRequired,
};
