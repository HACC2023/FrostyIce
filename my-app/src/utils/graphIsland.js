// Desc: Function to graph the number of completed and not completed events for each island
export const graphIsland = (data) => {
  const islands = [];
  const completedEvents = [];
  const notCompletedEvents = [];

  const uniqueIslands = Array.from(
    new Set(data.map((obj) => obj.closestIsland))
  ).filter(Boolean);

  // Calculate completed and not completed events for each island
  uniqueIslands.forEach((island) => {
    const islandCompletedEvents = data.filter(
      (obj) => obj.closestIsland === island && obj.status === "Complete"
    ).length;
    const islandNotCompletedEvents = data.filter(
      (obj) => obj.closestIsland === island && obj.status !== "Complete"
    ).length;

    islands.push(island);
    completedEvents.push(islandCompletedEvents);
    notCompletedEvents.push(islandNotCompletedEvents);
  });

  return { islands, completedEvents, notCompletedEvents };
};
