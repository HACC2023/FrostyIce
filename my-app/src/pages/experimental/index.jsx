const { default: Link } = require("next/link");

const ExperimentalPage = () => {
  return (
    <div className="p-5 flex flex-col gap-3">
      <Link className="underline text-blue-600" href="/experimental/heatmap">Heatmap Test</Link>
      <Link className="underline text-blue-600" href="/experimental/click-map">Clicking on Map to get Location Test</Link>
      <Link className="underline text-blue-600" href="/experimental/uploadthing">Uploadthing Test</Link>
      <Link className="underline text-blue-600" href="/home">Home page test</Link>
    </div>
  );
};

export default ExperimentalPage;