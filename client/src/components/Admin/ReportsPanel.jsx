import React from "react";
import { SHOUTOUTS, getEmployeeName } from "../../data/constants"; // adjust path as needed

function ShoutOuts() {
  return (
    <div className="bg-white p-4 rounded shadow mb-6">
      <div className="font-bold mb-2">Recent ShoutOuts</div>
      <ul>
        {SHOUTOUTS.map(shout => (
          <li key={shout.id}>
            {shout.emoji}{" "}
            {getEmployeeName(shout.from)} recognized {getEmployeeName(shout.to)} for <span className="italic">{shout.reason}</span>
            {shout.tag ? <> (<span className="font-semibold">{shout.tag}</span>)</> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ShoutOuts;
