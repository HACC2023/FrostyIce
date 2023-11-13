import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import PropTypes from "prop-types";

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 * Doughnut Chart
 * @param {array} data
 * @returns {JSX.Element}
 */
const DoughnutChart = ({ events, sortedMaterials }) => {
  const polymerOccurr = {};
  const bioRatingOccurr = {};
  const disposalOccurr = {};

  // Iterate through the array and update the count for each polymer
  sortedMaterials.forEach((item) => {
    const { polymer } = item;

    if (!polymerOccurr[polymer]) {
      polymerOccurr[polymer] = 0;
    }

    polymerOccurr[polymer]++;
  });

  const polymers = Object.keys(polymerOccurr);
  const polQnts = Object.values(polymerOccurr);

  // Iterate through the array and update the count for each biofouling rating
  events.forEach((item) => {
    const { publicBiofoulingRating } = item;

    // Map the ratings to desired groups (1-3, 4-5, 6-7)
    let groupedRating;
    if (publicBiofoulingRating >= 1 && publicBiofoulingRating <= 3) {
      groupedRating = "1-3";
    } else if (publicBiofoulingRating >= 4 && publicBiofoulingRating <= 6) {
      groupedRating = "4-6";
    } else if (publicBiofoulingRating >= 7 && publicBiofoulingRating <= 10) {
      groupedRating = "7-10";
    }

    // Update the count for the grouped rating
    if (!bioRatingOccurr[groupedRating]) {
      bioRatingOccurr[groupedRating] = 0;
    }
    bioRatingOccurr[groupedRating]++;
  });

  // Extract arrays for biofouling ratings and their corresponding quantities
  const bioRatings = Object.keys(bioRatingOccurr);
  const bioQnts = Object.values(bioRatingOccurr);

  // Iterate through the array and update the count for each disposal method
  sortedMaterials.forEach((item) => {
    const { disposalMechanism } = item;

    if (disposalMechanism !== undefined) {
      if (!disposalOccurr[disposalMechanism]) {
        disposalOccurr[disposalMechanism] = 0;
      }
      disposalOccurr[disposalMechanism]++;
    }
  });

  const disposalMtd = Object.keys(disposalOccurr);
  const disposalMtdQnts = Object.values(disposalOccurr);

  const htmlLegendPlugin = (legendContainerId) => {
    return {
      id: 'htmlLegend',
      afterUpdate(chart, args, options) {
        const ul = getOrCreateLegendList(chart, legendContainerId);

        // Remove old legend items
        while (ul.firstChild) {
          ul.firstChild.remove();
        }

        // Reuse the built-in legendItems generator
        const items = chart.options.plugins.legend.labels.generateLabels(chart);

        items.forEach(item => {
          const li = document.createElement('li');
          li.style.alignItems = 'center';
          li.style.cursor = 'pointer';
          li.style.display = 'inline-flex';
          li.style.flexDirection = 'row';
          li.style.marginLeft = '10px';
          li.style.whiteSpace = 'nowrap';

          li.onclick = () => {
            const {type} = chart.config;
            if (type === 'pie' || type === 'doughnut') {
              // Pie and doughnut charts only have a single dataset and visibility is per item
              chart.toggleDataVisibility(item.index);
            } else {
              chart.setDatasetVisibility(item.datasetIndex, !chart.isDatasetVisible(item.datasetIndex));
            }
            chart.update();
          };

          // Color box
          const boxSpan = document.createElement('span');
          boxSpan.style.background = item.fillStyle;
          boxSpan.style.borderColor = item.strokeStyle;
          boxSpan.style.borderWidth = item.lineWidth + 'px';
          boxSpan.style.display = 'inline-block';
          boxSpan.style.flexShrink = 0;
          boxSpan.style.height = '20px';
          boxSpan.style.marginRight = '10px';
          boxSpan.style.width = '20px';

          // Text
          const textContainer = document.createElement('p');
          textContainer.style.color = item.fontColor;
          textContainer.style.margin = 0;
          textContainer.style.padding = 0;
          textContainer.style.textDecoration = item.hidden ? 'line-through' : '';

          const text = document.createTextNode(item.text);
          textContainer.appendChild(text);

          li.appendChild(boxSpan);
          li.appendChild(textContainer);
          ul.appendChild(li);
        });
      }
    }
  };

  const dataPltPolymers = {
    labels: polymers,
    datasets: [
      {
        label: "Polymers",
        data: polQnts,
        backgroundColor: ['#22d3ee', '#06b6d4', '#06b6d4', '#0e7490', '#155e75', '#164e63', '#083344'],
        borderWidth: 1,
        hoverOffset: 4,
        legend: {
          display: false,
        },
      },
    ],
  };

  const dataPltBio = {
    labels: bioRatings,
    datasets: [
      {
        label: "Biofouling Rating",
        data: bioQnts,
        backgroundColor: ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#166534', '#14532d', '#052e16'],
        borderWidth: 1,
        hoverOffset: 4,
        legend: {
          display: false,
        },
      },
    ],
  };

  const dataPltDisposal = {
    labels: disposalMtd,
    datasets: [
      {
        label: "Disposal Method",
        data: disposalMtdQnts,
        backgroundColor: ['#fed7aa', '#fdba74', '#fb923c', '#f97316', '#ea580c', '#c2410c', '#9a3412', '#7c2d12', '#431407'],
        borderWidth: 1,
        hoverOffset: 4,
        legend: {
          display: false,
        },
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
        display: false,
      },
    },
    maintainAspectRatio: true,
    cutout: "50%",
  };

  const getOrCreateLegendList = (chart, id) => {
    const legendContainer = document.getElementById(id);
    let listContainer = legendContainer.querySelector('ul');

    if (!listContainer) {
      listContainer = document.createElement('ul');
      listContainer.style.display = 'inline-block';
      listContainer.style.columnCount = id === 'disposalLegendContainer' ? '1' : '2';
      listContainer.style.flexDirection = 'row';
      listContainer.style.marginLeft = 'auto';
      listContainer.style.marginRight = 'auto';
      listContainer.style.marginTop = '5px';
      listContainer.style.padding = 0;
      listContainer.style.fontSize = '11px';

      legendContainer.appendChild(listContainer);
    }

    return listContainer;
  };

  return (
    <div className="row grid grid-cols-3 w-full m-2">
      <div className="h-fit col">
        <div className="h-72 md:h-[22rem] px-5">
          <h6 className="text-secondary text-sm font-bold mb-4 text-center">
            Polymer
          </h6>
          <Doughnut data={dataPltPolymers} options={options} plugins={[htmlLegendPlugin('polyLegendContainer')]} className="mx-auto" />
          <div id="polyLegendContainer" className="mt-2"/>
        </div>
      </div>
      <div className="h-fit col">
        <div className="h-72 md:h-[22rem] px-5">
          <h6 className="text-secondary text-sm font-bold mb-4 text-center">
            Bio Fouling Rating
          </h6>
          <Doughnut data={dataPltBio} options={options} plugins={[htmlLegendPlugin('bioLegendContainer')]} className="mx-auto" />
          <div id="bioLegendContainer" className="mt-2" />
        </div>
      </div>
      <div className="h-72 col">
        <div className="h-64 md:h-[22rem] px-5">
          <h6 className="text-secondary text-sm font-bold mb-4 text-center">
            Disposal Method
          </h6>
          <Doughnut data={dataPltDisposal} options={options} plugins={[htmlLegendPlugin('disposalLegendContainer')]} className="mx-auto" />
          <div id="disposalLegendContainer" className="mt-2" />
        </div>
      </div>
    </div>
  );
};

DoughnutChart.propTypes = {
  sortedMaterials: PropTypes.array.isRequired,
  events: PropTypes.array.isRequired,
};

export default DoughnutChart;
