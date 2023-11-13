import PropTypes from "prop-types";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { graphIsland } from "@/utils/graphIsland";

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Island Pie Chart
 * @param {Array} data
 * @returns {JSX.Element}
 */
const IslandPieChart = ({ data }) => {
  const { islands, completedEvents, notCompletedEvents } = graphIsland(data);
  const totalEvents = completedEvents.map(
    (value, index) => value + notCompletedEvents[index]
  );

  const dataPlot = {
    labels: islands,
    datasets: [
      {
        label: "% of Events",
        data: totalEvents,
        backgroundColor: ['#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#052e16'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: false,
        text: "",
      },
      legend: {
        position: "bottom",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="h-full py-4">
      <Pie data={dataPlot} options={options} />
    </div>
  );
};

IslandPieChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default IslandPieChart;
