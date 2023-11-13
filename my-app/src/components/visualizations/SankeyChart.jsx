import { ResponsiveSankey } from "@nivo/sankey";
import PropTypes from "prop-types";

const SankeyDiagram = ({ data }) => (
  <ResponsiveSankey
    data={data}
    margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
    align="justify"
    colors={{ scheme: "category10" }}
    nodeOpacity={0.9}
    nodeHoverOthersOpacity={0.5}
    nodeThickness={14}
    nodeSpacing={24}
    nodeBorderWidth={0}
    nodeBorderColor={{
      from: "color",
      modifiers: [["darker", 0.8]],
    }}
    nodeBorderRadius={3}
    linkOpacity={0.6}
    linkHoverOthersOpacity={0.3}
    linkContract={3}
    enableLinkGradient={true}
    labelPosition="outside"
    labelOrientation="horizontal"
    labelPadding={16}
    labelTextColor={{
      from: "color",
      modifiers: [["darker", 1]],
    }}
    // legends={[
    //   {

    //     anchor: "bottom-right",
    //     direction: "column",
    //     translateX: 230,
    //     itemWidth: 100,
    //     itemHeight: 14,
    //     itemDirection: "right-to-left",
    //     itemsSpacing: 1,
    //     itemTextColor: "#999",
    //     symbolSize: 10,
    //     effects: [
    //       {
    //         on: "hover",
    //         style: {
    //           itemTextColor: "#000",
    //         },
    //       },
    //     ],
    //   },
    // ]}
  />
);

const SankeyChart = ({ events, sortedMaterials }) => {
  const nodes = {};
  const links = [];

  // Merge arrays
  const mergeObjects = (event, material) => {
    return {
      ...event,
      ...material,
    };
  };

  const mergedArray = events.map((event) => {
    const material = sortedMaterials.find(
      (material) => material.eventId === event._id
    );
    if (material) {
      return mergeObjects(event, material);
    }
    return event;
  });

  const disposalEvents = mergedArray.filter(
    (obj) => obj.polymer && obj.disposalMechanism
  );

  console.log(disposalEvents);

  // Get node color based on id
  const getNodeColor = (id) => {
    const hash = id
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return `hsl(${hash % 360}, 70%, 50%)`;
  };

  disposalEvents.forEach((item) => {
    const { closestIsland, polymer, disposalMechanism } = item;

    // Update node counts
    nodes[closestIsland] = (nodes[closestIsland] || 0) + 1;
    nodes[polymer] = (nodes[polymer] || 0) + 1;
    nodes[disposalMechanism] = (nodes[disposalMechanism] || 0) + 1;

    // Create links
    links.push({ source: closestIsland, target: polymer, value: 1 });
    links.push({ source: polymer, target: disposalMechanism, value: 1 });
  });

  const nodesArray = Object.keys(nodes).map((id) => ({
    id,
    nodeColor: getNodeColor(id),
  }));

  // Convert links array to unique links based on source and target
  const uniqueLinks = links.reduce((acc, link) => {
    const existingLink = acc.find(
      (l) => l.source === link.source && l.target === link.target
    );
    if (existingLink) {
      existingLink.value += 1;
    } else {
      acc.push(link);
    }
    return acc;
  }, []);

  const sankeyData = { nodes: nodesArray, links: uniqueLinks };

  return (
    <div className="h-72 w-full">
      <SankeyDiagram data={sankeyData} />
    </div>
  );
};

SankeyChart.propTypes = {
  events: PropTypes.array.isRequired,
  sortedMaterials: PropTypes.array.isRequired,
};

SankeyDiagram.propTypes = {
  data: PropTypes.object.isRequired,
};

export default SankeyChart;
