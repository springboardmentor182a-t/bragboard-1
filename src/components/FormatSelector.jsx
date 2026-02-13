function FormatSelector({ format, setFormat }) {
  return (
    <div className="selector">
      <label>Select Format:</label>
      <select value={format} onChange={(e) => setFormat(e.target.value)}>
        <option value="csv">CSV</option>
        <option value="pdf">PDF</option>
      </select>
    </div>
  );
}

export default FormatSelector;
