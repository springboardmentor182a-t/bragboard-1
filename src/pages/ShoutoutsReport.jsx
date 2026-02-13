import { useState } from "react";
import FormatSelector from "../components/FormatSelector";
import ExportButton from "../components/ExportButton";

function ShoutoutsReport() {
  const [format, setFormat] = useState("csv");

  return (
    <div className="report-box">
      <FormatSelector format={format} setFormat={setFormat} />
      <ExportButton format={format} />
    </div>
  );
}

export default ShoutoutsReport;
