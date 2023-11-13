const MultiEventRow = ({ event }) => {
  return (
    <tr className="text-sm md:text-md">
      <td>{event._id}</td>
      <td>{event.debrisSize}</td>
      <td>{event.debrisMass}</td>
    </tr>
  );
};

export default MultiEventRow;
