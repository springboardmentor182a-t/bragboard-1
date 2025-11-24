function TimeFilter({ onChange }) {
  return (
    <select
      onChange={(e) => onChange(e.target.value)}
      style={{ padding: "8px", marginBottom: "20px" }}
    >
      <option value="weekly">Weekly</option>
      <option value="monthly">Monthly</option>
      <option value="quarterly">Quarterly</option>
      <option value="yearly">Yearly</option>
      <option value="overall">Overall</option>
    </select>
  );
}

export default TimeFilter;
