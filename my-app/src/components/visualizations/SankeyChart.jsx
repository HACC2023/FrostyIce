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
    nodeTooltip={(node) => {
      // get approx width of title
      const toNodeWidth = node.node.id.length * 8 + 115;
      // if link is on the right side of the chart, move tooltip to the left
      const transform = node.node.x0 > 10 ? `translate(-${toNodeWidth}px, -15px)` : 'translate(15px, -15px)';
      return <div className="pointer-events-none absolute z-10 top-0 left-0" style={{ transform: transform }}>
        <div className="bg-white rounded-sm shadow px-2">
          <div className="whitespace-pre flex items-center">
            <strong>{node.node.id}</strong>
            <span className="block w-3 h-3 mx-2" style={{ background: node.node.color }}></span>
            <strong>{node.node.formattedValue} kg</strong>
          </div>
        </div>
      </div>;
    }}
    linkOpacity={0.6}
    linkHoverOthersOpacity={0.3}
    linkContract={3}
    linkTooltip={(node) => {
      // get approx width of title
      const toNodeWidth = node.link.target.id.length * 8 + 175;
      // if link is on the right side of the chart, move tooltip to the left
      const transform = node.link.source.x0 > 10 ? `translate(-${toNodeWidth}px, -15px)` : 'translate(15px, -15px)';
      return <div className="pointer-events-none absolute z-10 top-0 left-0" style={{ transform: transform }}>
        <div className="bg-white rounded-sm shadow px-2">
          <div className="whitespace-pre flex items-center">
            <span className="flex items-center">
              <span className="block w-3 h-3 me-2" style={{ background: node.link.source.color }}></span>
              <strong>{node.link.source.id}</strong>
              &nbsp;&gt;&nbsp;
              <strong>{node.link.target.id}</strong>
              <span className="block w-3 h-3 mx-2" style={{ background: node.link.target.color }}></span>
              <strong>{node.link.formattedValue} kg</strong>
            </span>
          </div>
        </div>
      </div>;
    }}
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

  // Get node color based on id
  const getNodeColor = (id) => {
    const hash = id
      .split("")
      .reduce((acc, char) => char.charCodeAt(0) + acc, 0);
    return `hsl(${hash % 360}, 70%, 50%)`;
  };

  disposalEvents.forEach((item) => {
    const { closestIsland, polymer, disposalMechanism, mass } = item;

    // Update node counts
    nodes[closestIsland] = (nodes[closestIsland] || 0) + 1;
    nodes[polymer] = (nodes[polymer] || 0) + mass;
    nodes[disposalMechanism] = (nodes[disposalMechanism] || 0) + mass;

    // Create links
    links.push({ source: closestIsland, target: polymer, value: mass });
    links.push({ source: polymer, target: disposalMechanism, value: mass });
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
