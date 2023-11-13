// components/Map.jsx
import React, { useCallback, useState } from "react";
import Map from "react-map-gl";
import { HexagonLayer, HeatmapLayer } from "@deck.gl/aggregation-layers";
// import { HexagonLayer } from "deck.gl";
import DeckGL from "@deck.gl/react";
import "mapbox-gl/dist/mapbox-gl.css";
import PropTypes from "prop-types";
import { FlyToInterpolator } from "deck.gl";

// import map config
import { lightingEffect, material } from "@/lib/mapconfig";
import { ISLANDS_CENTER_COORDINATES } from "@/constants/constants";

const LocationAggregatorMap = ({
  upperPercentile = 100,
  coverage = 1,
  data,
}) => {
  const [layers, setLayers] = useState(null);

  const [doneLoading, setDoneLoading] = useState(false);

  const mapVisLayers = {
    hexagonLayer: [
      new HexagonLayer({
        id: "heatmap",
        // colorRange,
        coverage,
        data,
        elevationRange: [0, 500],
        elevationScale: data && data.length ? 50 : 0,
        extruded: true,
        getPosition: (d) => d.COORDINATES,
        pickable: true,
        radius: 1000,
        upperPercentile,
        material,

        transitions: {
          elevationScale: 500,
        },
      }),
    ],

    heatmapLayer: [
      new HeatmapLayer({
        data,
        id: "heatmap-layer",
        pickable: false,
        getPosition: (d) => d.COORDINATES,
        radiusPixels: 10,
        intensity: 1,
        threshold: 0.03,
      }),
    ],
  };

  const [initialViewState, setInitialViewState] = useState({
    longitude: -157,
    latitude: 20.5,
    zoom: 6.5,
    minZoom: 5.6,
    bearing: 0,
    pitch: 40.5,
  });

  const onSelectIsland = useCallback(({ longitude, latitude, zoom }) => {
    setInitialViewState({
      longitude: longitude,
      latitude: latitude,
      zoom: zoom,
      minZoom: 5.6,
      pitch: 40.5,
      bearing: 0,
      transitionDuration: 1000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  }, []);

  const onSelectVisualization = (vis) => {
    setLayers(mapVisLayers[vis]);
  };

  function getTooltip({ object }) {
    if (!object) {
      return null;
    }
    const lat = object.position[1];
    const lng = object.position[0];
    const count = object.points.length;

    return `\
      Latitude: ${Number.isFinite(lat) ? lat.toFixed(6) : ""}
      Longitude: ${Number.isFinite(lng) ? lng.toFixed(6) : ""}
      ${count} debris report${count === 1 ? '' : 's'}`;
  }

  return (
    <div className="relative">
      <div className="md:flex md:py-2 gap-3 mt-2 md:mt-4 ms-3 md:ms-8 absolute top-0 left-0 z-50">
        <div>
          <h1 className="font-semibold text-xs ms-2 text-gray-100">Select Island</h1>
          <select
            className="select my-1 select-sm bg-[#1f3347] text-gray-100"
            onChange={(e) => {
              const mapInfo = JSON.parse(e.target.value);
              onSelectIsland({
                longitude: mapInfo.long,
                latitude: mapInfo.lat,
                zoom: mapInfo.zoom,
              });
            }}
          >
            <option disabled>Select an Island</option>
            {Object.values(ISLANDS_CENTER_COORDINATES).map((island) => (
              <option key={island.name} value={JSON.stringify(island.mapInfo)}>
                {island.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <h1 className="font-semibold text-xs ms-2 text-gray-100">Select Data Visualization</h1>
          <select
            className="select my-1 select-sm bg-[#1f3347] text-gray-100"
            onChange={(e) => {
              const vis = e.target.value;
              setLayers(mapVisLayers[vis]);
            }}
          >
            <option disabled>Select a Visualization</option>
            <option value="heatmapLayer">Heatmap</option>
            <option value="hexagonLayer">Hexagon Map</option>
          </select>
        </div>
      </div>
      <div className="h-[70vh] w-full relative">
        <DeckGL
          style={{ width: "100%", height: "100%" }}
          layers={layers ?? mapVisLayers.heatmapLayer}
          effects={[lightingEffect]}
          initialViewState={initialViewState}
          controller={true}
          getTooltip={getTooltip}
        >
          <Map
            reuseMaps
            style={{ width: "100%", height: "100%" }}
            controller={true}
            mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
            mapStyle="mapbox://styles/giorgio808/cloro3xca005y01pq4dkc11ib"
            onLoad={() => setDoneLoading(true)}
          />
        </DeckGL>
        {!doneLoading && (
          <div className="h-full w-full absolute bg-[#111] flex flex-col items-center justify-center">
            <div className="loading loading-ring text-white" />
            <div className="text-white text-xs py-1 italic font-thin">
              Loading map...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

LocationAggregatorMap.propTypes = {
  upperPercentile: PropTypes.number,
  coverage: PropTypes.number,
  data: PropTypes.array,
};

export default LocationAggregatorMap;
