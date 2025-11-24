import { useState } from "react";

function ContributorsTable({ contributors = [] }) {
  const [sortBy, setSortBy] = useState("tags"); // 'name' or 'tags'
  const sorted = [...contributors].sort((a,b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    return b.tags - a.tags;
  });

  const exportCSV = () => {
    const header = ["Name","Department","Tags"];
    const rows = contributors.map(c => [c.name, c.dept || "", c.tags]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contributors.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
        <div>
          <button onClick={() => setSortBy("tags")}>Sort by Tags</button>
          <button onClick={() => setSortBy("name")} style={{ marginLeft: 8 }}>Sort by Name</button>
        </div>
        <div>
          <button onClick={exportCSV}>Export CSV</button>
        </div>
      </div>

      <table border="1" cellPadding="10" style={{ marginTop: "10px", width: "100%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Department</th>
            <th>Tags Received</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((u, idx) => (
            <tr key={idx}>
              <td>{u.name}</td>
              <td>{u.dept}</td>
              <td>{u.tags}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default ContributorsTable;
