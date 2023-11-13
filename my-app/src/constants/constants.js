export const DISPOSAL_MECHANISMS = [
  "Repurposed for Infrastructure",
  "Repurposed for Research",
  "Stored for Future Use",
  "Burned for Power",
  "Landfill",
  "Burned",
  "Left in Environment",
];

export const STATUS = [
  "Reported",
  "Removal and Storage",
  "Sorting",
  "Disposal",
  "Complete",
];

export const POLYMERS = [
  "CA",
  "EVA",
  "HDPE",
  "Nylon",
  "PET",
  "PP",
  "PS",
  "PVB",
];

export const ISLANDS = [
  "Big Island",
  "Maui",
  "Molokai",
  "Lanai",
  "Oahu",
  "Kauai",
  "At-sea Offshore",
];

export const ISLANDS_CENTER_COORDINATES = {
  ALL_ISLANDS: {
    name: "All Islands",
    mapInfo: { lat: 21, long: -157, zoom: 5.6 },
  },
  BIG_ISLAND: {
    name: "Big Island",
    mapInfo: { lat: 19.6385, long: -155.5565, zoom: 7.5 },
  },
  MAUI: {
    name: "Maui",
    mapInfo: { lat: 20.9064, long: -156.3, zoom: 8.5 },
  },
  MOLOKAI: {
    name: "Molokai",
    mapInfo: {
      lat: 21.1526,
      long: -157.0965,
      zoom: 9,
    },
  },
  LANAI: {
    name: "Lanai",
    mapInfo: { lat: 20.8423, long: -156.9378, zoom: 10 },
  },
  KAHOOLAWE: {
    name: "Kahoolawe",
    mapInfo: { lat: 20.5501, long: -156.6168, zoom: 11 },
  },
  OAHU: {
    name: "Oahu",
    mapInfo: { lat: 21.4337, long: -157.9636, zoom: 8.7 },
  },
  KAUAI: {
    name: "Kauai",
    mapInfo: { lat: 22.057, long: -159.5233, zoom: 9 },
  },
  NIIHAU: {
    name: "Niihau",
    mapInfo: { lat: 21.8969, long: -160.1551, zoom: 10 },
  },
};



export const STORAGE_NODES = [
  "CMDR Hub",
  "Maui Node",
  "Big Island Node",
  "Kauai Node",
];
