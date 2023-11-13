import AddComponentModal from "./sorting/AddComponentModal";
import SortingRow from "./sorting/SortingRow";
import EventCollapse from "./common/EventCollapse";
import { STATUS } from "@/constants/constants";
import CompletionWarning from "./common/CompletionWarning";
import MarkAsCompleteBtn from "./common/MarkAsCompleteBtn";
import UndoStepBtn from "./common/UndoStepBtn";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import PropTypes from "prop-types";

const Sorting = ({ event, userOrgId, checked, setCurrentChecked }) => {
  const _id = event._id;
  const { data } = useSWR(
    _id ? `/api/mongo/sorted-material/get-all-by-event-id/${event._id}` : null,
    _id ? fetcher : null,
    { refreshInterval: 1000 }
  );

  return (
    <EventCollapse title="Sorting" checked={checked} setCurrentChecked={setCurrentChecked} index={2}>
      {STATUS.indexOf(event.status) > 1 ? (
        <>
          {userOrgId === event.removalOrgId && (
            <section className="flex justify-between md:mt-10">
              <button
                className="btn btn-secondary"
                onClick={() =>
                  document.getElementById("add_component_modal").showModal()
                }
              >
                Add Component
              </button>
              <AddComponentModal id="add_component_modal" event={event} />
            </section>
          )}
          <div className="flex flex-col gap-3 my-3 py-6 px-3 bg-base-100 rounded-xl">
            <div className="overflow-x-auto w-full flex items-start rounded-xl p-3 h-96 border border-neutral">
              <table className="table table-zebra table-pin-rows">
                <thead>
                  <tr>
                    <th>Material</th>
                    <th>Mass (kg)</th>
                    <th>Polymers</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((sortedMaterial) => (
                      <SortingRow
                        key={sortedMaterial._id}
                        sortedMaterial={sortedMaterial}
                        event={event}
                        userOrgId={userOrgId}
                      />
                    ))}
                </tbody>
              </table>
            </div>
            {userOrgId === event.removalOrgId && (
              <section className="flex justify-end gap-3 py-3">
                {STATUS.indexOf(event.status) <= 2 ? (
                  <MarkAsCompleteBtn
                    eventId={event._id}
                    nextStatus={STATUS[3]}
                  />
                ) : (
                  <UndoStepBtn eventId={event._id} prevStatus={STATUS[2]} />
                )}
              </section>
            )}
          </div>
        </>
      ) : (
        <CompletionWarning />
      )}
    </EventCollapse>
  );
};

Sorting.propTypes = {
  event: PropTypes.object,
  userOrgId: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  setCurrentChecked: PropTypes.func.isRequired,
}

export default Sorting;
