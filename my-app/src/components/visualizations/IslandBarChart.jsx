import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { graphIsland } from "@/utils/graphIsland";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    title: {
      display: false,
      text: "",
    },
    legend: {
      position: "bottom",
    },
  },
  interaction: {
    mode: "index",
    intersect: false,
  },
  scales: {
    x: {
      stacked: true,
      grid: {
        display: false,
      },
    },
    y: {
      stacked: true,
    },
  },
};

/**
 * Island Bar Chart
 * @param {Array} data
 * @returns {JSX.Element}
 */
const IslandBarChart = ({ data }) => {
  const [graphReady, setGraphReady] = useState(false);

  const { islands, completedEvents, notCompletedEvents } = graphIsland(data);

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    };

    fetchData().then(() => {
      setGraphReady(true);
    });
  }, []);


  const dataPlot = {
    labels: islands,
    datasets: [
      {
        label: "Complete",
        data: completedEvents,
        backgroundColor: '#0e7490',
        stack: "Stack 0",
      },
      {
        label: "In Progress",
        data: notCompletedEvents,
        backgroundColor: '#06b6d4',
        stack: "Stack 0",
      },
    ],
  };

  return (
    <div className="h-full flex flex-col">
      <Bar options={options} data={dataPlot} className="my-auto" />

      {graphReady ? (
        <></>
      ) : (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

IslandBarChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default IslandBarChart;
