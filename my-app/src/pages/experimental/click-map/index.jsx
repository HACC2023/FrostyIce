import ClickableMap from "../../../components/map/ClickableMap/ClickableMap";

// setCoordinates is a function that sets the coordinates in the parent component
const ClickableMapPage = () => {
  // console.log(marker.longitude, marker.latitude)
  return (
    <div className="w-full">
      <ClickableMap />
      {/* <a
        className="underline text-blue-600"
        href={`data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(locations)
        )}`}
        download="locations.json"
      >
        {`Download Locations JSON`}
      </a> */}
    </div>
  );
};

export default ClickableMapPage;
