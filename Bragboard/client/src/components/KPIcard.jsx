function formatNumber(n){
  return n?.toLocaleString?.() ?? n;
}

function KPIcard({ title, value }) {
  return (
    <div className="kpi-card">
      <h3>{title}</h3>
      <h1>{formatNumber(value)}</h1>
    </div>
  );
}

export default KPIcard;
