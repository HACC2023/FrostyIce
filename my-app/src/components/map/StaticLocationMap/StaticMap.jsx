import Map, { Marker, NavigationControl } from "react-map-gl";
import Pin from "../ClickableMap/Pin";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  INITIAL_VIEW_STATE_CLICK_MAP,
} from "@/lib/mapconfig";
import PropTypes from "prop-types";

const StaticMap = ({ latitude, longitude }) => {
  // console.log(marker.longitude, marker.latitude)
  return (
    <div className="h-96 w-full relative rounded-xl">
      <Map
        initialViewState={{
          ...INITIAL_VIEW_STATE_CLICK_MAP,
          zoom: 10,
          longitude: longitude,
          latitude: latitude,
        }}
        reuseMaps
        style={{ width: "100%", height: "100%", borderRadius: "6px" }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v10"
      >
        <NavigationControl />
        <Marker
          latitude={latitude}
          longitude={longitude}
          anchor="bottom"
          draggable
        >
          <Pin size={20} />
        </Marker>
      </Map>
    </div>
  );
};

StaticMap.propTypes = {
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
};

export default StaticMap;
