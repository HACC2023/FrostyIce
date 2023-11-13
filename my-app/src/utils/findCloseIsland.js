// boundaries are ~ five miles from coast of each island
const centerKauai = [22.0570, -159.5233];
const kauiRadiusBoundary = 0.319; // ~ 22 miles in decimal degrees
const centerNiiahu = [21.8969, -160.1551];
const niiahuRadiusBoundary = 0.202; // ~ 14 miles
const centerOahu = [21.4337, -157.9636];
const oahuRadiusBoundary = 0.406; // ~ 28 miles
const molokaiTopLeftBoundary = [21.2657, -157.3408];
const molokaiTopRightBoundary = [21.2388, -156.6810];
const molokaiBottomLeftBoundary = [21.0389, -157.3705];
const molokaiBottomRightBoundary = [21.0056, -156.6952];
const centerLanai = [20.8423, -156.9378];
const lanaiRadiusBoundary = 0.174; // ~ 12 miles
const centerWestMaui = [20.9064, -156.5765];
const westMauiRadiusBoundary = 0.202; // ~ 14 miles
const centerEastMaui = [20.7493, -156.2390];
const eastMauiRadiusBoundary = 0.319; // ~ 22 miles
const kahoolaweCenter = [20.5501, -156.6168];
const kahoolaweRadiusBoundary = 0.145; // ~ 10 miles
const centerBigIsland = [19.6385, -155.5565];
const bigIslandRadiusBoundary = 0.797; // ~ 55 miles

export function findCloseIsland(lat, long) {
  if (Math.sqrt((lat - centerKauai[0]) ** 2 + (long - centerKauai[1]) ** 2) <= kauiRadiusBoundary) {
    return 'Kauai';
  }
  if (Math.sqrt((lat - centerOahu[0]) ** 2 + (long - centerOahu[1]) ** 2) <= oahuRadiusBoundary) {
    return 'Oahu';
  }
  if (Math.sqrt((lat - centerWestMaui[0]) ** 2 + (long - centerWestMaui[1]) ** 2) <= westMauiRadiusBoundary
    || Math.sqrt((lat - centerEastMaui[0]) ** 2 + (long - centerEastMaui[1]) ** 2) <= eastMauiRadiusBoundary) {
    return 'Maui';
  }
  if (Math.sqrt((lat - centerBigIsland[0]) ** 2 + (long - centerBigIsland[1]) ** 2) <= bigIslandRadiusBoundary) {
    return 'Big Island';
  }
  if (lat >= molokaiBottomRightBoundary[0] && lat <= molokaiTopLeftBoundary[0]
    && long >= molokaiTopLeftBoundary[1] && long <= molokaiTopRightBoundary[1]) {
    return 'Molokai';
  }
  if (Math.sqrt((lat - centerLanai[0]) ** 2 + (long - centerLanai[1]) ** 2) <= lanaiRadiusBoundary) {
    return 'Lanai';
  }
  if (Math.sqrt((lat - kahoolaweCenter[0]) ** 2 + (long - kahoolaweCenter[1]) ** 2) <= kahoolaweRadiusBoundary) {
    return 'Maui';
  }
  if (Math.sqrt((lat - centerNiiahu[0]) ** 2 + (long - centerNiiahu[1]) ** 2) <= niiahuRadiusBoundary) {
    return 'Kauai';
  }
  return 'At-sea Offshore';
}
