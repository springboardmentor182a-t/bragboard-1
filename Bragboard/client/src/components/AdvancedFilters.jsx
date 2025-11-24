function AdvancedFilters({ onDateChange, onDeptChange, onRegionChange }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>

      {/* Date */}
      <input 
        type="date" 
        onChange={(e) => onDateChange(e.target.value)} 
      />

      {/* Department */}
      <select onChange={(e) => onDeptChange(e.target.value)}>
        <option value="">All Departments</option>
        <option value="IT">IT</option>
        <option value="HR">HR</option>
        <option value="Admin">Admin</option>
      </select>

      {/* Region */}
      <select onChange={(e) => onRegionChange(e.target.value)}>
        <option value="">All Regions</option>
        <option value="South">South</option>
        <option value="North">North</option>
        <option value="East">East</option>
        <option value="West">West</option>
      </select>
    </div>
  );
}

export default AdvancedFilters;
