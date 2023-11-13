import PropTypes from 'prop-types';

const EventCollapse = ({ children, title, checked, setCurrentChecked, index }) => {
  return (
    <div className="collapse bg-base-200 collapse-arrow">
      <input type="radio" name="my-accordion-2" checked={checked} onChange={() => setCurrentChecked(index)} />
      <div className="collapse-title text-xl font-medium">
        {title}
      </div>
      <div className="collapse-content">
        {children}
      </div>
    </div>
  );
};

export default EventCollapse;

EventCollapse.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  setCurrentChecked: PropTypes.func,
  index: PropTypes.number,
};
