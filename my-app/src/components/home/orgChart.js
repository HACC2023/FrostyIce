import PropTypes from "prop-types";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

const OrgChart = ({ data }) => {

  const options = {
    plugins: {
      title: {
        display: false,
        text: "",
      },
    },
    legend: {
      display: true,
      position: "bottom",
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-fit h-fit mx-auto">
      <Line data={data} options={options} />
    </div>
  );
};

OrgChart.propTypes = {
  data: PropTypes.array.isRequired,
};

export default OrgChart;
