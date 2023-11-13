import PropTypes from "prop-types";
import { Fragment } from "react";
import { Transition, Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";

const AddItemModal = ({ isOpen, closeModal }) => {
  const { register, handleSubmit, formState, e } = useForm();

  async function addItem(item) {
    try {
      const res = await fetch("/api/mongo/items/add-item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: item.name,
          description: item.description,
          price: item.price,
        }),
      });

      if (res.status === 200) {
        console.log("Successfully added item");
      }
    } catch (err) {
      console.log("Failed to add item");
      console.log("ERROR:", err);
    }
  }
  function onSubmit(data) {
    console.log(data);
    addItem(data);
    closeModal();
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-80 max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-bold leading-6 text-gray-900"
                >
                  Add Item
                </Dialog.Title>
                <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-6">
                    <label
                      for="Item Name"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Item Name
                    </label>
                    <input
                      type="text"
                      {...register("name", { required: true})}
                      id="Item Name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Soccer Ball"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      for="Item Description"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Item Description
                    </label>
                    <input
                      type="text"
                      {...register("description", { required: true})}
                      id="Item Description"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="Brand New"
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      for="Item Price"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Item Price
                    </label>
                    <input
                      type="number"
                      {...register("price", { required: true})}
                      id="Item Price"
                      step=".01"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                      placeholder="12"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="text-white bg-indigo-700 hover:bg-indigo-800 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm w-full sm:w-auto my-3 px-5 py-2.5 text-center "
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="text-white bg-fuchsia-600 hover:bg-fuchsia-700 focus:ring-4 focus:outline-none focus:ring-fuchsia-300 font-medium rounded-lg text-sm w-full sm:w-auto my-3 px-5 py-2.5 text-center ml-3"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default AddItemModal;

AddItemModal.propTypes = {
  isOpen: PropTypes.bool,
  closeModal: PropTypes.func,
};
