import { exportShoutouts } from "../api/exportApi";

function ExportButton({ format }) {
  return (
    <button className="export-btn" onClick={() => exportShoutouts(format)}>
      Export {format.toUpperCase()}
    </button>
  );
}

export default ExportButton;
