import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// prevents SSR issues with certain mapbox components
const LocationAggregatorMap = dynamic(
  () => import("@/components/map/LocationAggregatorMap"),
  { ssr: false }
);

const HomePage = () => {
  const [details, setDetails] = useState([]);
  const [coordinates, setCoordinates] = useState([]);

  const locations = [];

  useEffect(() => {
    const getData = async () => {
      const res = await fetch('/api/mongo/event/all');
      const data = await res.json();
      const coords = data.map((item) => {
        return { COORDINATES: [item.mapLong, item.mapLat] };
      });
      setCoordinates(coords);
    };
    getData().then(r => console.log('Fetched locations'));
  }, []);

  return (
    <div className="relative min-h-screen">
      <LocationAggregatorMap data={coordinates} />
    </div>
  );
};

export default HomePage;
