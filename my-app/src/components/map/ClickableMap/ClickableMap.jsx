import Map, { GeolocateControl, Marker } from "react-map-gl";
import Pin from "./Pin";
import { useState, useCallback, useRef } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  INITIAL_VIEW_STATE,
  INITIAL_VIEW_STATE_CLICK_MAP,
} from "@/lib/mapconfig";
import GeocoderControl from "./GeocoderControl";

// setCoordinates is a function that sets the coordinates in the parent component
const ClickableMap = ({ setCoordinates }) => {
  const [marker, setMarker] = useState(null);
  // const [isMapLoading, setIsMapLoading] = useState(true);

  // ref to GeolocateControl
  const geoControlRef = useRef();
  // console.log("geoControlRef", geoControlRef.current);

  // When done dragging, update marker position
  const onMarkerDragEnd = useCallback(
    (event) => {
      setMarker({ longitude: event.lngLat.lng, latitude: event.lngLat.lat });
      setCoordinates({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
      });
    },
    [setCoordinates]
  );

  // When clicked, update marker position
  const onMapClick = useCallback(
    (event) => {
      setMarker({ longitude: event.lngLat.lng, latitude: event.lngLat.lat });
      setCoordinates({
        longitude: event.lngLat.lng,
        latitude: event.lngLat.lat,
      });
    },
    [setCoordinates]
  );

  // console.log(marker.longitude, marker.latitude)
  return (
    <div className="h-[400px] w-full relative">
      <Map
        initialViewState={{
          ...INITIAL_VIEW_STATE_CLICK_MAP,
          longitude: marker ? marker.longitude : INITIAL_VIEW_STATE.longitude,
          latitude: marker ? marker.latitude : INITIAL_VIEW_STATE.latitude,
        }}
        reuseMaps
        controller={true}
        style={{ width: "100%", height: "100%" }}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v10"
        onClick={onMapClick}
      >
        {marker && (
          <Marker
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
            draggable
            onDragEnd={onMarkerDragEnd}
          >
            <Pin size={20} />
          </Marker>
        )}
        <GeocoderControl
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          setMarker={setMarker}
          position="top-left"
        />
        <GeolocateControl
          ref={geoControlRef}
          onGeolocate={(e) => {
            console.log("e", e);
            setMarker({
              longitude: e.coords.longitude,
              latitude: e.coords.latitude,
            });
          }}
          showUserLocation={false}
          position="bottom-right"
        />
      </Map>
    </div>
  );
};

export default ClickableMap;
