import PropTypes from "prop-types";
import { STATUS } from "@/constants/constants";

const ProgressBar = ({ status, setCurrentChecked }) => {
  const statusIndex = STATUS.indexOf(status);
  const baseClass = 'step cursor-pointer hover:brightness-110 transition-all';
  return (
    <div className="flex justify-center py-3">
      <ul className="steps steps-horizontal">
        <li
          data-content="✓"
          className={baseClass + ' step-primary z-40'}
          onClick={() => setCurrentChecked(0)}
        >
          <button className="hover:brightness-150 transition-all" onClick={() => setCurrentChecked(0)}>
            Reported
          </button>
        </li>
        <li
          data-content={statusIndex > 1 ? '✓' : '●'}
          className={`${baseClass} ${statusIndex > 0 ? 'step-primary z-30' : 'z-30'}`}
          onClick={() => setCurrentChecked(1)}
        >
          <button className="hover:brightness-150 transition-all" onClick={() => setCurrentChecked(1)}>
            Removal &amp; Storage
          </button>
        </li>
        <li
          data-content={statusIndex > 2 ? '✓' : '●'}
          className={`${baseClass} ${statusIndex > 1 ? 'step-primary z-20' : 'z-20'}`}
          onClick={() => setCurrentChecked(2)}
        >
          <button className="hover:brightness-150 transition-all" onClick={() => setCurrentChecked(2)}>
            Sorting
          </button>
        </li>
        <li
          data-content={statusIndex > 3 ? '✓' : '●'}
          className={`${baseClass} ${statusIndex > 2 ? 'step-primary z-10' : 'z-10'}`}
          onClick={() => setCurrentChecked(3)}
        >
          <button className="hover:brightness-150 transition-all" onClick={() => setCurrentChecked(3)}>
            Disposal
          </button>
        </li>
      </ul>
    </div>
  );
}

ProgressBar.propTypes = {
  status: PropTypes.string.isRequired,
  setCurrentChecked: PropTypes.func.isRequired,
};

export default ProgressBar;
