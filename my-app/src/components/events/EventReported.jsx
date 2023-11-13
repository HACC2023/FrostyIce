import { useSession } from "next-auth/react";
import PropTypes from "prop-types";
import EventCollapse from "./common/EventCollapse";
import DispatchTeamBtn from "./event-reported/DispatchTeamBtn";
import DismissBtn from "./event-reported/DismissBtn";
import StaticMap from "../map/StaticLocationMap/StaticMap";
import { prettyHstDateTime } from "@/utils/dateConverter";
import Image from "next/image";

const EventRemoval = ({ event, checked, setCurrentChecked }) => {
  const { data: session } = useSession();

  return (
    <EventCollapse title="Reported" checked={checked} setCurrentChecked={setCurrentChecked} index={0}>
      <div className="bg-base-100 rounded-xl px-6 py-4">
        <section>
          <div className="flex flex-col md:flex-row gap-x-6">
            <div className="w-full md:w-1/2">
              <h2 className="md:text-2xl font-bold mb-2">Information</h2>
              <div>
                <span className="font-semibold">Date Reported:</span> {prettyHstDateTime(event.reportedDate)}
                <p className="break-words mt-2"><span className="font-semibold">Type:</span> {event.publicType}</p>
                {event.publicTypeDesc !== 'No additional description provided' && <p className="break-words">{event.publicTypeDesc}</p>}
                <p className="break-words mt-2"><span className="font-semibold">Location Description:</span> {event.publicLocationDesc}</p>
                {event.publicLatLongOrPositionDesc && (<p className="break-words">{event.publicLatLongOrPositionDesc}</p>)}
                <p className="break-works mt-2"><span className="font-semibold">Environment Description:</span> {event.publicDebrisEnvDesc}</p>
                {event.publicDebrisEnvAdditionalDesc && (<p className="break-words">{event.publicDebrisEnvAdditionalDesc}</p>)}
                <p className="break-words mt-2"><span className="font-semibold">Biofouling Rating:</span> {event.publicBiofoulingRating}/10</p>
                {event.publicContainerFullness && (<p className="break-words">
                  Container Fullness: {event.publicContainerFullness}
                </p>)}
                {event.publicClaimBoat && (<p className="break-words">
                  Contact Intends to Claim Boat: {event.publicClaimBoat}
                </p>)}
              </div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col w-full">
              <section className="w-full">
                <h2 className="font-bold md:text-2xl mb-2">Location</h2>
                <div className="flex justify-between">
                  <p className="font-semibold">Island: </p>
                  <p>{event.closestIsland ?? "-"}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">Longitude: </p>
                  <p>{event.mapLong ? Math.round(event.mapLong * 100000) / 100000 : "-"}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">Latitude: </p>
                  <p>{event.mapLat ? Math.round(event.mapLat * 100000) / 100000 : "-"}</p>
                </div>
                {event.closestLandmark && (
                  <p className="break-words">
                    <span className="font-semibold">Closest Landmark:</span> {event.closestLandmark}: {event.closestLandmark}
                  </p>
                )}
              </section>
              <section className="w-full">
                <h2 className="font-bold md:text-2xl mb-2">Contact Information</h2>
                <div className="flex justify-between">
                  <p className="font-semibold">Email: </p>
                  <p>{event.publicContact.email}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">Phone Number: </p>
                  <p>{event.publicContact.phoneNumber}</p>
                </div>
                <div className="flex justify-between">
                  <p className="font-semibold">Name: </p>
                  <p>
                    {event.publicContact.firstName}{" "}
                    {event.publicContact.lastName}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </section>
        <section className="flex flex-col-reverse md:flex-row justify-between w-full gap-x-6 py-3">
          <div className="w-full md:w-1/2 h-96 bg-primary-content flex justify-center items-center rounded-md">
            {event.mapLat && event.mapLong ? (
              <StaticMap latitude={event.mapLat} longitude={event.mapLong} />
            ) : (
              <div className="text-base-100">No coordinates found.</div>
            )}
          </div>
          <div className="w-full md:w-1/2 h-96 rounded-md bg-secondary flex items-center justify-center text-base-100 overflow-hidden">
            {event.imageUrl ? (<Image src={event.imageUrl} width="800" height="800" alt="event image" className="object-cover w-full h-full"/>) : "No image uploaded."}
          </div>
        </section>
        {/* show this section if the event is not claimed */}
      </div>
      {!event.removalOrgId ? (
        <section className="flex justify-end gap-3 py-3">
          <DismissBtn event={event} />
          {session?.user && (
            <DispatchTeamBtn
              userOrgId={session.user.orgId}
              eventId={event._id}
            />
          )}
        </section>
      ) : (
        <div className="flex justify-end text-sm py-5">
          Team has been dispatched.
        </div>
      )}
    </EventCollapse>
  );
};

EventRemoval.propTypes = {
  event: PropTypes.object.isRequired,
  checked: PropTypes.bool.isRequired,
  setCurrentChecked: PropTypes.func.isRequired,
};

export default EventRemoval;
