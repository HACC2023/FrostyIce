import { useControl } from "react-map-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";

const GeocoderControl = (props) => {
  const geocoder = useControl(
    () => {
      const ctrl = new MapboxGeocoder({
        ...props,
        autocomplete: false,
        marker: false,
        accessToken: props.mapboxAccessToken,
      });
      ctrl.on("loading", () => {
        // props.onLoading
        console.log("loading");
      });
      ctrl.on("results", () => {
        // props.onResults
        console.log("results");
      });
      ctrl.on("result", (event) => {
        console.log("event.result:", event.result)
        // props.onResult(event.result);

        const { result } = event;
        console.log("result", result);
        const location =
          result &&
          (result.center ||
            (result.geometry?.type === "Point" && result.geometry.coordinates));

        if (location) {
          props.setMarker({ longitude: location[0], latitude: location[1] });
        }
      });
      ctrl.on("error", () => props.onError);
      return ctrl;
    },
    {
      position: props.position,
    }
  );

  if (geocoder._map) {
    if (
      geocoder.getProximity() !== props.proximity &&
      props.proximity !== undefined
    ) {
      geocoder.setProximity(props.proximity);
    }
    if (
      geocoder.getRenderFunction() !== props.render &&
      props.render !== undefined
    ) {
      geocoder.setRenderFunction(props.render);
    }
    if (
      geocoder.getLanguage() !== props.language &&
      props.language !== undefined
    ) {
      geocoder.setLanguage(props.language);
    }
    if (geocoder.getZoom() !== props.zoom && props.zoom !== undefined) {
      geocoder.setZoom(props.zoom);
    }
    if (geocoder.getFlyTo() !== props.flyTo && props.flyTo !== undefined) {
      geocoder.setFlyTo(props.flyTo);
    }
    if (
      geocoder.getPlaceholder() !== props.placeholder &&
      props.placeholder !== undefined
    ) {
      geocoder.setPlaceholder(props.placeholder);
    }
    if (
      geocoder.getCountries() !== props.countries &&
      props.countries !== undefined
    ) {
      geocoder.setCountries(props.countries);
    }
    if (geocoder.getTypes() !== props.types && props.types !== undefined) {
      geocoder.setTypes(props.types);
    }
    if (
      geocoder.getMinLength() !== props.minLength &&
      props.minLength !== undefined
    ) {
      geocoder.setMinLength(props.minLength);
    }
    if (geocoder.getLimit() !== props.limit && props.limit !== undefined) {
      geocoder.setLimit(props.limit);
    }
    if (geocoder.getFilter() !== props.filter && props.filter !== undefined) {
      geocoder.setFilter(props.filter);
    }
    if (geocoder.getOrigin() !== props.origin && props.origin !== undefined) {
      geocoder.setOrigin(props.origin);
    }
  }
  return null
};

export default GeocoderControl;
